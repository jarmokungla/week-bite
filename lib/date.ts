export function nextMonday(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay(); // 0 Sun .. 6 Sat
  const diff = (8 - (day || 7)) % 7; // days until next Monday
  date.setDate(date.getDate() + diff);
  date.setHours(0,0,0,0);
  return date;
}

export function dateForNextWeekDay(dayIndex: number) {
  // 1..7 for Mon..Sun
  const monday = nextMonday(new Date());
  const d = new Date(monday);
  d.setDate(monday.getDate() + (dayIndex - 1));
  return d;
}

export const weekdayNames: Record<number, string> = {
  1:'Monday',2:'Tuesday',3:'Wednesday',4:'Thursday',5:'Friday',6:'Saturday',7:'Sunday'
};
