import { expect, test } from "@playwright/test";

test("discovery save persists after reload", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Discovery Workbench" })).toBeVisible();

  await page.getByRole("button", { name: "Search" }).click();

  const row = page
    .locator("tbody tr")
    .filter({ has: page.getByRole("button", { name: /^Save$/ }) })
    .first();
  await expect(row).toBeVisible();
  const title = (await row.locator("td").nth(1).innerText()).trim();
  const source = (await row.locator("td").nth(2).innerText()).trim();

  await row.getByRole("button", { name: /^Save$/ }).click();
  const savedRow = page
    .locator("tbody tr")
    .filter({ has: page.locator("td", { hasText: title }) })
    .filter({ has: page.locator("td", { hasText: source }) })
    .first();
  await expect(savedRow.getByRole("button", { name: /^Saved$/ })).toBeDisabled();
  await expect(page.getByText(new RegExp(`Saved ${title} as record #\\d+\\.`))).toBeVisible();

  await page.reload();

  await page.getByRole("button", { name: "Search" }).click();

  const persistedRow = page
    .locator("tbody tr")
    .filter({ has: page.locator("td", { hasText: title }) })
    .first();
  await expect(persistedRow).toBeVisible();
  await expect(persistedRow.locator("td").nth(2)).toContainText(source);
  await expect(persistedRow.getByRole("button", { name: /^Saved$/ })).toBeDisabled();
  await expect(persistedRow.locator("span", { hasText: /^Saved$/ })).toBeVisible();
});

test("discovery keeps saved rows locked while unsaved rows stay actionable", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Discovery Workbench" })).toBeVisible();

  await page.getByRole("button", { name: "Search" }).click();

  const saveButtons = page.getByRole("button", { name: /^Save$/ });
  const hasUnsavedRow = (await saveButtons.count()) > 0;

  if (hasUnsavedRow) {
    const row = page
      .locator("tbody tr")
      .filter({ has: page.getByRole("button", { name: /^Save$/ }) })
      .first();
    await expect(row).toBeVisible();
    const title = (await row.locator("td").nth(1).innerText()).trim();
    const source = (await row.locator("td").nth(2).innerText()).trim();

    await row.getByRole("button", { name: /^Save$/ }).click();
    const justSavedRow = page
      .locator("tbody tr")
      .filter({ has: page.locator("td", { hasText: title }) })
      .filter({ has: page.locator("td", { hasText: source }) })
      .first();
    await expect(justSavedRow.getByRole("button", { name: /^Saved$/ })).toBeDisabled();
    await expect(page.getByText(new RegExp(`Saved ${title} as record #\\d+\\.`))).toBeVisible();

    await page.reload();
    await page.getByRole("button", { name: "Search" }).click();

    const savedRow = page
      .locator("tbody tr")
      .filter({ has: page.locator("td", { hasText: title }) })
      .first();
    await expect(savedRow).toBeVisible();
    await expect(savedRow.locator("td").nth(2)).toContainText(source);
    await expect(savedRow.getByRole("button", { name: /^Saved$/ })).toBeDisabled();
    await expect(savedRow.locator("span", { hasText: /^Saved$/ })).toBeVisible();

    const remainingSaveButtons = page.getByRole("button", { name: /^Save$/ });
    if ((await remainingSaveButtons.count()) > 0) {
      await expect(remainingSaveButtons.first()).toBeEnabled();
    }
  } else {
    const firstSavedButton = page.getByRole("button", { name: /^Saved$/ }).first();
    await expect(firstSavedButton).toBeVisible();
    await expect(firstSavedButton).toBeDisabled();
  }
});

test("bulk save saves selected unsaved rows and locks them", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Discovery Workbench" })).toBeVisible();

  const bulkSaveButton = page.getByRole("button", { name: /Save Selected \(\d+\)/ });
  await expect(bulkSaveButton).toBeDisabled();

  await page.getByRole("button", { name: "Search" }).click();

  const unsavedRows = page
    .locator("tbody tr")
    .filter({ has: page.getByRole("button", { name: /^Save$/ }) });
  const unsavedCount = await unsavedRows.count();

  if (unsavedCount === 0) {
    await expect(page.getByRole("button", { name: /^Saved$/ }).first()).toBeVisible();
    await expect(bulkSaveButton).toBeDisabled();
    return;
  }

  const targetCount = Math.min(2, unsavedCount);

  for (let i = 0; i < targetCount; i += 1) {
    const row = unsavedRows.nth(i);
    await row.locator('input[type="checkbox"][aria-label^="Select "]').check();
  }

  await expect(page.getByRole("button", { name: new RegExp(`Save Selected \\(${targetCount}\\)`) })).toBeEnabled();
  await page.getByRole("button", { name: new RegExp(`Save Selected \\(${targetCount}\\)`) }).click();

  await expect(page.getByText(new RegExp(`Bulk save complete: ${targetCount} new, 0 existing\\.`))).toBeVisible();

  await expect(page.getByRole("button", { name: /^Save$/ })).toHaveCount(Math.max(0, unsavedCount - targetCount));
  const savedButtons = page.getByRole("button", { name: /^Saved$/ });
  await expect(savedButtons.first()).toBeVisible();
  await expect(savedButtons.first()).toBeDisabled();
  await expect(page.getByRole("button", { name: /Save Selected \(0\)/ })).toBeDisabled();
});

