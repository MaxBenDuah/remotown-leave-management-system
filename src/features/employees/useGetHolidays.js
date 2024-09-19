import { useQuery } from "@tanstack/react-query";
import { getHolidays } from "../../services/apiHolidays";

export function useGetHolidays() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["holidays"],
    queryFn: getHolidays,
  });

  return { data, isLoading, isError, error };
}
