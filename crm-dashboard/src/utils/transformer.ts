import { Lead } from "@/types/lead";
function currencyConverter(price: number) {
  if (price > 100000) {
    return `₹${(price / 100000).toFixed(1)}L`
  }
  if (price > 1000) {
    return `₹${(price / 1000).toFixed(0)}K`
  }
  return `₹${price}`;
}
export const transformedLeads = (data: Lead[]) => {
  return data.map((dbLead: Lead) => ({
    id: dbLead.id,
    name: `${dbLead.first_name} ${dbLead.last_name}`,
    contact: dbLead.phone || "",
    project: dbLead.company || "N/A",
    source: dbLead.source || "N/A",
    status:
      dbLead.status === "new"
        ? "new"
        : dbLead.status === "assigned-leads"
          ? "assigned-leads"
          : dbLead.status === "converted-leads" ? "converted-leads" : "new",
    priority:
      dbLead.priority === "high"
        ? "High"
        : dbLead.priority === "medium"
          ? "Medium"
          : dbLead.priority === "low"
            ? "Low"
            : "Medium",
    budget: dbLead.estimated_value
      ? currencyConverter(dbLead.estimated_value)
      : "N/A",
    estimated_value: dbLead.estimated_value,
    owner: "Unassigned",
    lastActivity: new Date(dbLead.updated_at).toLocaleDateString(),
    notes: dbLead.notes
      ? [
        {
          id: 1,
          text: dbLead.notes,
          author: "System",
          time: new Date(dbLead.created_at).toLocaleString(),
          done: false,
        },
      ]
      : [],
    activities: [],
    email: dbLead.email || "",
  }));
};
// ─── helpers ────────────────────────────────────────────────────────────────

export function initials(name: string) {
  return name
    .split(" ")
    .map((name) => name[0])
    .slice(0, 2)
    .join("");
}
