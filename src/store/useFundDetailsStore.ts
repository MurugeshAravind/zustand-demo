import { create } from "zustand";
import { fetchFundDetailsAPI } from "../api/fund";
import type { FundDetails } from "../types/fund";

interface FundDetailsStore {
  funds: Record<number, FundDetails>;
  loading: Record<number, boolean>;
  errors: Record<number, string>;
  fetchFundDetails: (id: number) => Promise<void>;
}

export const useFundDetailsStore = create<FundDetailsStore>((set, get) => ({
  funds: {},
  loading: {},
  errors: {},
  fetchFundDetails: async (id) => {
    if (get().funds[id]) return;

    set((state) => ({
      loading: { ...state.loading, [id]: true },
      errors: Object.fromEntries(
        Object.entries(state.errors).filter(([key]) => key !== String(id))
      ),
    }));

    try {
      const data = await fetchFundDetailsAPI(id);
      set((state) => ({
        funds: { ...state.funds, [id]: data },
        loading: { ...state.loading, [id]: false },
      }));
    } catch {
      set((state) => ({
        loading: { ...state.loading, [id]: false },
        errors: { ...state.errors, [id]: "Failed to load fund details" },
      }));
    }
  },
}));
