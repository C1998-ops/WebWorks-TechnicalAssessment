export interface DatabaseCustomer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
  is_active?: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  notes: string;
  isActive: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerInput {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
  isActive?: number;
}

export type UpdateCustomerInput = Partial<CreateCustomerInput>;
