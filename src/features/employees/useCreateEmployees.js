import { useMutation } from "@tanstack/react-query";
import { createEmployee } from "../../services/apiEmployees";

export function useCreateEmployees() {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createEmployee,
  });

  return { mutate, isPending, isError, error };
}
