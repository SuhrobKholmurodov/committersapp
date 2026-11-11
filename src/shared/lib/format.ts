const numberFormatter = new Intl.NumberFormat("en-US");

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

const API_DATE_PATTERN =
  /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})\s*(?:([+-]\d{2}):?(\d{2})|Z)?$/;

export const formatNumber = (value: number) => numberFormatter.format(value);

export const formatDate = (value: Date) => dateFormatter.format(value);

export const parseApiDate = (value?: string | null): Date | null => {
  if (!value) return null;

  const match = API_DATE_PATTERN.exec(value.trim());
  const normalized = match
    ? `${match[1]}T${match[2]}${match[3] ? `${match[3]}:${match[4]}` : "Z"}`
    : value;

  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);
