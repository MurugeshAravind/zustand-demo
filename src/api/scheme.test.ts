import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchSchemeDetailsAPI } from "./scheme";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("fetchSchemeDetailsAPI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should URL-encode the query parameter", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await fetchSchemeDetailsAPI("SBI & Co");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.mfapi.in/mf/search?q=SBI%20%26%20Co",
      { signal: undefined }
    );
  });

  it("should pass the abort signal to fetch", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    const controller = new AbortController();
    await fetchSchemeDetailsAPI("test", controller.signal);

    expect(mockFetch).toHaveBeenCalledWith(expect.any(String), {
      signal: controller.signal,
    });
  });

  it("should throw on non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    await expect(fetchSchemeDetailsAPI("test")).rejects.toThrow(
      "Failed to fetch schemes"
    );
  });

  it("should return parsed JSON on success", async () => {
    const mockData = [{ schemeCode: 1, schemeName: "Test Fund" }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchSchemeDetailsAPI("test");
    expect(result).toEqual(mockData);
  });
});
