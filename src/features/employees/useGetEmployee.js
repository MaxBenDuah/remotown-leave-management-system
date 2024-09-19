import { useQuery } from "@tanstack/react-query";
import { getEmployee } from "../../services/apiEmployees";

export function useGetEmployee(user) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["employee", user],
    queryFn: () => getEmployee(user),
    enabled: !!user,
  });

  return { data, isLoading, isError, error };
}
