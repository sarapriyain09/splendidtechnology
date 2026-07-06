"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PRODUCT_NAV_ITEMS } from "@/src/modules/navigation/items";

type AppShellProps = {
  title: string;
  activeHref: string;
  children: React.ReactNode;
};

const HEADER_HEIGHT = 70;
const FOOTER_HEIGHT = 34;
const LEFT_WIDTH = 264;
const RIGHT_WIDTH = 324;

export function AppShell({ title, activeHref, children }: AppShellProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = theme;
    }
  }, [theme]);

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <header
        style={{ height: HEADER_HEIGHT }}
        className="fade-up"
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 18px",
            background: "var(--shell)",
            borderBottom: "1px solid var(--shell-border)",
            color: "var(--shell-text)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #1f5fbf, #28b8d8)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              VP
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.1 }}>Velynxia Product</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{title}</div>
            </div>
          </div>

          <div
            style={{
              minWidth: 220,
              maxWidth: 560,
              width: "38%",
              border: "1px solid var(--shell-border)",
              borderRadius: 10,
              padding: "10px 12px",
              fontSize: 12,
              opacity: 0.9,
            }}
          >
            Ask: what should we build next and why?
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              type="button"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              style={{
                border: "1px solid var(--shell-border)",
                background: "transparent",
                color: "var(--shell-text)",
                borderRadius: 8,
                padding: "7px 10px",
                fontSize: 12,
              }}
            >
              {theme === "light" ? "Dark" : "Light"}
            </button>
            <span style={{ fontSize: 12, opacity: 0.85 }}>Owner</span>
          </div>
        </div>
      </header>

      <div
        style={{
          display: "flex",
          height: `calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)`,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <aside
          style={{
            width: LEFT_WIDTH,
            minWidth: LEFT_WIDTH,
            background: "var(--shell)",
            borderRight: "1px solid var(--shell-border)",
            color: "var(--shell-text)",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <nav className="workspace-scroll" style={{ overflowY: "auto", padding: 10, minHeight: 0, flex: 1 }}>
            {PRODUCT_NAV_ITEMS.map((item) => {
              const isActive = item.href === activeHref;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    borderRadius: 10,
                    border: isActive ? "1px solid rgba(102, 173, 255, 0.45)" : "1px solid transparent",
                    background: isActive ? "var(--active-soft)" : "transparent",
                    textDecoration: "none",
                    color: "var(--shell-text)",
                    padding: "10px 9px",
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      display: "grid",
                      placeItems: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: isActive ? "#e6f0ff" : "#b5ccf0",
                      background: isActive ? "var(--active)" : "rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span>
                    <span style={{ fontSize: 11, opacity: 0.76 }}>{item.description}</span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main style={{ minWidth: 0, flex: 1, minHeight: 0, padding: 14, overflow: "hidden" }}>
          <div className="workspace-scroll fade-up stagger-1" style={{ height: "100%", overflow: "auto" }}>
            {children}
          </div>
        </main>

        <aside
          style={{
            width: RIGHT_WIDTH,
            minWidth: RIGHT_WIDTH,
            borderLeft: "1px solid var(--panel-border)",
            background: "var(--panel)",
            padding: 12,
            minHeight: 0,
          }}
        >
          <div className="workspace-scroll" style={{ overflowY: "auto", height: "100%" }}>
            <h3 style={{ margin: 0, fontSize: 12, letterSpacing: 0.8, textTransform: "uppercase", color: "var(--ink-soft)" }}>
              AI Product Assistant
            </h3>

            <section style={panelStyle} className="fade-up stagger-1">
              <p style={titleStyle}>Lifecycle Guardrail</p>
              <p style={textStyle}>Idea | Research | Requirements | CAD | Prototype | Testing | Costing | Manufacturing | Production | Sales | Feedback | AI Analysis | Version 2</p>
            </section>

            <section style={panelStyle} className="fade-up stagger-2">
              <p style={titleStyle}>Decision Focus</p>
              <ul style={listStyle}>
                <li>Is this product commercially viable?</li>
                <li>Can design be simplified without quality loss?</li>
                <li>What should Version 2 improve first?</li>
              </ul>
            </section>

            <section style={panelStyle} className="fade-up stagger-3">
              <p style={titleStyle}>Approval States</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 12 }}>
                <Tag label="draft" color="#64748b" />
                <Tag label="pending_approval" color="#b45309" />
                <Tag label="approved" color="#166534" />
                <Tag label="executed" color="#0e7490" />
              </div>
            </section>
          </div>
        </aside>
      </div>

      <footer
        style={{
          height: FOOTER_HEIGHT,
          borderTop: "1px solid var(--panel-border)",
          background: "var(--panel-strong)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 14px",
          fontSize: 12,
          color: "var(--ink-soft)",
        }}
      >
        <span>Velynxia Product Platform</span>
        <span>No full-page scrolling. Center workspace scroll only.</span>
      </footer>
    </div>
  );
}

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        border: `1px solid ${color}66`,
        color,
        borderRadius: 999,
        padding: "4px 8px",
        display: "inline-flex",
        justifyContent: "center",
      }}
    >
      {label}
    </span>
  );
}

const panelStyle: React.CSSProperties = {
  marginTop: 10,
  borderRadius: 12,
  border: "1px solid var(--panel-border)",
  background: "var(--panel-strong)",
  padding: 12,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontWeight: 700,
  fontSize: 13,
};

const textStyle: React.CSSProperties = {
  margin: "7px 0 0",
  fontSize: 12,
  lineHeight: 1.45,
  color: "var(--ink-soft)",
};

const listStyle: React.CSSProperties = {
  margin: "8px 0 0",
  paddingLeft: 18,
  fontSize: 12,
  lineHeight: 1.5,
  color: "var(--ink-soft)",
};
