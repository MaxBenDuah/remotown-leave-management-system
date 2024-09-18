import { useMutation } from "@tanstack/react-query";
import { signUpUser } from "../../services/apiAuth";

export function useSignUp() {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: signUpUser,
  });

  return { mutate, isPending, isError, error };
}
