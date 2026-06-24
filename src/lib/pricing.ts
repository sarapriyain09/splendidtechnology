export type GrowthPlan = {
  name: string;
  price: string;
  suitableFor: string[];
  includes: string[];
  ctaLabel: string;
};

export type AiMediaPlan = {
  name: "Creator" | "Professional" | "Business" | "Enterprise";
  price: string;
  suitableFor: string[];
  includes: string[];
  generationLimit: string;
  support?: string;
};

export type ProductTab = "growth" | "ai-media";

export const growthPlatformPlans: GrowthPlan[] = [
  {
    name: "CRM",
    price: "£29/user/month",
    suitableFor: ["SMEs", "Sales teams", "Service teams"],
    includes: ["CRM core", "Contacts and companies", "Activities and tasks", "Customer timeline"],
    ctaLabel: "Start with CRM",
  },
  {
    name: "Growth",
    price: "£59/user/month",
    suitableFor: ["Growing teams", "Lead-driven businesses", "Outbound operations"],
    includes: ["CRM + Sales", "Pipeline workflows", "CallCRM", "Marketing and automation basics"],
    ctaLabel: "Choose Growth",
  },
  {
    name: "Enterprise",
    price: "Contact Us",
    suitableFor: ["Complex organizations", "Multi-team rollouts", "Custom integration needs"],
    includes: ["All platform apps", "Advanced controls", "Custom implementation", "Priority onboarding"],
    ctaLabel: "Talk to Sales",
  },
];

export const aiMediaSuitePlans: AiMediaPlan[] = [
  {
    name: "Creator",
    price: "£19/month",
    suitableFor: ["Freelancers", "Content creators", "YouTubers", "Trainers"],
    includes: ["Voice Studio", "Script Studio", "Subtitle Studio"],
    generationLimit: "100 generations/month",
  },
  {
    name: "Professional",
    price: "£49/month",
    suitableFor: ["Marketing agencies", "Consultants", "Coaches", "SMEs"],
    includes: [
      "Voice Studio",
      "Script Studio",
      "Presentation Studio",
      "Podcast Studio",
      "Subtitle Studio",
      "Video Studio",
    ],
    generationLimit: "500 generations/month",
  },
  {
    name: "Business",
    price: "£99/month",
    suitableFor: ["Growing businesses", "Digital agencies", "Training companies"],
    includes: [
      "Voice Studio",
      "Script Studio",
      "Presentation Studio",
      "Podcast Studio",
      "Subtitle Studio",
      "Video Studio",
      "Background Music Studio",
    ],
    generationLimit: "2,000 generations/month",
    support: "Priority support",
  },
  {
    name: "Enterprise",
    price: "£199/month",
    suitableFor: ["Enterprises", "Media companies", "High-volume content teams"],
    includes: ["Everything in Business", "Avatar Studio", "Team workspaces", "Shared libraries", "API access"],
    generationLimit: "Unlimited generations (fair usage)",
    support: "Dedicated support",
  },
];

export const aiMediaFeatureMatrix = [
  {
    studio: "Voice Studio",
    availability: { Creator: true, Professional: true, Business: true, Enterprise: true },
  },
  {
    studio: "Script Studio",
    availability: { Creator: true, Professional: true, Business: true, Enterprise: true },
  },
  {
    studio: "Subtitle Studio",
    availability: { Creator: true, Professional: true, Business: true, Enterprise: true },
  },
  {
    studio: "Presentation Studio",
    availability: { Creator: false, Professional: true, Business: true, Enterprise: true },
  },
  {
    studio: "Podcast Studio",
    availability: { Creator: false, Professional: true, Business: true, Enterprise: true },
  },
  {
    studio: "Video Studio",
    availability: { Creator: false, Professional: true, Business: true, Enterprise: true },
  },
  {
    studio: "Background Music Studio",
    availability: { Creator: false, Professional: false, Business: true, Enterprise: true },
  },
  {
    studio: "Avatar Studio",
    availability: { Creator: false, Professional: false, Business: false, Enterprise: true },
  },
];
