import { useCallback } from "react";
import { ApiError } from "../services/apiClient";
import { useToast } from "../components/ToastProvider";

// Toasts what should be toasted; returns field errors for the caller to show inline.
export function useApiErrorHandler() {
  const toast = useToast();

  return useCallback(
    (err) => {
      if (!(err instanceof ApiError)) {
        toast.error("Something went wrong. Please try again.");
        return {};
      }
      if (err.isNetwork) {
        toast.error("Can't reach the server. Check your connection.");
        return {};
      }
      if (err.isServer) {
        toast.error("Something went wrong on our end. Please try again.");
        return {};
      }
      if (err.hasFields) return err.fields;
      toast.error(err.message);
      return {};
    },
    [toast],
  );
}
