import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutationFetch } from "./useMutationFetch";
import { __fetch } from "@/components/FetchApi";
import { transformedCustomers } from "@/utils/customerTransformer";
import { CustomerRow, CreateCustomerInput, UpdateCustomerInput } from "@/types/customer";

export const CUSTOMERS_KEY = ["customers"] as const;

export const useCustomers = () => {
  const queryClient = useQueryClient();

  // ── READ ────────────────────────────────────────────────────────────────────
  const {
    data: customers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: CUSTOMERS_KEY,
    queryFn: async () => {
      const res = await __fetch({
        urlPath: "/api/customers",
        reqMethodType: "GET",
      });
      if (!res.ok) throw new Error("Failed to fetch customers");
      return transformedCustomers(res.resData?.data) as CustomerRow[];
    },
  });

  // ── CREATE ──────────────────────────────────────────────────────────────────
  const create = useMutationFetch({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMERS_KEY }),
  });

  // ── UPDATE ──────────────────────────────────────────────────────────────────
  const update = useMutationFetch({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMERS_KEY }),
  });

  // ── DELETE ──────────────────────────────────────────────────────────────────
  const remove = useMutationFetch({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMERS_KEY }),
  });

  // ── action helpers (keeps urlPath/method out of Dashboard) ─────────────────
  const createCustomer = (body: CreateCustomerInput) =>
    create.mutateAsync({
      urlPath: "/api/customers",
      reqMethodType: "POST",
      headers: { "Content-Type": "application/json" },
      reqData: body,
    });

  const updateCustomer = (id: string, body: UpdateCustomerInput) =>
    update.mutateAsync({
      urlPath: `/api/customers/${id}`,
      reqMethodType: "PUT",
      headers: { "Content-Type": "application/json" },
      reqData: body,
    });

  const deleteCustomer = (id: string) =>
    remove.mutateAsync({
      urlPath: `/api/customers/${id}`,
      reqMethodType: "DELETE",
    });

  return {
    // data
    customers,
    isLoading,
    isError,

    // actions
    createCustomer,
    updateCustomer,
    deleteCustomer,

    // mutation states — use in UI for loading spinners / disabling buttons
    isCreating: create.isPending,
    isUpdating: update.isPending,
    isDeleting: remove.isPending,
  };
};
