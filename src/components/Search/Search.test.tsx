import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBox from "./Search";
import { useSchemeDetailsStore } from "../../store/useSchemeDetailsStore";

vi.mock("../../store/useSchemeDetailsStore");
vi.mock("../Card/Card", () => ({
  default: ({
    schemeCode,
    schemeName,
  }: {
    schemeCode: number;
    schemeName: string;
  }) => (
    <div data-testid={`card-${schemeCode}`}>
      {schemeName}
    </div>
  ),
}));

const mockedUseStore = vi.mocked(useSchemeDetailsStore);

const defaultState = {
  query: "",
  schemes: [],
  loading: false,
  error: null,
  setQuery: vi.fn(),
  fetchSchemes: vi.fn(),
};

describe("SearchBox", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseStore.mockReturnValue({ ...defaultState });
  });

  it("renders the search input", () => {
    render(<SearchBox />);

    expect(
      screen.getByPlaceholderText("Search mutual fund schemes...")
    ).toBeInTheDocument();
  });

  it("shows initial state with popular search chips when no query", () => {
    render(<SearchBox />);

    expect(screen.getByText("Start searching")).toBeInTheDocument();
    expect(screen.getByText("HDFC")).toBeInTheDocument();
    expect(screen.getByText("SBI")).toBeInTheDocument();
  });

  it("calls setQuery when typing", async () => {
    const setQuery = vi.fn();
    mockedUseStore.mockReturnValue({ ...defaultState, setQuery });

    const user = userEvent.setup();
    render(<SearchBox />);

    await user.type(
      screen.getByPlaceholderText("Search mutual fund schemes..."),
      "H"
    );

    expect(setQuery).toHaveBeenCalledWith("H");
  });

  it("shows clear button only when query exists", () => {
    mockedUseStore.mockReturnValue({ ...defaultState, query: "" });
    const { rerender } = render(<SearchBox />);

    expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();

    mockedUseStore.mockReturnValue({ ...defaultState, query: "HDFC" });
    rerender(<SearchBox />);

    expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
  });

  it("clears query when clear button is clicked", async () => {
    const setQuery = vi.fn();
    mockedUseStore.mockReturnValue({
      ...defaultState,
      query: "HDFC",
      setQuery,
    });

    const user = userEvent.setup();
    render(<SearchBox />);

    await user.click(screen.getByLabelText("Clear search"));
    expect(setQuery).toHaveBeenCalledWith("");
  });

  it("shows loading skeletons when loading", () => {
    mockedUseStore.mockReturnValue({ ...defaultState, loading: true });

    render(<SearchBox />);

    expect(screen.getByText("Searching...")).toBeInTheDocument();
  });

  it("shows error state with retry button", () => {
    const fetchSchemes = vi.fn();
    mockedUseStore.mockReturnValue({
      ...defaultState,
      query: "test",
      error: "Failed to fetch schemes. Please try again.",
      fetchSchemes,
    });

    render(<SearchBox />);

    expect(
      screen.getByText("Failed to fetch schemes. Please try again.")
    ).toBeInTheDocument();
    expect(screen.getByText("Try again")).toBeInTheDocument();
  });

  it("shows empty state for queries with no results", () => {
    mockedUseStore.mockReturnValue({
      ...defaultState,
      query: "xyznonexistent",
      schemes: [],
    });

    render(<SearchBox />);

    expect(screen.getByText("No schemes found")).toBeInTheDocument();
  });

  it("renders scheme cards when results are available", () => {
    mockedUseStore.mockReturnValue({
      ...defaultState,
      query: "HDFC",
      schemes: [
        { schemeCode: 123, schemeName: "HDFC Fund A" },
        { schemeCode: 456, schemeName: "HDFC Fund B" },
      ],
    });

    render(<SearchBox />);

    expect(screen.getByText("2 schemes found")).toBeInTheDocument();
    expect(screen.getByTestId("card-123")).toBeInTheDocument();
    expect(screen.getByTestId("card-456")).toBeInTheDocument();
  });

  it("clicking a popular search chip calls setQuery", async () => {
    const setQuery = vi.fn();
    mockedUseStore.mockReturnValue({ ...defaultState, setQuery });

    const user = userEvent.setup();
    render(<SearchBox />);

    await user.click(screen.getByText("SBI"));
    expect(setQuery).toHaveBeenCalledWith("SBI");
  });
});
