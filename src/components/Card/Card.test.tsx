import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Card from "./Card";

vi.mock("./CardDetails", () => ({
  default: ({ id }: { id: number }) => (
    <div data-testid="card-details">Details for {id}</div>
  ),
}));

describe("Card", () => {
  it("renders scheme name and code", () => {
    render(<Card schemeCode={119598} schemeName="HDFC Equity Fund" />);

    expect(screen.getByText("HDFC Equity Fund")).toBeInTheDocument();
    expect(screen.getByText("#119598")).toBeInTheDocument();
  });

  it("shows 'View Details' button initially", () => {
    render(<Card schemeCode={123} schemeName="Test Fund" />);

    expect(screen.getByText("View Details")).toBeInTheDocument();
  });

  it("does not show CardDetails initially", () => {
    render(<Card schemeCode={123} schemeName="Test Fund" />);

    expect(screen.queryByTestId("card-details")).not.toBeInTheDocument();
  });

  it("expands to show CardDetails on click", async () => {
    const user = userEvent.setup();
    render(<Card schemeCode={123} schemeName="Test Fund" />);

    await user.click(screen.getByText("View Details"));

    expect(screen.getByTestId("card-details")).toBeInTheDocument();
    expect(screen.getByText("Details for 123")).toBeInTheDocument();
    expect(screen.getByText("Hide Details")).toBeInTheDocument();
  });

  it("collapses on second click", async () => {
    const user = userEvent.setup();
    render(<Card schemeCode={123} schemeName="Test Fund" />);

    await user.click(screen.getByText("View Details"));
    expect(screen.getByTestId("card-details")).toBeInTheDocument();

    await user.click(screen.getByText("Hide Details"));
    expect(screen.queryByTestId("card-details")).not.toBeInTheDocument();
    expect(screen.getByText("View Details")).toBeInTheDocument();
  });
});
