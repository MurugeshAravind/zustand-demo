import { test, expect } from "@playwright/test";

test.describe("MF Explorer Search", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows the hero heading and search input", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /explore indian mutual funds/i })
    ).toBeVisible();
    await expect(
      page.getByPlaceholder("Search mutual fund schemes...")
    ).toBeVisible();
  });

  test("shows popular search chips on initial load", async ({ page }) => {
    await expect(page.getByText("Start searching")).toBeVisible();
    await expect(page.getByRole("button", { name: "HDFC" })).toBeVisible();
    await expect(page.getByRole("button", { name: "SBI" })).toBeVisible();
  });

  test("searches for schemes and shows results", async ({ page }) => {
    const searchInput = page.getByPlaceholder(
      "Search mutual fund schemes..."
    );
    await searchInput.fill("HDFC");

    // Wait for results to load (debounce + API)
    await expect(page.getByText(/scheme[s]? found/)).toBeVisible({
      timeout: 10000,
    });

    // Should have at least one card with "View Details" button
    await expect(
      page.getByRole("button", { name: "View Details" }).first()
    ).toBeVisible();
  });

  test("expands card to show fund details", async ({ page }) => {
    const searchInput = page.getByPlaceholder(
      "Search mutual fund schemes..."
    );
    await searchInput.fill("SBI");

    await expect(page.getByText(/scheme[s]? found/)).toBeVisible({
      timeout: 10000,
    });

    // Click the first "View Details" button
    await page.getByRole("button", { name: "View Details" }).first().click();

    // Should show fund details (NAV label)
    await expect(page.getByText("NAV").first()).toBeVisible({
      timeout: 10000,
    });

    // Should show "Hide Details" button
    await expect(
      page.getByRole("button", { name: "Hide Details" }).first()
    ).toBeVisible();
  });

  test("clears search with clear button", async ({ page }) => {
    const searchInput = page.getByPlaceholder(
      "Search mutual fund schemes..."
    );
    await searchInput.fill("HDFC");

    await expect(page.getByText(/scheme[s]? found/)).toBeVisible({
      timeout: 10000,
    });

    // Click clear button
    await page.getByLabel("Clear search").click();

    // Should go back to initial state
    await expect(page.getByText("Start searching")).toBeVisible();
    await expect(searchInput).toHaveValue("");
  });

  test("shows empty state for non-matching query", async ({ page }) => {
    const searchInput = page.getByPlaceholder(
      "Search mutual fund schemes..."
    );
    await searchInput.fill("xyznonexistentfund12345");

    await expect(page.getByText("No schemes found")).toBeVisible({
      timeout: 10000,
    });
  });

  test("dark mode toggle works", async ({ page }) => {
    const toggle = page.getByLabel(/switch to dark mode/i);
    await toggle.click();

    // HTML element should have dark class
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Toggle back
    await page.getByLabel(/switch to light mode/i).click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });
});
