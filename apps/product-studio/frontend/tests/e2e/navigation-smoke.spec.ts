import { expect, test } from "@playwright/test";

const NAV_EXPECTATIONS = [
  { navLabel: "Product Research", path: "/product-research", heading: "Product Research" },
  { navLabel: "Market Analysis", path: "/market-analysis", heading: "Market Analysis" },
  { navLabel: "Review Intelligence", path: "/review-intelligence", heading: "Review Intelligence" },
  { navLabel: "Manufacturing", path: "/manufacturing", heading: "Manufacturing Intelligence" },
  { navLabel: "Suppliers", path: "/suppliers", heading: "Suppliers" },
  { navLabel: "Prototype", path: "/prototype", heading: "Prototype Roadmap" },
  { navLabel: "Cost Calculator", path: "/cost-calculator", heading: "Cost Calculator" },
  { navLabel: "B2B", path: "/b2b", heading: "B2B Opportunity Explorer" },
  { navLabel: "Reports", path: "/reports", heading: "Reports" },
  { navLabel: "Settings", path: "/settings", heading: "Settings" },
] as const;

test("left navigation routes load expected module screens", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Products Analysed")).toBeVisible();

  for (const item of NAV_EXPECTATIONS) {
    await page.getByRole("link", { name: item.navLabel }).click();
    await expect(page).toHaveURL(new RegExp(`${item.path}$`));
    await expect(page.getByRole("heading", { name: item.heading })).toBeVisible();
  }

  await page.getByRole("link", { name: "Dashboard" }).click();
  await expect(page).toHaveURL(/\/($|\?)/);
  await expect(page.getByText("Products Analysed")).toBeVisible();
});
