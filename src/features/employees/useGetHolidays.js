import { useQuery } from "@tanstack/react-query";
import { getHolidays } from "../../services/apiHolidays";
// import { useSearchParams } from "react-router-dom";

export function useGetHolidays() {
  // Since the company is in Germany, I think it would be best to get the holidays for only Germany. Later, I will implement a way to be able to get it for any country
  // const [searchParams] = useSearchParams();

  // const country = searchParams.get("country");
  // const year = searchParams.get("year");
  // const holidayObj = { country, year };

  const { data, isLoading, isError, error } = useQuery({
    // queryKey: ["holidays", holidayObj], - previous
    queryKey: ["holidays"],
    // queryFn: () => getHolidays(holidayObj), - previous
    queryFn: getHolidays,
  });

  return { data, isLoading, isError, error };
}
