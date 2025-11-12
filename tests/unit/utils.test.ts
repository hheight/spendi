import { describe, it, expect } from "vitest";
import { buildChartData, getBalance } from "@/lib/utils";

describe("#buildChartData", () => {
  it("should build chart data and config", () => {
    const categories = [
      { id: "1", name: "Food", color: "#00ff00" },
      { id: "2", name: "Housing", color: "#c0ffee" }
    ];

    const expenses = [
      { categoryId: "1", _sum: { value: 540 } },
      { categoryId: "2", _sum: { value: 1200 } }
    ];

    const { chartData, chartConfig } = buildChartData(categories, expenses);

    expect(chartData).toEqual([
      { name: "Food", value: 540, fill: "var(--color-food)" },
      { name: "Housing", value: 1200, fill: "var(--color-housing)" }
    ]);

    expect(chartConfig).toEqual({
      food: { label: "Food", color: "#00ff00" },
      housing: { label: "Housing", color: "#c0ffee" }
    });
  });

  it("should handle categories with no expenses", () => {
    const categories = [
      { id: "1", name: "Food", color: "#00ff00" },
      { id: "2", name: "Housing", color: "#c0ffee" }
    ];

    const expenses = [{ categoryId: "1", _sum: { value: 540 } }];

    const { chartData } = buildChartData(categories, expenses);

    expect(chartData).toHaveLength(1);
    expect(chartData[0].name).toBe("Food");
  });

  it("should handle multi-word category names", () => {
    const categories = [{ id: "1", name: "Public Transportation", color: "#00ff00" }];

    const expenses = [{ categoryId: "1", _sum: { value: 100 } }];

    const { chartData, chartConfig } = buildChartData(categories, expenses);

    expect(chartData[0].fill).toBe("var(--color-public-transportation)");
    expect(chartConfig["public-transportation"]).toBeDefined();
  });
});

describe("#getBalance", () => {
  it("should calculate balance correctly", () => {
    const chartData = [
      { name: "Food", value: 100, fill: "var(--color-food)" },
      { name: "Housing", value: 200, fill: "var(--color-housing)" }
    ];

    const result = getBalance(chartData, { income: 500 });

    expect(result.expenseSum).toBe(300);
    expect(result.balance).toBe(200);
  });

  it("should return zero balance when income equals expenses", () => {
    const chartData = [
      { name: "Food", value: 250, fill: "var(--color-food)" },
      { name: "Housing", value: 250, fill: "var(--color-housing)" }
    ];

    const result = getBalance(chartData, { income: 500 });

    expect(result.expenseSum).toBe(500);
    expect(result.balance).toBe(0);
  });

  it("should return negative balance when expenses exceed income", () => {
    const chartData = [
      { name: "Food", value: 400, fill: "var(--color-food)" },
      { name: "Housing", value: 300, fill: "var(--color-housing)" }
    ];

    const result = getBalance(chartData, { income: 500 });

    expect(result.expenseSum).toBe(700);
    expect(result.balance).toBe(-200);
  });

  it("should handle empty chart data", () => {
    const result = getBalance([], { income: 1000 });

    expect(result.expenseSum).toBe(0);
    expect(result.balance).toBe(1000);
  });

  it("should handle zero income", () => {
    const chartData = [{ name: "Food", value: 100, fill: "var(--color-food)" }];

    const result = getBalance(chartData, { income: 0 });

    expect(result.expenseSum).toBe(100);
    expect(result.balance).toBe(-100);
  });

  it("should handle decimal values", () => {
    const chartData = [
      { name: "Food", value: 123.45, fill: "var(--color-food)" },
      { name: "Transport", value: 67.89, fill: "var(--color-transport)" }
    ];

    const result = getBalance(chartData, { income: 500.5 });

    expect(result.expenseSum).toBeCloseTo(191.34);
    expect(result.balance).toBeCloseTo(309.16);
  });

  it("should handle single expense", () => {
    const chartData = [{ name: "Food", value: 150, fill: "var(--color-food)" }];

    const result = getBalance(chartData, { income: 1000 });

    expect(result.expenseSum).toBe(150);
    expect(result.balance).toBe(850);
  });

  it("should handle multiple expenses", () => {
    const chartData = [
      { name: "Food", value: 100, fill: "var(--color-food)" },
      { name: "Housing", value: 200, fill: "var(--color-housing)" },
      { name: "Transport", value: 50, fill: "var(--color-transport)" },
      { name: "Utilities", value: 75, fill: "var(--color-utilities)" }
    ];

    const result = getBalance(chartData, { income: 1000 });

    expect(result.expenseSum).toBe(425);
    expect(result.balance).toBe(575);
  });
});
