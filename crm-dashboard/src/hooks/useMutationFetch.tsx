import { useMutation } from "@tanstack/react-query";
import { __fetch, FetchParams, FetchResponse } from "@/components/FetchApi";
type UseMutationFetchOptions = {
  onSuccess?: (data: FetchResponse, variables: FetchParams) => void;
  onError?: (error: Error, variables: FetchParams) => void;
};
export const useMutationFetch = (options?: UseMutationFetchOptions) => {
  return useMutation<FetchResponse, Error, FetchParams>({
    mutationFn: (params: FetchParams) => __fetch(params),
    onSuccess: (data, variables) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables);
      }
    },
    onError: (error, variables) => {
      if (options?.onError) {
        options.onError(error, variables);
      }
    },
  });
};
