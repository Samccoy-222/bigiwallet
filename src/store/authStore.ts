import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';
import { generateMnemonic } from 'bip39';
import { Wallet } from 'ethers';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface AuthState {
  isAuthenticated: boolean;
  user: any;
  mnemonic: string | null;
  justRegistered: boolean;
  setJustRegistered: () => Promise<void>;
  initialize: () => Promise<void>; 
  login: (email: string, password: string) =>Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  createWallet: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  mnemonic: null,
  justRegistered: false,

  initialize: async () => {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user ?? null;
    set({ user, isAuthenticated: !!user });
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    set({ user: data.user, isAuthenticated: true });
  },

  register: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    const mnemonic = generateMnemonic();
    const wallet = Wallet.fromPhrase(mnemonic);

    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ user_id: data.user?.id, wallet_address: wallet.address }]);
    if (profileError) throw profileError;

    set({ user: data.user, isAuthenticated: true, mnemonic, justRegistered: true });
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, isAuthenticated: false, mnemonic: null });
  },

  createWallet: async () => {
    const mnemonic = generateMnemonic();
    const wallet = Wallet.fromPhrase(mnemonic);
    const { error } = await supabase
      .from('profiles')
      .update({ wallet_address: wallet.address })
      .eq('user_id', get().user?.id);
    if (error) throw error;
    set({ mnemonic });
  },
  setJustRegistered : async () => {
    set({justRegistered: false})
  }
}));
