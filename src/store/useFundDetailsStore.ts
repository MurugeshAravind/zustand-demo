// src/store/useSchemeDetailsStore.ts
import { create } from "zustand";
import type { FundDetails } from "../types/fund";
import { fetchFundDetailsAPI } from "../api/fund";

interface FundDetailsStore {
  id: number | undefined;
  fund: FundDetails;
  loading: boolean;
  setFundID: (id: number) => void;
  fetchFundDetails: (id: number) => Promise<void>;
}

export const useFundDetailsStore = create<FundDetailsStore>((set) => ({
  id: undefined,
  fund: {
    data: [
      {
        date: "",
        nav: "",
      },
    ][0],
    meta: {
      scheme_category: "",
      scheme_code: 0,
      scheme_name: "",
      scheme_type: "",
      fund_house: "",
      isin_growth: null,
      isin_div_reinvestment: null,
    },
    status: "",
  },
  loading: false,
  setFundID: (id) => set({ id }),
  fetchFundDetails: async (id) => {
    set({ loading: true });
    try {
      console.log("id", id);
      const data = await fetchFundDetailsAPI(id);
      console.log({ data });
      set({ fund: data, loading: false });
    } catch (error) {
      console.error("Failed to fetch scheme details:", error);
      set({ loading: false });
    }
  },
}));
