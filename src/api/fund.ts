import type { FundDetails } from "../types/fund";

export const fetchFundDetailsAPI = async (
  id: number
): Promise<FundDetails> => {
  const res = await fetch(`https://api.mfapi.in/mf/${id}`);
  if (!res.ok) throw new Error("Failed to fetch fund details");
  return res.json();
};
