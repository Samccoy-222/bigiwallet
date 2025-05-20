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

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Wallets {
  ethereum: {
    address: string;
  };
  bitcoin: {
    address: string;
  };
}

interface AuthState {
  isAuthenticated: boolean;
  user: any;
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
  const ethWallet = EthWallet.fromPhrase(mnemonic);

  const root = bip32.HDKey.fromMasterSeed(seed);
  const child = root.derive("m/44'/0'/0'/0/0");

  if (!child.publicKey) throw new Error("Missing publicKey in derived key");

  const pubKeyHash = ripemd160(sha256(child.publicKey));
  const payload = new Uint8Array(21);
  payload[0] = 0x00; // Bitcoin mainnet prefix
  payload.set(pubKeyHash, 1);

  const btcAddress = bs58check.encode(Buffer.from(payload));

  return {
    ethereum: { address: ethWallet.address },
    bitcoin: { address: btcAddress },
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      mnemonic: null,
      wallets: null,
      justRegistered: false,

      initialize: async () => {
        const { data } = await supabase.auth.getSession();
        const user = data.session?.user ?? null;
        set({ user, isAuthenticated: !!user });
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
          .select("eth_address, btc_address")
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
            ethereum: { address: profile.eth_address },
            bitcoin: { address: profile.btc_address },
          },
          isAuthenticated: true,
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
          },
        ]);
        if (profileError) throw profileError;

        set({
          user: data.user,
          isAuthenticated: true,
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
        user: state.user,
        mnemonic: state.mnemonic,
        wallets: state.wallets,
        justRegistered: state.justRegistered,
      }),
    }
  )
);
