"use client";

import { SlideIn } from "../animations/FadeIn";

export function CalendarInfo({ data, dataInPeriod, timeFrame }) {
  return (
    <SlideIn
      direction="up"
      className="text-xs bg-gradient-to-r from-blue-50 to-green-50 p-3 rounded-lg border border-blue-200"
    >
      <div className="font-medium text-blue-900 mb-2">
        📊 Market Data Visualization Guide:
      </div>
      <div className="grid grid-cols-2 gap-3 text-blue-800">
        <div>
          <div className="font-medium">📈 Data Coverage:</div>
          <div>• Total points: {data.length}</div>
          <div>
            • This period: {dataInPeriod}{" "}
            {timeFrame === "daily"
              ? "days"
              : timeFrame === "weekly"
              ? "weeks"
              : "months"}
          </div>
        </div>
        <div>
          <div className="font-medium">🎨 Visual Elements:</div>
          <div>• Cell colors = volatility levels</div>
          <div>• Arrows = price trends</div>
          <div>• Bars = volume indicators</div>
        </div>
      </div>
      <div className="mt-2 text-center text-blue-700 font-medium">
        🖱️ Hover over any cell to see detailed metrics | ⌨️ Use arrow keys to
        navigate
      </div>
    </SlideIn>
  );
}
