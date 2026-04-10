import type { SchemeDetails } from "../types/scheme";

export const fetchSchemeDetailsAPI = async (
  query: string,
  signal?: AbortSignal
): Promise<SchemeDetails[]> => {
  const res = await fetch(
    `https://api.mfapi.in/mf/search?q=${encodeURIComponent(query)}`,
    { signal }
  );
  if (!res.ok) throw new Error("Failed to fetch schemes");
  return res.json();
};
