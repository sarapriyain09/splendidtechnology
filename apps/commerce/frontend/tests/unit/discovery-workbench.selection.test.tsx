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
    window.localStorage.clear();
    window.history.replaceState(null, "", "/");

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

  it("hydrates persisted discovery query settings from local storage", async () => {
    window.localStorage.setItem(
      "product-intelligence.discoveryQuery.v1",
      JSON.stringify({
        keyword: "monitor",
        category: "ergonomic",
        min_price: 10,
        max_price: 55,
        market: "amazon_eu",
        sources: ["etsy_public_api"],
        page: 2,
        page_size: 10,
        sort_by: "price",
        sort_order: "asc",
      })
    );

    render(<DiscoveryWorkbench />);

    expect(screen.getByDisplayValue("monitor")).toBeVisible();
    expect(screen.getByDisplayValue("ergonomic")).toBeVisible();
    expect(screen.getByDisplayValue("10")).toBeVisible();
    expect(screen.getByDisplayValue("55")).toBeVisible();
    expect(screen.getByRole("combobox", { name: "Results per page" })).toHaveValue("10");

    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(fetchDiscoveryProducts).toHaveBeenCalled();
    });

    expect(vi.mocked(fetchDiscoveryProducts).mock.calls[0][0]).toMatchObject({
      keyword: "monitor",
      category: "ergonomic",
      min_price: 10,
      max_price: 55,
      market: "amazon_eu",
      sources: ["etsy_public_api"],
      page: 1,
      page_size: 10,
    });
  });

  it("hydrates discovery query settings from URL params with precedence over local storage", async () => {
    window.localStorage.setItem(
      "product-intelligence.discoveryQuery.v1",
      JSON.stringify({
        keyword: "from-storage",
        category: "storage-category",
        min_price: 1,
        max_price: 99,
        market: "amazon_uk",
        sources: ["amazon_public_api"],
        page: 1,
        page_size: 5,
        sort_by: "reviews",
        sort_order: "desc",
      })
    );

    window.history.replaceState(
      null,
      "",
      "/?keyword=from-url&category=url-category&min_price=5&max_price=77&market=amazon_eu&sources=etsy_public_api&page=3&page_size=10&sort_by=price&sort_order=asc"
    );

    render(<DiscoveryWorkbench />);

    expect(screen.getByDisplayValue("from-url")).toBeVisible();
    expect(screen.getByDisplayValue("url-category")).toBeVisible();
    expect(screen.getByPlaceholderText("Min price")).toHaveValue(5);
    expect(screen.getByPlaceholderText("Max price")).toHaveValue(77);
    expect(screen.getByRole("combobox", { name: "Results per page" })).toHaveValue("10");

    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(fetchDiscoveryProducts).toHaveBeenCalled();
    });

    expect(vi.mocked(fetchDiscoveryProducts).mock.calls[0][0]).toMatchObject({
      keyword: "from-url",
      category: "url-category",
      min_price: 5,
      max_price: 77,
      market: "amazon_eu",
      sources: ["etsy_public_api"],
      page: 1,
      page_size: 10,
      sort_by: "price",
      sort_order: "asc",
    });
  });

  it("updates browser URL query string when query controls change", async () => {
    render(<DiscoveryWorkbench />);

    fireEvent.change(screen.getByPlaceholderText("Keyword"), { target: { value: "keyboard" } });
    fireEvent.change(screen.getByPlaceholderText("Category (optional)"), { target: { value: "office" } });
    fireEvent.change(screen.getByPlaceholderText("Min price"), { target: { value: "12" } });
    fireEvent.change(screen.getByPlaceholderText("Max price"), { target: { value: "48" } });
    fireEvent.change(screen.getByRole("combobox", { name: "Results per page" }), { target: { value: "20" } });

    fireEvent.click(screen.getByRole("button", { name: "etsy_public_api" }));
    fireEvent.click(screen.getByRole("button", { name: "Price Low-High" }));

    await waitFor(() => {
      expect(window.location.search).toContain("keyword=keyboard");
      expect(window.location.search).toContain("category=office");
      expect(window.location.search).toContain("min_price=12");
      expect(window.location.search).toContain("max_price=48");
      expect(window.location.search).toContain("page_size=20");
      expect(window.location.search).toContain("sources=etsy_public_api");
      expect(window.location.search).toContain("sort_by=price");
      expect(window.location.search).toContain("sort_order=asc");
      expect(window.location.search).toContain("page=1");
    });
  });

  it("shows discovery connector observability metrics after search", async () => {
    vi.mocked(fetchDiscoveryProducts).mockResolvedValueOnce({
      items: mockDiscoveryItems,
      totalCount: mockDiscoveryItems.length,
      page: 1,
      pageSize: 5,
      sortBy: "reviews",
      sortOrder: "desc",
      catalogRowCount: 9,
      skippedRowCount: 2,
    });

    render(<DiscoveryWorkbench />);

    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByText("Catalog rows: 9 | Skipped malformed rows: 2")).toBeVisible();
    });
  });
});