test("saved records supports filter, details view, and remove", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Discovery Workbench" })).toBeVisible();
  await page.getByRole("button", { name: "Search" }).click();

  const discoveryRow = page
    .locator("tbody tr")
    .filter({ has: page.getByRole("button", { name: /^Save$/ }) })
    .first();

  await expect(discoveryRow).toBeVisible();
  const title = (await discoveryRow.locator("td").nth(1).innerText()).trim();

  await discoveryRow.getByRole("button", { name: /^Save$/ }).click();
  await expect(page.getByText(new RegExp(`Saved ${title} as record #\\d+\\.`))).toBeVisible();

  await page.getByRole("button", { name: "Refresh Saved" }).click();

  const savedFilterInput = page.getByLabel("Filter saved records");
  await savedFilterInput.fill(title);

  const savedRow = page
    .locator("tbody tr")
    .filter({ has: page.locator("td", { hasText: title }) })
    .filter({ has: page.getByRole("button", { name: "Details" }) })
    .first();
  await expect(savedRow).toBeVisible();
  const savedRecordId = (await savedRow.locator("td").nth(0).innerText()).trim();

  await savedRow.getByRole("button", { name: "Details" }).click();
  const savedDetailsPanel = page.locator("aside", { hasText: "Saved Details" });
  await expect(savedDetailsPanel).toContainText(`Product: ${title}`);

  await page.getByRole("button", { name: /^Remove #\d+$/ }).click();
  await expect(page.getByText(/Removed saved record #\d+\./)).toBeVisible();

  await expect(
    page
      .locator("tbody tr")
      .filter({ has: page.locator("td", { hasText: savedRecordId }) })
      .filter({ has: page.getByRole("button", { name: "Details" }) })
  ).toHaveCount(0);
});

test("discovery query hydrates from URL parameters", async ({ page }) => {
  await page.goto(
    "/?keyword=monitor&category=ergonomic&min_price=12&max_price=88&market=amazon_eu&sources=etsy_public_api,alibaba_public_api&page=3&page_size=10&sort_by=price&sort_order=asc"
  );

  await expect(page.getByRole("heading", { name: "Discovery Workbench" })).toBeVisible();

  await expect(page.getByPlaceholder("Keyword")).toHaveValue("monitor");
  await expect(page.getByPlaceholder("Category (optional)")).toHaveValue("ergonomic");
  await expect(page.getByPlaceholder("Min price")).toHaveValue("12");
  await expect(page.getByPlaceholder("Max price")).toHaveValue("88");
  await expect(page.getByRole("combobox", { name: "Results per page" })).toHaveValue("10");
  await expect(page.getByRole("combobox").first()).toHaveValue("amazon_eu");

  await expect(page.getByRole("button", { name: "etsy_public_api" })).toHaveClass(/bg-slateDeep/);
  await expect(page.getByRole("button", { name: "alibaba_public_api" })).toHaveClass(/bg-slateDeep/);
  await expect(page.getByRole("button", { name: "amazon_public_api" })).toHaveClass(/bg-slate-100/);

  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText(/Total: \d+ \| Page 1 of \d+/)).toBeVisible();
});

test("discovery updates URL query string when filters change", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Discovery Workbench" })).toBeVisible();

  await page.getByPlaceholder("Keyword").fill("keyboard");
  await page.getByPlaceholder("Category (optional)").fill("office");
  await page.getByPlaceholder("Min price").fill("15");
  await page.getByPlaceholder("Max price").fill("65");
  await page.getByRole("combobox").first().selectOption("amazon_us");
  await page.getByRole("combobox", { name: "Results per page" }).selectOption("20");

  await page.getByRole("button", { name: "etsy_public_api" }).click();

  await expect(page).toHaveURL(/keyword=keyboard/);
  await expect(page).toHaveURL(/category=office/);
  await expect(page).toHaveURL(/min_price=15/);
  await expect(page).toHaveURL(/max_price=65/);
  await expect(page).toHaveURL(/market=amazon_us/);
  await expect(page).toHaveURL(/page_size=20/);
  await expect(page).toHaveURL(/sources=etsy_public_api/);
  await expect(page).toHaveURL(/page=1/);

  await page.getByRole("button", { name: "Price Low-High" }).click();
  await expect(page).toHaveURL(/sort_by=price/);
  await expect(page).toHaveURL(/sort_order=asc/);
  await expect(page).toHaveURL(/page=1/);
});
