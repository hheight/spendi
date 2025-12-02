import { describe, it, expect } from "vitest";
import {
  parseSelectedDay,
  createDateFromDay,
  getCurrentMonthRange,
  getDayRange
} from "@/lib/utils";
import { startOfMonth, endOfMonth, startOfDay, endOfDay } from "date-fns";

describe("#parseSelectedDay", () => {
  describe("valid inputs", () => {
    it("should parse valid day string", () => {
      expect(parseSelectedDay("15")).toBe(15);
    });

    it("should parse day at start of valid range", () => {
      expect(parseSelectedDay("1")).toBe(1);
    });

    it("should parse day at end of valid range", () => {
      expect(parseSelectedDay("31")).toBe(31);
    });

    it("should parse day with leading zeros", () => {
      expect(parseSelectedDay("01")).toBe(1);
      expect(parseSelectedDay("05")).toBe(5);
    });
  });

  describe("invalid inputs", () => {
    it("should return null for undefined", () => {
      expect(parseSelectedDay(undefined)).toBe(null);
    });

    it("should return null for array input", () => {
      expect(parseSelectedDay(["15"])).toBe(null);
      expect(parseSelectedDay(["1", "2"])).toBe(null);
    });

    it("should return null for empty string", () => {
      expect(parseSelectedDay("")).toBe(null);
    });

    it("should return null for non-numeric string", () => {
      expect(parseSelectedDay("abc")).toBe(null);
      expect(parseSelectedDay("15a")).toBe(null);
    });

    it("should return null for day less than 1", () => {
      expect(parseSelectedDay("0")).toBe(null);
      expect(parseSelectedDay("-1")).toBe(null);
      expect(parseSelectedDay("-15")).toBe(null);
    });

    it("should return null for day greater than 31", () => {
      expect(parseSelectedDay("32")).toBe(null);
      expect(parseSelectedDay("100")).toBe(null);
    });

    it("should return null for special numeric strings", () => {
      expect(parseSelectedDay("NaN")).toBe(null);
      expect(parseSelectedDay("Infinity")).toBe(null);
    });
  });
});

describe("#createDateFromDay", () => {
  const referenceDate = new Date(2024, 0, 15);

  describe("valid days", () => {
    it("should create date from valid day in same month", () => {
      const result = createDateFromDay(20, referenceDate);
      expect(result).not.toBe(null);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0);
      expect(result?.getDate()).toBe(20);
    });

    it("should create date for first day of month", () => {
      const result = createDateFromDay(1, referenceDate);
      expect(result).not.toBe(null);
      expect(result?.getDate()).toBe(1);
    });

    it("should create date for last valid day in 31-day month", () => {
      const result = createDateFromDay(31, referenceDate);
      expect(result).not.toBe(null);
      expect(result?.getDate()).toBe(31);
    });

    it("should handle last day of 30-day month", () => {
      const aprilRef = new Date(2024, 3, 15);
      const result = createDateFromDay(30, aprilRef);
      expect(result).not.toBe(null);
      expect(result?.getDate()).toBe(30);
    });

    it("should handle leap year February", () => {
      const febLeapRef = new Date(2024, 1, 15);
      const result = createDateFromDay(29, febLeapRef);
      expect(result).not.toBe(null);
      expect(result?.getDate()).toBe(29);
    });
  });

  describe("invalid days", () => {
    it("should return null for day 31 in 30-day month", () => {
      const aprilRef = new Date(2024, 3, 15);
      const result = createDateFromDay(34, aprilRef);
      expect(result).toBe(null);
    });

    it("should return null for day 30 in February", () => {
      const febRef = new Date(2024, 1, 15);
      const result = createDateFromDay(30, febRef);
      expect(result).toBe(null);
    });

    it("should return null for day 29 in non-leap year February", () => {
      const febNonLeapRef = new Date(2023, 1, 15);
      const result = createDateFromDay(29, febNonLeapRef);
      expect(result).toBe(null);
    });

    it("should preserve year and month from reference date", () => {
      const decemberRef = new Date(2023, 11, 15);
      const result = createDateFromDay(25, decemberRef);
      expect(result?.getFullYear()).toBe(2023);
      expect(result?.getMonth()).toBe(11);
    });
  });
});

