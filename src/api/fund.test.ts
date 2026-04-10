import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchFundDetailsAPI } from "./fund";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("fetchFundDetailsAPI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch fund details by ID", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ meta: {}, data: [], status: "SUCCESS" }),
    });

    await fetchFundDetailsAPI(119598);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.mfapi.in/mf/119598"
    );
  });

  it("should throw on non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

    await expect(fetchFundDetailsAPI(999)).rejects.toThrow(
      "Failed to fetch fund details"
    );
  });

  it("should return parsed fund data on success", async () => {
    const mockData = {
      meta: { scheme_code: 123, scheme_name: "Test", fund_house: "AMC" },
      data: [{ date: "10-04-2026", nav: "45.67" }],
      status: "SUCCESS",
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchFundDetailsAPI(123);
    expect(result).toEqual(mockData);
  });
});
