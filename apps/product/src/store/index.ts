export type WorkspaceStatus = "active" | "idle" | "blocked";

export type WorkspaceState = {
  productId: string;
  lifecycleStage: string;
  status: WorkspaceStatus;
};

export const initialWorkspaceState: WorkspaceState = {
  productId: "demo-product-001",
  lifecycleStage: "Idea",
  status: "active",
};
