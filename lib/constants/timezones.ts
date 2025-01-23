import moment from "moment-timezone";

export const timezoneList = moment.tz.names().map((zone: string) => {
  const now = moment.tz(zone);
  const offset = now.utcOffset() / 60; // Get UTC offset in hours
  const offsetSign = offset >= 0 ? "+" : "-";
  const formattedOffset = `UTC${offsetSign}${Math.abs(offset)
    .toString()
    .padStart(2, "0")}:00`;

  return {
    value: zone,
    label: `${zone.replace("_", " ")} (${formattedOffset})`,
  };
});
