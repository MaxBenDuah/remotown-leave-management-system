import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../../services/apiEmployees";

export function useGetCurrentUser(userProfile) {
  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["currentUser", userProfile],
    queryFn: () => fetchCurrentUser(userProfile),
    enabled: !!userProfile,
  });

  return { profile, isLoading, isError, error };
}
