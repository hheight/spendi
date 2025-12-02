import {
  endOfMonth,
  startOfMonth,
  getYear,
  getMonth,
  startOfDay,
  endOfDay,
  isValid
} from "date-fns";

export function parseSelectedDay(param: string | string[] | undefined): number | null {
  if (!param || Array.isArray(param)) return null;

  const day = Number(param);
  if (isNaN(day) || day < 1 || day > 31) return null;

  return day;
}

export function createDateFromDay(day: number, referenceDate: Date): Date | null {
  const year = getYear(referenceDate);
  const month = getMonth(referenceDate);
  const date = new Date(year, month, day);

  if (date.getDate() !== day || date.getMonth() !== month) {
    return null;
  }

  return isValid(date) ? date : null;
}

export function getCurrentMonthRange(now: Date): {
  start: Date;
  end: Date;
} {
  return {
    start: startOfMonth(now),
    end: endOfMonth(now)
  };
}

export function getDayRange(date: Date): {
  start: Date;
  end: Date;
} {
  return {
    start: startOfDay(date),
    end: endOfDay(date)
  };
}
