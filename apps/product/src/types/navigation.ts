export type NavItem = {
  label: string;
  href: string;
  icon: string;
  description: string;
  slug: string;
};

export type ModuleConfig = {
  slug: string;
  label: string;
  stage: string;
  summary: string;
  goals: string[];
  decisions: string[];
  questions: string[];
};
