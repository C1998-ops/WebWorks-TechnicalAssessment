export type LeadStatus = "all" | "new" | "assigned-leads" | "converted-leads";

export type LeadPriority = "high" | "medium" | "low";

// Database lead type - matches DB schema exactly
export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  status: LeadStatus;
  priority: LeadPriority;
  estimated_value?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Input type for create/update operations - matches DB fields
export interface LeadInput {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: string;
  priority: string;
  estimated_value: number;
  customer_id: string;
  assigned_to: string;
  notes?: string;
}

export type CreateLeadInput = LeadInput;
export type UpdateLeadInput = Partial<LeadInput>;

export interface DisplayLead {
  id: string;
  name: string;
  contact: string;
  project: string;
  source: string;
  status: string;
  email: string;
  priority: string;
  budget: string;
  estimated_value: number;
  // owner: string;
  lastActivity: string;
  notes: Array<{
    id: number;
    text: string;
    author: string;
    time: string;
    done: boolean;
  }>;
  activities: Array<{ icon?: string; text: string; time: string }>;
}
