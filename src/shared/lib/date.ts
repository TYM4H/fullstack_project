const dateOptions = { timeZone: "Europe/Moscow" };

export function formatEventDate(startsAt: string) {
  const date = new Date(startsAt);
  return {
    date: date.toLocaleDateString("ru-RU", {
      ...dateOptions,
      day: "numeric",
      month: "long",
    }),
    day: date
      .toLocaleDateString("ru-RU", { ...dateOptions, weekday: "short" })
      .toUpperCase(),
    time: date.toLocaleTimeString("ru-RU", {
      ...dateOptions,
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}
