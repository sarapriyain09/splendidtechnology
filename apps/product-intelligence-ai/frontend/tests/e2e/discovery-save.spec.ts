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
  const title = (await row.locator("td").nth(0).innerText()).trim();
  const source = (await row.locator("td").nth(1).innerText()).trim();

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
  await expect(persistedRow.locator("td").nth(1)).toContainText(source);
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
    const title = (await row.locator("td").nth(0).innerText()).trim();
    const source = (await row.locator("td").nth(1).innerText()).trim();

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
    await expect(savedRow.locator("td").nth(1)).toContainText(source);
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
