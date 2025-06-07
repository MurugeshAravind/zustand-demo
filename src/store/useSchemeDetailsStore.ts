// src/store/useSchemeDetailsStore.ts
import { create } from "zustand";
import type { SchemeDetails } from "../types/scheme";
import { fetchSchemeDetailsAPI } from "../api/scheme";

interface SchemeDetailsStore {
  query: string;
  scheme: SchemeDetails[];
  loading: boolean;
  setQuery: (query: string) => void;
  fetchSchemeDetails: (query: string) => Promise<void>;
}

export const useSchemeDetailsStore = create<SchemeDetailsStore>((set) => ({
  query: "",
  scheme: [],
  loading: false,
  setQuery: (query) => set({ query }),
  fetchSchemeDetails: async (query) => {
    set({ loading: true });
    try {
      const data = await fetchSchemeDetailsAPI(query.toLowerCase());
      set({ scheme: data, loading: false });
    } catch (error) {
      console.error("Failed to fetch scheme details:", error);
      set({ loading: false });
    }
  },
}));
