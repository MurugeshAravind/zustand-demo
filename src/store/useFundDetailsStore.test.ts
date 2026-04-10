import { describe, it, expect, vi, beforeEach } from "vitest";
import { useFundDetailsStore } from "./useFundDetailsStore";

vi.mock("../api/fund", () => ({
  fetchFundDetailsAPI: vi.fn(),
}));

const { fetchFundDetailsAPI } = await import("../api/fund");
const mockedFetchFund = vi.mocked(fetchFundDetailsAPI);

const mockFundDetails = {
  meta: {
    fund_house: "HDFC AMC",
    scheme_type: "Open Ended",
    scheme_category: "Equity Scheme",
    scheme_code: 123,
    scheme_name: "HDFC Equity Fund",
    isin_growth: null,
    isin_div_reinvestment: null,
  },
  data: [{ date: "10-04-2026", nav: "45.67" }],
  status: "SUCCESS",
};

describe("useFundDetailsStore", () => {
  beforeEach(() => {
    useFundDetailsStore.setState({
      funds: {},
      loading: {},
      errors: {},
    });
    vi.clearAllMocks();
  });

  it("should initialize with empty state", () => {
    const state = useFundDetailsStore.getState();
    expect(state.funds).toEqual({});
    expect(state.loading).toEqual({});
    expect(state.errors).toEqual({});
  });

  it("should fetch and cache fund details", async () => {
    mockedFetchFund.mockResolvedValueOnce(mockFundDetails);

    await useFundDetailsStore.getState().fetchFundDetails(123);

    const state = useFundDetailsStore.getState();
    expect(state.funds[123]).toEqual(mockFundDetails);
    expect(state.loading[123]).toBe(false);
  });

  it("should skip fetch if fund is already cached", async () => {
    useFundDetailsStore.setState({
      funds: { 123: mockFundDetails },
      loading: {},
      errors: {},
    });

    await useFundDetailsStore.getState().fetchFundDetails(123);

    expect(mockedFetchFund).not.toHaveBeenCalled();
  });

  it("should set per-fund loading state", async () => {
    let resolve!: (value: typeof mockFundDetails) => void;
    const pending = new Promise<typeof mockFundDetails>((r) => {
      resolve = r;
    });
    mockedFetchFund.mockReturnValueOnce(pending);

    const fetchPromise = useFundDetailsStore.getState().fetchFundDetails(123);

    // Fund 123 should be loading
    expect(useFundDetailsStore.getState().loading[123]).toBe(true);
    // Fund 456 should NOT be affected
    expect(useFundDetailsStore.getState().loading[456]).toBeUndefined();

    resolve(mockFundDetails);
    await fetchPromise;

    expect(useFundDetailsStore.getState().loading[123]).toBe(false);
  });

  it("should set per-fund error on failure", async () => {
    mockedFetchFund.mockRejectedValueOnce(new Error("Network error"));

    await useFundDetailsStore.getState().fetchFundDetails(123);

    const state = useFundDetailsStore.getState();
    expect(state.errors[123]).toBe("Failed to load fund details");
    expect(state.loading[123]).toBe(false);
    expect(state.funds[123]).toBeUndefined();
  });

  it("should clear error on retry", async () => {
    // First call fails
    mockedFetchFund.mockRejectedValueOnce(new Error("fail"));
    await useFundDetailsStore.getState().fetchFundDetails(123);
    expect(useFundDetailsStore.getState().errors[123]).toBe(
      "Failed to load fund details"
    );

    // Second call succeeds — error should be cleared during loading
    mockedFetchFund.mockResolvedValueOnce(mockFundDetails);
    // Remove the cached fund guard by keeping funds empty (it already is)
    const fetchPromise = useFundDetailsStore.getState().fetchFundDetails(123);

    // While loading, error should be cleared
    expect(useFundDetailsStore.getState().errors[123]).toBeUndefined();
    expect(useFundDetailsStore.getState().loading[123]).toBe(true);

    await fetchPromise;

    expect(useFundDetailsStore.getState().funds[123]).toEqual(mockFundDetails);
    expect(useFundDetailsStore.getState().errors[123]).toBeUndefined();
  });

  it("should handle multiple funds independently", async () => {
    mockedFetchFund
      .mockResolvedValueOnce(mockFundDetails)
      .mockRejectedValueOnce(new Error("fail"));

    await useFundDetailsStore.getState().fetchFundDetails(123);
    await useFundDetailsStore.getState().fetchFundDetails(456);

    const state = useFundDetailsStore.getState();
    expect(state.funds[123]).toEqual(mockFundDetails);
    expect(state.funds[456]).toBeUndefined();
    expect(state.errors[456]).toBe("Failed to load fund details");
  });
});
