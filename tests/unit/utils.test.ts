import { describe, it, expect } from "vitest";
import { buildChartData } from "@/lib/utils";

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
