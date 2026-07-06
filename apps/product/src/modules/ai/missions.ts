export type AIMission = {
  title: string;
  summary: string;
  outcome: string;
};

export const AI_MISSIONS: readonly AIMission[] = [
  { title: "Create New Product", summary: "Turn a raw idea into a scoped product concept.", outcome: "Concept brief" },
  { title: "Find Product Opportunities", summary: "Identify market gaps with demand and competition signal.", outcome: "Opportunity shortlist" },
  { title: "Analyse Competitors", summary: "Map features, pricing, and review sentiment for major competitors.", outcome: "Competitor map" },
  { title: "Create Product Specification", summary: "Draft structured product requirements and acceptance criteria.", outcome: "PRD draft" },
  { title: "Generate CAD Requirements", summary: "Translate requirements into CAD constraints and file outputs.", outcome: "CAD requirement set" },
  { title: "Estimate Manufacturing Cost", summary: "Model cost by material, machine time, labor, and packaging.", outcome: "Cost model" },
  { title: "Optimise Material Usage", summary: "Reduce waste with better sheet and cut planning.", outcome: "Waste reduction plan" },
  { title: "Generate CNC Files", summary: "Prepare CNC-ready output assumptions and instruction package.", outcome: "CNC package" },
  { title: "Generate Laser Engraving Files", summary: "Create engraving-ready vector guidance and settings.", outcome: "Laser package" },
  { title: "Create Bill of Materials", summary: "Build a complete BOM with versions and supplier mapping.", outcome: "Versioned BOM" },
  { title: "Schedule Production", summary: "Prepare production run timeline and work center load.", outcome: "Production plan" },
  { title: "Publish to Amazon", summary: "Generate listing copy, assets checklist, and launch sequence.", outcome: "Listing bundle" },
  { title: "Analyse Customer Reviews", summary: "Extract pain points and improvement opportunities from reviews.", outcome: "Review insight report" },
  { title: "Create Product Version 2", summary: "Plan Version 2 using cost, quality, and feedback insights.", outcome: "V2 roadmap" },
] as const;
