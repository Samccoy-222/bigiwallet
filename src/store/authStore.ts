import { create } from "zustand";
import { createClient } from "@supabase/supabase-js";
import { generateMnemonic } from "bip39";
import { Wallet as EthWallet } from "ethers";
import * as bip32 from "@scure/bip32";
import { mnemonicToSeed } from "@scure/bip39";
import { sha256 } from "@noble/hashes/sha256";
import { ripemd160 } from "@noble/hashes/ripemd160";
import bs58check from "bs58check";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Wallets {
  ethereum: {
    address: string;
    privateKey: string;
  };
  bitcoin: {
    address: string;
    privateKey: string;
  };
}

interface AuthState {
  isAuthenticated: boolean;
  user: any;
  isAdmin: boolean;
  mnemonic: string | null;
  wallets: Wallets | null;
  justRegistered: boolean;
  setJustRegistered: () => Promise<void>;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  createWallet: () => Promise<void>;
}

export async function generateWallets(mnemonic: string): Promise<Wallets> {
  const seed = await mnemonicToSeed(mnemonic);

  // Ethereum
  const ethWallet = EthWallet.fromPhrase(mnemonic); // ethers v6
  const ethAddress = ethWallet.address;
  const ethPrivateKey = ethWallet.privateKey;

  // Bitcoin
  const root = bip32.HDKey.fromMasterSeed(seed);
  const child = root.derive("m/44'/0'/0'/0/0");

  if (!child.publicKey || !child.privateKey) {
    throw new Error("Missing keys in derived Bitcoin HD node");
  }

  const pubKeyHash = ripemd160(sha256(child.publicKey));
  const payload = new Uint8Array(21);
  payload[0] = 0x00; // Bitcoin mainnet
  payload.set(pubKeyHash, 1);

  const btcAddress = bs58check.encode(Buffer.from(payload));
  const btcPrivateKey = Buffer.from(child.privateKey).toString("hex");

  return {
    ethereum: {
      address: ethAddress,
      privateKey: ethPrivateKey,
    },
    bitcoin: {
      address: btcAddress,
      privateKey: btcPrivateKey,
    },
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      isAdmin: false,
      mnemonic: null,
      wallets: null,
      justRegistered: false,

      initialize: async () => {
        const { data } = await supabase.auth.getSession();
        const user = data.session?.user ?? null;

        const { data: profile, error } = await supabase
          .from("profiles")
          .select(
            "is_admin, mnemonic, eth_address, btc_address, eth_privateKey, btc_privateKey"
          )
          .eq("user_id", user?.id)
          .single();

        if (error) {
          console.error("Failed to fetch admin status from profiles:", error);
        }

        const isAdmin = profile?.is_admin === true;
        set({
          user,
          isAuthenticated: !!user,
          isAdmin,
          mnemonic: profile?.mnemonic || null,
        });
      },
      login: async (email, password) => {
        const { data: authData, error } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });
        if (error) throw error;

        const user = authData.user;

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select(
            "eth_address, btc_address, eth_privateKey, btc_privateKey, mnemonic, is_admin"
          )
          .eq("user_id", user.id)
          .single();

        if (profileError) throw profileError;

        set({
          user: {
            ...user,
            eth_address: profile.eth_address,
            btc_address: profile.btc_address,
          },
          wallets: {
            ethereum: {
              address: profile.eth_address,
              privateKey: profile.eth_privateKey,
            },
            bitcoin: {
              address: profile.btc_address,
              privateKey: profile.btc_privateKey,
            },
          },
          isAuthenticated: true,
          isAdmin: profile.is_admin,
          mnemonic: profile.mnemonic,
        });
      },

      register: async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) throw error;

        const mnemonic = generateMnemonic();
        const wallets = await generateWallets(mnemonic);

        const { error: profileError } = await supabase.from("profiles").insert([
          {
            user_id: data.user?.id,
            mnemonic,
            eth_address: wallets.ethereum.address,
            btc_address: wallets.bitcoin.address,
            eth_privateKey: wallets.ethereum.privateKey,
            btc_privateKey: wallets.bitcoin.privateKey,
          },
        ]);
        if (profileError) throw profileError;
        const { error: emailError } = await supabase.functions.invoke(
          "send-welcome-email",
          {
            body: JSON.stringify({
              email,
            }),
          }
        );
        if (emailError) toast.error("Sending welcome email failed!");

        set({
          user: data.user,
          isAuthenticated: true,
          isAdmin: false,
          mnemonic,
          wallets,
          justRegistered: true,
        });
      },

      logout: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        set({
          user: null,
          isAuthenticated: false,
          mnemonic: null,
          wallets: null,
        });
      },

      createWallet: async () => {
        const mnemonic = generateMnemonic();
        const wallets = await generateWallets(mnemonic);

        const { error } = await supabase
          .from("profiles")
          .update({
            eth_address: wallets.ethereum.address,
            btc_address: wallets.bitcoin.address,
          })
          .eq("user_id", get().user?.id);
        if (error) throw error;

        set({ mnemonic, wallets });
      },

      setJustRegistered: async () => {
        set({ justRegistered: false });
      },
    }),
    {
      name: "auth-store", // 🔐 localStorage key
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        user: state.user,
        mnemonic: state.mnemonic,
        wallets: state.wallets,
        justRegistered: state.justRegistered,
      }),
    }
  )
);
