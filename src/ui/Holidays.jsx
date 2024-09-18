import { ProgressSpinner } from "primereact/progressspinner";
import { useGetHolidays } from "../features/employees/useGetHolidays";
import HolidayItem from "./HolidayItem";

function Holidays() {
  const { data, isLoading, isError, error } = useGetHolidays();

  if (isLoading) return <ProgressSpinner />;

  if (isError)
    return <p>There was a problem loading holidays - {error.message}</p>;

  const {
    response: { holidays },
  } = data;

  return (
    <div className="shadow-2 border-round-3xl pt-2 bg-white">
      <h3 className="text-center">Germany: Upcoming Holidays & Observances</h3>
      <ul
        className="overflow-scroll h-screen list-none"
        style={{ padding: "0 2rem" }}
      >
        {holidays?.map((holiday) => (
          <HolidayItem key={crypto.randomUUID()} holiday={holiday} />
        ))}
      </ul>
    </div>
  );
}

export default Holidays;
