import { create } from "zustand";
import type { SchemeDetails } from "../types/scheme";
import { fetchSchemeDetailsAPI } from "../api/scheme";

interface SchemeDetailsStore {
  query: string;
  schemes: SchemeDetails[];
  loading: boolean;
  error: string | null;
  setQuery: (query: string) => void;
  fetchSchemes: (query: string) => Promise<void>;
}

let abortController: AbortController | null = null;

export const useSchemeDetailsStore = create<SchemeDetailsStore>((set) => ({
  query: "",
  schemes: [],
  loading: false,
  error: null,
  setQuery: (query) => set({ query }),
  fetchSchemes: async (query) => {
    abortController?.abort();
    abortController = new AbortController();

    if (!query.trim()) {
      set({ schemes: [], loading: false, error: null });
      return;
    }

    set({ loading: true, error: null });
    try {
      const data = await fetchSchemeDetailsAPI(
        query.toLowerCase(),
        abortController.signal
      );
      set({ schemes: data, loading: false });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        set({ loading: false });
        return;
      }
      set({
        error: "Failed to fetch schemes. Please try again.",
        loading: false,
        schemes: [],
      });
    }
  },
}));
