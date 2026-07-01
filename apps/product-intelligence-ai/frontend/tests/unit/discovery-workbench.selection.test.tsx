import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DiscoveryWorkbench } from "@/components/discovery-workbench";
import {
  deleteSavedAnalysis,
  fetchDiscoveryProducts,
  fetchSavedAnalyses,
  fetchSavedDiscoveryRowKeys,
  saveProductAnalysesBulk,
  saveProductAnalysis,
} from "@/lib/api";

vi.mock("@/lib/api", () => ({
  fetchDiscoveryProducts: vi.fn(),
  fetchSavedDiscoveryRowKeys: vi.fn(),
  saveProductAnalysis: vi.fn(),
  saveProductAnalysesBulk: vi.fn(),
  fetchSavedAnalyses: vi.fn(),
  deleteSavedAnalysis: vi.fn(),
}));

const mockDiscoveryItems = [
  {
    source: "amazon_public_api",
    title: "Laptop Stand Alpha",
    price: 24.99,
    rating: 4.5,
    reviews: 120,
    brand: "BrandA",
    dimensions: null,
    weight_kg: null,
  },
  {
    source: "etsy_public_api",
    title: "Desk Shelf Beta",
    price: 31.5,
    rating: 4.7,
    reviews: 84,
    brand: "BrandB",
    dimensions: null,
    weight_kg: null,
  },
  {
    source: "alibaba_public_api",
    title: "Monitor Riser Gamma",
    price: 18.25,
    rating: 4.2,
    reviews: 203,
    brand: "BrandC",
    dimensions: null,
    weight_kg: null,
  },
];

describe("DiscoveryWorkbench selection behavior", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(fetchDiscoveryProducts).mockResolvedValue({
      items: mockDiscoveryItems,
      totalCount: mockDiscoveryItems.length,
      page: 1,
      pageSize: 5,
      sortBy: "reviews",
      sortOrder: "desc",
    });

    vi.mocked(fetchSavedDiscoveryRowKeys).mockResolvedValue(new Set(["amazon_public_api-Laptop Stand Alpha"]));
    vi.mocked(saveProductAnalysis).mockResolvedValue({ id: 101, created: true, already_exists: false });
    vi.mocked(saveProductAnalysesBulk).mockResolvedValue({
      total: 2,
      created_count: 2,
      already_exists_count: 0,
      items: [
        {
          id: 201,
          source: "etsy_public_api",
          product_name: "Desk Shelf Beta",
          market: "amazon_uk",
          created: true,
          already_exists: false,
        },
        {
          id: 202,
          source: "alibaba_public_api",
          product_name: "Monitor Riser Gamma",
          market: "amazon_uk",
          created: true,
          already_exists: false,
        },
      ],
    });
    vi.mocked(fetchSavedAnalyses).mockResolvedValue([]);
    vi.mocked(deleteSavedAnalysis).mockResolvedValue(true);
  });

  it("keeps Save Selected disabled until unsaved rows are selected", async () => {
    render(<DiscoveryWorkbench />);

    expect(screen.getByRole("button", { name: "Save Selected (0)" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    const savedRowCheckbox = await screen.findByRole("checkbox", { name: "Select Laptop Stand Alpha" });
    const unsavedRowCheckbox = await screen.findByRole("checkbox", { name: "Select Desk Shelf Beta" });

    expect(savedRowCheckbox).toBeDisabled();
    expect(unsavedRowCheckbox).toBeEnabled();
    expect(screen.getByRole("button", { name: "Save Selected (0)" })).toBeDisabled();
  });

  it("select-all targets only visible unsaved rows and bulk save resets selection", async () => {
    render(<DiscoveryWorkbench />);

    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    const selectAll = await screen.findByRole("checkbox", { name: "Select all visible unsaved rows" });
    fireEvent.click(selectAll);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Save Selected (2)" })).toBeEnabled();
    });

    fireEvent.click(screen.getByRole("button", { name: "Save Selected (2)" }));

    await waitFor(() => {
      expect(saveProductAnalysesBulk).toHaveBeenCalledTimes(1);
    });

    expect(vi.mocked(saveProductAnalysesBulk).mock.calls[0][0]).toHaveLength(2);

    await waitFor(() => {
      expect(screen.getByText("Bulk save complete: 2 new, 0 existing.")).toBeVisible();
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Save Selected (0)" })).toBeDisabled();
    });
  });
});
