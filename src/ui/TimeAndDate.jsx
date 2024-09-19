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
    <div className="flex align-items-center py-2 border-round-3xl transition-all transition-duration-300 transition-ease-out shadow-2 bg-white justify-content-center">
      <div>
        <p className="text-gray-600">Current time</p>
        <p className="font-bold">{currentDateAndTime}</p>
      </div>
      <Calendar size={32} className="mb-5" />
    </div>
  );
}

export default TimeAndDate;
