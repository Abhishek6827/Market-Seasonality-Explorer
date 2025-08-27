"use client";
import { format } from "date-fns";

export function ComparisonModeInfo({ isComparisonMode, selectedDates = [] }) {
  if (!isComparisonMode || selectedDates.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
      <div className="text-sm text-green-800">
        <span>
          ✅ <strong>Comparison Mode Active:</strong> Comparing{" "}
          {selectedDates.length} dates:{" "}
          {selectedDates.map((d) => format(d, "MMM dd")).join(", ")}
        </span>
      </div>
    </div>
  );
}
