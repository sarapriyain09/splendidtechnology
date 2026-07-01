export type ProductNavItem = {
  label: string;
  href: string;
};

export const PRODUCT_INTELLIGENCE_NAV_ITEMS: readonly ProductNavItem[] = [
  { label: "Dashboard", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Research", href: "/research" },
  { label: "Suppliers", href: "/suppliers" },
  { label: "Manufacturing", href: "/manufacturing" },
  { label: "Marketing", href: "/marketing" },
  { label: "Sales", href: "/sales" },
  { label: "Reports", href: "/reports" },
  { label: "Settings", href: "/settings" },
] as const;

export function getProductNavByHref(href: string): ProductNavItem | undefined {
  return PRODUCT_INTELLIGENCE_NAV_ITEMS.find((item) => item.href === href);
}

export const PRODUCT_WORKSPACE_TABS = [
  "Overview",
  "Research",
  "Competitors",
  "Reviews",
  "AI Improvement",
  "Design",
  "Prototype",
  "Supplier",
  "Manufacturing",
  "Cost",
  "Packaging",
  "Marketing",
  "Launch",
  "Sales",
  "Analytics",
] as const;
