import { Divider } from "primereact/divider";

function formatDate(date) {
  const newDate = new Date(date);
  const options = {
    year: "numeric",
    day: "numeric",
    month: "numeric",
  };
  const formattedDate = new Intl.DateTimeFormat("de-DE", options).format(
    newDate
  );

  return formattedDate;
}

function HolidayItem({ holiday }) {
  return (
    <>
      <li
        className="flex justify-content-between align-items-center"
        style={{ padding: "0 0.5rem" }}
      >
        <div className="flex flex-column gap-1">
          <p className="font-semibold text-xs m-0">
            {formatDate(holiday.date.iso)}
          </p>
          <p className="text-gray-600 text-xs m-0">{holiday.primary_type}</p>
        </div>
        <p className="font-semibold text-xs m-0 text-right">{holiday.name}</p>
      </li>
      <Divider />
    </>
  );
}

export default HolidayItem;
