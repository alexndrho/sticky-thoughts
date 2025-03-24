const formatTime = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});

const formatDayTime = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});

const formatDateTime = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});

export const getFormattedDate = (date: Date) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const oneWeekAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);

  if (date > today) {
    return formatTime.format(date);
  } else if (date > oneWeekAgo) {
    return formatDayTime.format(date);
  } else {
    return formatDateTime.format(date);
  }
};
