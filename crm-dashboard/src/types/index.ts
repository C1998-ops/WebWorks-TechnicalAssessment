import { ChangeEvent } from "react";

export * from "./userTypes";
export type UserRole =
  | "user"
  | "admin"
  | "super_admin"
  | "care_manager"
  | "supplier"
  | "local_resource";
export type subscriptionPlan = "free" | "paid";

export interface User {
  id: number;
  uuid: string;
  username: string;
  email: string;
  phone_number: string;
  created_at: string;
  role: UserRole;
  type: string;
  has_paid: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  message: string | null;
  error: string | null;
  isDashboardAccessible: boolean;
  token: string | null;
}

export interface RootState {
  auth: AuthState;
}

// Define request method types
export type RequestMethod = "PUT" | "PATCH" | "POST" | "DELETE" | "GET";

export interface FilterOption {
  id: string;
  label: string;
  type: "checkbox" | "select" | "date" | "text";
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  defaultValue?: any;
  group?: string; // For grouping options
}

export interface FilterConfig {
  title?: string;
  options: FilterOption[];
  onApply: (filters: Record<string, any>) => void;
  onCancel?: () => void;
  onReset?: () => void;
  showReset?: boolean;
  dropdownStyle?: boolean; // New prop for dropdown style
}
export interface FormInputProps {
  label?: string | undefined;
  name?: string | undefined;
  type: string;
  placeholder?: string;
  required?: boolean;
  value: any;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  formErrors?: string | null;
  [key: string]: any;
}
