export const convertDate = (date) => {
  const options = {
    month: "numeric",
    weekday: "long",
    day: "numeric",
    year: "numeric",
  };
  return new Intl.DateTimeFormat("de-DE", options).format(new Date(date));
};
