import { describe, it, expect } from "vitest";
import { filterExpensesByDay } from "@/lib/utils";

describe("#filterExpensesByDay", () => {
  it("should filter expenses by day", () => {
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

    expect(filterExpensesByDay(expenses, 2)).toEqual([expenses[1]]);
  });
});
