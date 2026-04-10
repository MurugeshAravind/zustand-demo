import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSchemeDetailsStore } from "./useSchemeDetailsStore";

vi.mock("../api/scheme", () => ({
  fetchSchemeDetailsAPI: vi.fn(),
}));

const { fetchSchemeDetailsAPI } = await import("../api/scheme");
const mockedFetchSchemes = vi.mocked(fetchSchemeDetailsAPI);

describe("useSchemeDetailsStore", () => {
  beforeEach(() => {
    useSchemeDetailsStore.setState({
      query: "",
      schemes: [],
      loading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  it("should initialize with default state", () => {
    const state = useSchemeDetailsStore.getState();
    expect(state.query).toBe("");
    expect(state.schemes).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should update query via setQuery", () => {
    useSchemeDetailsStore.getState().setQuery("HDFC");
    expect(useSchemeDetailsStore.getState().query).toBe("HDFC");
  });

  it("should not fetch on empty/whitespace query", async () => {
    await useSchemeDetailsStore.getState().fetchSchemes("   ");

    expect(mockedFetchSchemes).not.toHaveBeenCalled();
    expect(useSchemeDetailsStore.getState().schemes).toEqual([]);
    expect(useSchemeDetailsStore.getState().loading).toBe(false);
    expect(useSchemeDetailsStore.getState().error).toBeNull();
  });

  it("should fetch and store schemes on valid query", async () => {
    const mockData = [{ schemeCode: 123, schemeName: "HDFC Equity Fund" }];
    mockedFetchSchemes.mockResolvedValueOnce(mockData);

    await useSchemeDetailsStore.getState().fetchSchemes("HDFC");

    expect(mockedFetchSchemes).toHaveBeenCalledWith(
      "hdfc",
      expect.any(AbortSignal)
    );
    expect(useSchemeDetailsStore.getState().schemes).toEqual(mockData);
    expect(useSchemeDetailsStore.getState().loading).toBe(false);
  });

  it("should convert query to lowercase before fetching", async () => {
    mockedFetchSchemes.mockResolvedValueOnce([]);

    await useSchemeDetailsStore.getState().fetchSchemes("SBI BLUECHIP");

    expect(mockedFetchSchemes).toHaveBeenCalledWith(
      "sbi bluechip",
      expect.any(AbortSignal)
    );
  });

  it("should set error state on fetch failure", async () => {
    mockedFetchSchemes.mockRejectedValueOnce(new Error("Network error"));

    await useSchemeDetailsStore.getState().fetchSchemes("test");

    const state = useSchemeDetailsStore.getState();
    expect(state.error).toBe("Failed to fetch schemes. Please try again.");
    expect(state.schemes).toEqual([]);
    expect(state.loading).toBe(false);
  });

  it("should ignore AbortError without setting error state and reset loading", async () => {
    const abortError = new DOMException("Aborted", "AbortError");
    mockedFetchSchemes.mockRejectedValueOnce(abortError);

    await useSchemeDetailsStore.getState().fetchSchemes("test");

    expect(useSchemeDetailsStore.getState().error).toBeNull();
    expect(useSchemeDetailsStore.getState().loading).toBe(false);
  });

  it("should clear schemes and error on empty query", async () => {
    useSchemeDetailsStore.setState({
      schemes: [{ schemeCode: 1, schemeName: "Old" }],
      error: "Old error",
    });

    await useSchemeDetailsStore.getState().fetchSchemes("");

    const state = useSchemeDetailsStore.getState();
    expect(state.schemes).toEqual([]);
    expect(state.error).toBeNull();
  });
});
