import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  buildChartConfig,
  buildChartData,
  buildMonthSelectOptions,
  calculateTotalAmount
} from "@/lib/utils";

describe("#buildChartConfig", () => {
  it("should build chart config", () => {
    const categories = [
      { id: "1", name: "Food", color: "#00ff00" },
      { id: "2", name: "Housing", color: "#c0ffee" }
    ];

    const chartConfig = buildChartConfig(categories);

    expect(chartConfig).toEqual({
      food: { label: "Food", color: "#00ff00" },
      housing: { label: "Housing", color: "#c0ffee" }
    });
  });
});

describe("#buildMonthlyChartData", () => {
  it("should build monthly chart data", () => {
    const expenses = [
      {
        id: "1",
        item: "Fruits",
        value: 16,
        createdAt: new Date(2000, 1, 1),
        category: {
          name: "Food",
          color: "#00ff00"
        }
      },
      {
        id: "2",
        item: "Rent",
        value: 1200,
        createdAt: new Date(2000, 1, 2),
        category: {
          name: "Housing",
          color: "#c0ffee"
        }
      }
    ];

    const chartData = buildChartData(expenses, 3);

    expect(chartData).toEqual([
      { day: 1, value: 16 },
      { day: 2, value: 1200 },
      { day: 3 }
    ]);
  });

  it("should handle empty expenses array", () => {
    const chartData = buildChartData([], 2);

    expect(chartData).toEqual([{ day: 1 }, { day: 2 }]);
  });
});

describe("#buildMonthSelectOptions", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return options from start date to current date", () => {
    vi.setSystemTime(new Date(2025, 11, 1));
    const startDate = new Date(2025, 0, 1);
    const options = buildMonthSelectOptions(startDate);

    expect(options).toHaveLength(12);
    expect(options[0]).toEqual({ label: "Dec 2025", value: "2025-12" });
    expect(options[11]).toEqual({ label: "Jan 2025", value: "2025-01" });
  });

  it("should return single option when start date is current month", () => {
    vi.setSystemTime(new Date(2025, 5, 15));
    const startDate = new Date(2025, 5, 1);
    const options = buildMonthSelectOptions(startDate);

    expect(options).toHaveLength(1);
    expect(options[0]).toEqual({ label: "Jun 2025", value: "2025-06" });
  });

  it("should return options in descending order", () => {
    vi.setSystemTime(new Date(2025, 2, 1));
    const startDate = new Date(2025, 0, 1);
    const options = buildMonthSelectOptions(startDate);

    expect(options).toHaveLength(3);
    expect(options[0].value).toBe("2025-03");
    expect(options[1].value).toBe("2025-02");
    expect(options[2].value).toBe("2025-01");
  });

  it("should handle options spanning multiple years", () => {
    vi.setSystemTime(new Date(2025, 2, 1));
    const startDate = new Date(2024, 10, 1);
    const options = buildMonthSelectOptions(startDate);

    expect(options).toHaveLength(5);
    expect(options[0]).toEqual({ label: "Mar 2025", value: "2025-03" });
    expect(options[1]).toEqual({ label: "Feb 2025", value: "2025-02" });
    expect(options[2]).toEqual({ label: "Jan 2025", value: "2025-01" });
    expect(options[3]).toEqual({ label: "Dec 2024", value: "2024-12" });
    expect(options[4]).toEqual({ label: "Nov 2024", value: "2024-11" });
  });
});

describe("calculateTotalAmount", () => {
  it("should return 0 for empty array", () => {
    const result = calculateTotalAmount([]);
    expect(result).toBe(0);
  });

  it("should calculate total for multiple expenses", () => {
    const expenses = [
      {
        id: "1",
        item: "Fruits",
        value: 16,
        createdAt: new Date(2000, 1, 1),
        category: {
          name: "Food",
          color: "#00ff00"
        }
      },
      {
        id: "2",
        item: "Rent",
        value: 1200,
        createdAt: new Date(2000, 1, 2),
        category: {
          name: "Housing",
          color: "#c0ffee"
        }
      }
    ];

    expect(calculateTotalAmount(expenses)).toBe(1216);
  });
});
