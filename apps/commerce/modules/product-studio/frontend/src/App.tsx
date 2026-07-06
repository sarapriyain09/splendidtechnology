import { NavLink, Route, Routes } from "react-router-dom";

import { DiscoveryWorkbench } from "@/components/discovery-workbench";
import { SimplePage } from "@/pages/simple-page";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/" },
  { label: "Product Research", path: "/product-research" },
  { label: "Market Analysis", path: "/market-analysis" },
  { label: "Review Intelligence", path: "/review-intelligence" },
  { label: "Manufacturing", path: "/manufacturing" },
  { label: "Suppliers", path: "/suppliers" },
  { label: "Prototype", path: "/prototype" },
  { label: "Cost Calculator", path: "/cost-calculator" },
  { label: "B2B", path: "/b2b" },
  { label: "Reports", path: "/reports" },
  { label: "Settings", path: "/settings" },
] as const;

function DashboardPage() {
  return (
    <>
      <h2>Products Analysed</h2>
      <DiscoveryWorkbench />
    </>
  );
}

export function App() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>Product Studio</h1>
        <nav>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => (isActive ? "nav-link nav-link-active" : "nav-link")}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/product-research" element={<SimplePage heading="Product Research" />} />
          <Route path="/market-analysis" element={<SimplePage heading="Market Analysis" />} />
          <Route path="/review-intelligence" element={<SimplePage heading="Review Intelligence" />} />
          <Route path="/manufacturing" element={<SimplePage heading="Manufacturing Intelligence" />} />
          <Route path="/suppliers" element={<SimplePage heading="Suppliers" />} />
          <Route path="/prototype" element={<SimplePage heading="Prototype Roadmap" />} />
          <Route path="/cost-calculator" element={<SimplePage heading="Cost Calculator" />} />
          <Route path="/b2b" element={<SimplePage heading="B2B Opportunity Explorer" />} />
          <Route path="/reports" element={<SimplePage heading="Reports" />} />
          <Route path="/settings" element={<SimplePage heading="Settings" />} />
        </Routes>
      </main>
    </div>
  );
}
