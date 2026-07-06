import type {
  CashAvailabilityResponse,
  ControlPlaneOverviewResponse,
  DispatchTodayResponse,
  InventorySummaryResponse,
  MarketingProfitabilityResponse,
  ProductsSummaryResponse,
  SupportSummaryResponse,
} from "./contracts-v1";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8011/api/v1";
const API_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? "20000");

function buildContextHeaders(): HeadersInit {
  return {
    "X-Tenant-Id": process.env.NEXT_PUBLIC_TENANT_ID ?? "tenant-demo",
    "X-User-Id": process.env.NEXT_PUBLIC_USER_ID ?? "user-demo",
    "X-User-Role": process.env.NEXT_PUBLIC_USER_ROLE ?? "owner",
    "X-Request-Source": process.env.NEXT_PUBLIC_REQUEST_SOURCE ?? "commerce-v1-frontend",
  };
}

async function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`Request timed out after ${API_TIMEOUT_MS}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: buildContextHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed request: ${path}`);
  }

  return response.json() as Promise<T>;
}

export function fetchV1ProductsSummary(): Promise<ProductsSummaryResponse> {
  return getJson<ProductsSummaryResponse>("/contracts/v1/products/summary");
}

export function fetchV1InventorySummary(): Promise<InventorySummaryResponse> {
  return getJson<InventorySummaryResponse>("/contracts/v1/inventory/summary");
}

export function fetchV1DispatchToday(): Promise<DispatchTodayResponse> {
  return getJson<DispatchTodayResponse>("/contracts/v1/orders/dispatch-today");
}

export function fetchV1CashAvailability(): Promise<CashAvailabilityResponse> {
  return getJson<CashAvailabilityResponse>("/contracts/v1/cashflow/availability");
}

export function fetchV1SupportSummary(): Promise<SupportSummaryResponse> {
  return getJson<SupportSummaryResponse>("/contracts/v1/support/summary");
}

export function fetchV1MarketingProfitability(): Promise<MarketingProfitabilityResponse> {
  return getJson<MarketingProfitabilityResponse>("/contracts/v1/marketing/profitability");
}

export function fetchV1ControlPlaneOverview(): Promise<ControlPlaneOverviewResponse> {
  return getJson<ControlPlaneOverviewResponse>("/contracts/v1/control-plane/overview");
}
