import { Calendar } from "@phosphor-icons/react";

function TimeAndDate() {
  const dateNow = new Date();

  const options = {
    hour: "numeric",
    minute: "numeric",
    timeZone: "Europe/Berlin",
    timeZoneName: "short",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const currentDateAndTime = new Intl.DateTimeFormat("de-De", options).format(
    dateNow
  );
  return (
    <div
      className="flex align-items-start py-3 border-round-lg shadow-2 bg-white justify-content-center"
      style={{ padding: "0 0.5rem" }}
    >
      <div className="flex flex-column gap-4">
        <p className="text-gray-600 m-0">Current time</p>
        <p className="font-bold text-xs m-0">{currentDateAndTime}</p>
      </div>
      <Calendar size={24} />
    </div>
  );
}

export default TimeAndDate;
