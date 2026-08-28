import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";

export function buildMonthGrid(year: number, month: number) {
  // month es 0-indexado (0 = enero)
  const firstOfMonth = startOfMonth(new Date(year, month, 1));
  const lastOfMonth = endOfMonth(firstOfMonth);
  const gridStart = startOfWeek(firstOfMonth, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(lastOfMonth, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

export function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}
