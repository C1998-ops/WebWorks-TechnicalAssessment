import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutationFetch } from "./useMutationFetch";
import { __fetch } from "@/components/FetchApi";
import { transformedLeads } from "@/utils/transformer";
import { CreateLeadInput, UpdateLeadInput } from "@/types/lead";

export const LEADS_KEY = ["leads"] as const;

export const useLeads = () => {
  const queryClient = useQueryClient();

  // ── READ ────────────────────────────────────────────────────────────────────
  const {
    data: leads,
    isLoading,
    isError,
  } = useQuery({
    queryKey: LEADS_KEY,
    queryFn: async () => {
      const res = await __fetch({
        urlPath: "/api/leads",
        reqMethodType: "GET",
      });
      if (!res.ok) throw new Error("Failed to fetch leads");
      return transformedLeads(res.resData?.data);
    },
  });

  // ── CREATE ──────────────────────────────────────────────────────────────────
  const create = useMutationFetch({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LEADS_KEY }),
  });

  // ── UPDATE ──────────────────────────────────────────────────────────────────
  const update = useMutationFetch({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LEADS_KEY }),
  });

  // ── DELETE ──────────────────────────────────────────────────────────────────
  const remove = useMutationFetch({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LEADS_KEY }),
  });

  // ── action helpers (keeps urlPath/method out of Dashboard) ─────────────────
  const createLead = (body: CreateLeadInput) =>
    create.mutateAsync({
      urlPath: "/api/leads",
      reqMethodType: "POST",
      headers: { "Content-Type": "application/json" },
      reqData: body,
    });

  const updateLead = (id: string, body: UpdateLeadInput) =>
    update.mutateAsync({
      urlPath: `/api/leads/${id}`,
      reqMethodType: "PUT",
      headers: { "Content-Type": "application/json" },
      reqData: body,
    });

  const deleteLead = (id: string) =>
    remove.mutateAsync({
      urlPath: `/api/leads/${id}`,
      reqMethodType: "DELETE",
    });

  return {
    // data
    leads,
    isLoading,
    isError,

    // actions
    createLead,
    updateLead,
    deleteLead,

    // mutation states — use in UI for loading spinners / disabling buttons
    isCreating: create.isPending,
    isUpdating: update.isPending,
    isDeleting: remove.isPending,
  };
};
