export type ModuleKey =
  | "products"
  | "suppliers"
  | "inventory"
  | "sales_channels"
  | "orders"
  | "delivery"
  | "cash_flow"
  | "customer_support"
  | "marketing";

export type BusinessQuestionCard = {
  module: ModuleKey;
  question: string;
  answered_at: string;
  primary_value: string;
  secondary_value?: string | null;
  status: "ok" | "warning" | "critical";
};

export type ProductsSummaryResponse = {
  question: "What am I selling?";
  total_products: number;
  ready_products: number;
  active_products: number;
  top_categories: string[];
};

export type InventorySummaryResponse = {
  question: "What stock do I have?";
  low_stock_skus: number;
  total_available_units: number;
  stockout_risk_skus: number;
  next_reorder_date?: string | null;
};

export type DispatchTodayResponse = {
  question: "What must I dispatch today?";
  due_today: number;
  overdue: number;
  blocked: number;
};

export type CashAvailabilityResponse = {
  question: "How much money is available?";
  currency: string;
  available_now: number;
  expected_7d: number;
  expected_30d: number;
  warning_level: "ok" | "watch" | "critical";
};

export type SupportSummaryResponse = {
  question: "What problems are customers reporting?";
  open_cases: number;
  overdue_cases: number;
  top_issue_categories: string[];
};

export type MarketingProfitabilityResponse = {
  question: "Which Amazon campaigns are profitable?";
  profitable_campaigns: number;
  unprofitable_campaigns: number;
  avg_acos: number;
  avg_roas: number;
};

export type ControlPlaneOverviewResponse = {
  generated_at: string;
  cards: BusinessQuestionCard[];
};
