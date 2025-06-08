import { create } from "zustand";
import { fetchFundDetailsAPI } from "../api/fund";
import type { FundDetails } from "../types/fund";

interface FundDetailsStore {
  funds: Record<number, FundDetails>;
  loading: boolean;
  fetchFundDetails: (id: number) => Promise<void>;
}

export const useFundDetailsStore = create<FundDetailsStore>((set, get) => ({
  funds: {},
  loading: false,
  fetchFundDetails: async (id) => {
    const existing = get().funds[id];
    console.log(existing);
    if (existing) return; // Skip if already fetched
    set({ loading: true });
    try {
      const data = await fetchFundDetailsAPI(id);
      set((state) => ({
        funds: { ...state.funds, [id]: data },
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to fetch scheme details:", error);
      set({ loading: false });
    }
  },
}));
