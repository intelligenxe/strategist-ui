export function normalizeWorkflowSlug(name: string): string {
  return name === "corporate_strategy" ? "swot" : name;
}

const DISPLAY_LABELS: Record<string, string> = {
  swot: "SWOT Analysis",
  five_forces: "Five Forces",
};

export function workflowDisplayName(name: string): string {
  const slug = normalizeWorkflowSlug(name);
  if (DISPLAY_LABELS[slug]) return DISPLAY_LABELS[slug];
  return slug.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
