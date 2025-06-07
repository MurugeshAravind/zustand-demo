// src/api/scheme.ts
import type { SchemeDetails } from "../types/scheme";

export const fetchSchemeDetailsAPI = async (
  query: string
): Promise<SchemeDetails[]> => {
  const res = await fetch(`https://api.mfapi.in/mf/search?q=${query}`);
  if (!res.ok) throw new Error("Failed to fetch scheme details");
  return res.json();
};
