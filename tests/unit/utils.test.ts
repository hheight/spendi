import { describe, it, expect } from "vitest";
import {
  buildChartConfig,
  buildMonthlyChartData,
  filterExpensesByDay
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
        createdAt: new Date(Date.UTC(2000, 1, 1)),
        category: {
          name: "Food",
          color: "#00ff00"
        }
      },
      {
        id: "2",
        item: "Rent",
        value: 1200,
        createdAt: new Date(Date.UTC(2000, 1, 2)),
        category: {
          name: "Housing",
          color: "#c0ffee"
        }
      }
    ];

    const chartData = buildMonthlyChartData(expenses, 3);

    expect(chartData).toEqual([
      { day: 1, value: 16 },
      { day: 2, value: 1200 },
      { day: 3 }
    ]);
  });

  it("should handle empty expenses array", () => {
    const chartData = buildMonthlyChartData([], 2);

    expect(chartData).toEqual([{ day: 1 }, { day: 2 }]);
  });
});

describe("#filterExpensesByDay", () => {
  it("should filter expenses by day", () => {
    const expenses = [
      {
        id: "1",
        item: "Fruits",
        value: 16,
        createdAt: new Date(Date.UTC(2000, 1, 1)),
        category: {
          name: "Food",
          color: "#00ff00"
        }
      },
      {
        id: "2",
        item: "Rent",
        value: 1200,
        createdAt: new Date(Date.UTC(2000, 1, 2)),
        category: {
          name: "Housing",
          color: "#c0ffee"
        }
      }
    ];

    const { spentByDay, expensesByDay } = filterExpensesByDay(expenses, 2);

    expect(spentByDay).toBe(1200);
    expect(expensesByDay).toEqual([
      {
        id: "2",
        item: "Rent",
        value: 1200,
        createdAt: new Date(Date.UTC(2000, 1, 2)),
        category: {
          name: "Housing",
          color: "#c0ffee"
        }
      }
    ]);
  });
});
