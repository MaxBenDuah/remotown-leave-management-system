import { Divider } from "primereact/divider";

function formatDate(date) {
  const newDate = new Date(date);
  const options = {
    year: "numeric",
    day: "numeric",
    month: "numeric",
    weekday: "long",
  };
  const formattedDate = new Intl.DateTimeFormat("de-DE", options).format(
    newDate
  );

  return formattedDate;
}

function HolidayItem({ holiday }) {
  return (
    <>
      <li className="flex justify-content-between align-items-center">
        <div className="flex flex-column gap-1">
          <p className="font-semibold">{formatDate(holiday.date.iso)}</p>
          <p className="text-gray-600">{holiday.primary_type}</p>
        </div>
        <p className="font-semibold ">{holiday.name}</p>
      </li>
      <Divider />
    </>
  );
}

export default HolidayItem;
