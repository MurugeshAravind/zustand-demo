import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import CardDetails from "./CardDetails";
import { useFundDetailsStore } from "../../store/useFundDetailsStore";

vi.mock("../../store/useFundDetailsStore", () => ({
  useFundDetailsStore: vi.fn(),
}));

const mockedUseStore = vi.mocked(useFundDetailsStore);
const mockFetchFundDetails = vi.fn();

const mockFund = {
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

describe("CardDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchFundDetails.mockResolvedValue(undefined);
  });

  function setupStore(overrides: {
    fund?: typeof mockFund | undefined;
    isLoading?: boolean;
    error?: string | undefined;
  }) {
    mockedUseStore.mockImplementation((selector: unknown) => {
      const state = {
        funds: overrides.fund ? { 123: overrides.fund } : {},
        loading: { 123: overrides.isLoading ?? false },
        errors: overrides.error ? { 123: overrides.error } : {},
        fetchFundDetails: mockFetchFundDetails,
      };
      return (selector as (s: typeof state) => unknown)(state);
    });
  }

  it("shows loading skeletons when loading", () => {
    setupStore({ isLoading: true });

    render(<CardDetails id={123} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows error message on failure", () => {
    setupStore({ error: "Failed to load fund details" });

    render(<CardDetails id={123} />);

    expect(screen.getByText("Failed to load fund details")).toBeInTheDocument();
  });

  it("renders fund details with NAV", () => {
    setupStore({ fund: mockFund });

    render(<CardDetails id={123} />);

    expect(screen.getByText("HDFC AMC")).toBeInTheDocument();
    expect(screen.getByText("Equity Scheme")).toBeInTheDocument();
    expect(screen.getByText("Open Ended")).toBeInTheDocument();
    expect(screen.getByText("\u20B945.67")).toBeInTheDocument();
    expect(screen.getByText("10-04-2026")).toBeInTheDocument();
  });

  it("calls fetchFundDetails on mount", () => {
    setupStore({});

    render(<CardDetails id={123} />);

    expect(mockFetchFundDetails).toHaveBeenCalledWith(123);
  });

  it("renders nothing when no fund and not loading", () => {
    setupStore({});

    const { container } = render(<CardDetails id={123} />);

    expect(container.innerHTML).toBe("");
  });
});
