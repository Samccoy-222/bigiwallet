import { create } from "zustand";
import { createClient } from "@supabase/supabase-js";

interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  created_at: string;
  category_id: string;
}

interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

interface TicketCategory {
  id: string;
  name: string;
  description: string;
}

interface TicketStore {
  tickets: Ticket[];
  categories: TicketCategory[];
  selectedTicket: Ticket | null;
  messages: TicketMessage[];
  loading: boolean;
  error: string | null;
  fetchTickets: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  createTicket: (data: Partial<Ticket>) => Promise<void>;
  updateTicket: (id: string, data: Partial<Ticket>) => Promise<void>;
  fetchMessages: (ticketId: string) => Promise<void>;
  sendMessage: (ticketId: string, message: string) => Promise<void>;
  selectTicket: (ticket: Ticket | null) => void;
  resetTicket: () => void;
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
    },
  }
);

export const useTicketStore = create<TicketStore>((set) => ({
  tickets: [],
  categories: [],
  selectedTicket: null,
  messages: [],
  loading: false,
  error: null,

  fetchTickets: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      set({ tickets: data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const { data, error } = await supabase
        .from("ticket_categories")
        .select("*");

      if (error) throw error;
      set({ categories: data });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  createTicket: async (ticketData) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("tickets")
        .insert([ticketData])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ tickets: [data, ...state.tickets] }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateTicket: async (id, ticketData) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("tickets")
        .update(ticketData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        tickets: state.tickets.map((ticket) =>
          ticket.id === id ? { ...ticket, ...data } : ticket
        ),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchMessages: async (ticketId) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("ticket_messages")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      set({ messages: data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  sendMessage: async (ticketId, message) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("ticket_messages")
        .insert([
          {
            ticket_id: ticketId,
            message,
            sender_id: (await supabase.auth.getUser()).data.user?.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ messages: [...state.messages, data] }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  selectTicket: (ticket) => {
    set({ selectedTicket: ticket });
  },
  resetTicket: () => {
    set({
      tickets: [],
      selectedTicket: null,
    });
  },
}));