describe("#getCurrentMonthRange", () => {
  it("should return start and end of current month", () => {
    const testDate = new Date(2024, 5, 15);
    const result = getCurrentMonthRange(testDate);

    expect(result.start).toEqual(startOfMonth(testDate));
    expect(result.end).toEqual(endOfMonth(testDate));
  });

  it("should handle first day of month", () => {
    const testDate = new Date(2024, 0, 1);
    const result = getCurrentMonthRange(testDate);

    expect(result.start.getDate()).toBe(1);
    expect(result.end.getDate()).toBe(31);
  });

  it("should handle last day of month", () => {
    const testDate = new Date(2024, 11, 31);
    const result = getCurrentMonthRange(testDate);

    expect(result.start.getDate()).toBe(1);
    expect(result.end.getDate()).toBe(31);
  });

  it("should handle February in leap year", () => {
    const testDate = new Date(2024, 1, 15);
    const result = getCurrentMonthRange(testDate);

    expect(result.start.getDate()).toBe(1);
    expect(result.end.getDate()).toBe(29);
  });

  it("should handle February in non-leap year", () => {
    const testDate = new Date(2023, 1, 15);
    const result = getCurrentMonthRange(testDate);

    expect(result.start.getDate()).toBe(1);
    expect(result.end.getDate()).toBe(28);
  });

  it("should return date objects with proper structure", () => {
    const testDate = new Date(2024, 5, 15);
    const result = getCurrentMonthRange(testDate);

    expect(result).toHaveProperty("start");
    expect(result).toHaveProperty("end");
    expect(result.start).toBeInstanceOf(Date);
    expect(result.end).toBeInstanceOf(Date);
  });

  it("should have start before end", () => {
    const testDate = new Date(2024, 5, 15);
    const result = getCurrentMonthRange(testDate);

    expect(result.start.getTime()).toBeLessThan(result.end.getTime());
  });
});

describe("#getDayRange", () => {
  it("should return start and end of day", () => {
    const testDate = new Date(2024, 5, 15, 14, 30, 45);
    const result = getDayRange(testDate);

    expect(result.start).toEqual(startOfDay(testDate));
    expect(result.end).toEqual(endOfDay(testDate));
  });

  it("should set start to midnight (00:00:00.000)", () => {
    const testDate = new Date(2024, 5, 15, 14, 30, 45);
    const result = getDayRange(testDate);

    expect(result.start.getHours()).toBe(0);
    expect(result.start.getMinutes()).toBe(0);
    expect(result.start.getSeconds()).toBe(0);
    expect(result.start.getMilliseconds()).toBe(0);
  });

  it("should set end to last millisecond (23:59:59.999)", () => {
    const testDate = new Date(2024, 5, 15, 14, 30, 45);
    const result = getDayRange(testDate);

    expect(result.end.getHours()).toBe(23);
    expect(result.end.getMinutes()).toBe(59);
    expect(result.end.getSeconds()).toBe(59);
    expect(result.end.getMilliseconds()).toBe(999);
  });

  it("should handle date already at start of day", () => {
    const testDate = new Date(2024, 5, 15, 0, 0, 0, 0);
    const result = getDayRange(testDate);

    expect(result.start).toEqual(testDate);
    expect(result.end.getHours()).toBe(23);
  });

  it("should handle date already at end of day", () => {
    const testDate = new Date(2024, 5, 15, 23, 59, 59, 999);
    const result = getDayRange(testDate);

    expect(result.start.getHours()).toBe(0);
    expect(result.end).toEqual(testDate);
  });

  it("should preserve the same date", () => {
    const testDate = new Date(2024, 5, 15, 14, 30);
    const result = getDayRange(testDate);

    expect(result.start.getFullYear()).toBe(2024);
    expect(result.start.getMonth()).toBe(5);
    expect(result.start.getDate()).toBe(15);

    expect(result.end.getFullYear()).toBe(2024);
    expect(result.end.getMonth()).toBe(5);
    expect(result.end.getDate()).toBe(15);
  });

  it("should return date objects with proper structure", () => {
    const testDate = new Date(2024, 5, 15);
    const result = getDayRange(testDate);

    expect(result).toHaveProperty("start");
    expect(result).toHaveProperty("end");
    expect(result.start).toBeInstanceOf(Date);
    expect(result.end).toBeInstanceOf(Date);
  });

  it("should have start before end", () => {
    const testDate = new Date(2024, 5, 15, 12, 0);
    const result = getDayRange(testDate);

    expect(result.start.getTime()).toBeLessThan(result.end.getTime());
  });

  it("should handle leap year date", () => {
    const testDate = new Date(2024, 1, 29, 12, 0);
    const result = getDayRange(testDate);

    expect(result.start.getDate()).toBe(29);
    expect(result.end.getDate()).toBe(29);
  });
});
