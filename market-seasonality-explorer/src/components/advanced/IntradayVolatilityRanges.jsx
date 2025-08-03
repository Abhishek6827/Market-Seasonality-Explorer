"use client";

import { useMemo } from "react";
import { Card } from "../ui/card";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export function IntradayVolatilityRanges({ data, selectedDate, timeFrame }) {
  const volatilityAnalysis = useMemo(() => {
    if (!data || data.length === 0 || timeFrame !== "daily") return null;

    // Calculate intraday volatility ranges for the selected date or recent period
    const relevantData = selectedDate
      ? data.filter((item) => {
          const itemDate = new Date(item.timestamp);
          return itemDate.toDateString() === selectedDate.toDateString();
        })
      : data.slice(-30); // Last 30 days if no specific date selected

    if (relevantData.length === 0) return null;

    // Calculate various volatility metrics
    const volatilityRanges = relevantData.map((item) => {
      const highLowRange = ((item.high - item.low) / item.close) * 100;
      const openCloseRange =
        Math.abs((item.close - item.open) / item.open) * 100;
      const trueRange =
        (Math.max(
          item.high - item.low,
          Math.abs(item.high - item.close),
          Math.abs(item.low - item.close)
        ) /
          item.close) *
        100;

      return {
        date: new Date(item.timestamp),
        highLowRange,
        openCloseRange,
        trueRange,
        volume: item.volume,
        price: item.close,
      };
    });

    // Calculate statistics
    const avgHighLowRange =
      volatilityRanges.reduce((sum, item) => sum + item.highLowRange, 0) /
      volatilityRanges.length;
    const avgOpenCloseRange =
      volatilityRanges.reduce((sum, item) => sum + item.openCloseRange, 0) /
      volatilityRanges.length;
    const avgTrueRange =
      volatilityRanges.reduce((sum, item) => sum + item.trueRange, 0) /
      volatilityRanges.length;

    // Identify volatility patterns
    const highVolatilityDays = volatilityRanges.filter(
      (item) => item.trueRange > avgTrueRange * 1.5
    );
    const lowVolatilityDays = volatilityRanges.filter(
      (item) => item.trueRange < avgTrueRange * 0.5
    );

    return {
      ranges: volatilityRanges,
      statistics: {
        avgHighLowRange: avgHighLowRange.toFixed(2),
        avgOpenCloseRange: avgOpenCloseRange.toFixed(2),
        avgTrueRange: avgTrueRange.toFixed(2),
      },
      patterns: {
        highVolatilityDays: highVolatilityDays.length,
        lowVolatilityDays: lowVolatilityDays.length,
        volatilityTrend:
          volatilityRanges.length > 1
            ? volatilityRanges[volatilityRanges.length - 1].trueRange >
              volatilityRanges[0].trueRange
              ? "increasing"
              : "decreasing"
            : "stable",
      },
    };
  }, [data, selectedDate, timeFrame]);

  if (!volatilityAnalysis) {
    return (
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Activity className="h-4 w-4 text-orange-600" />
          <h3 className="font-semibold text-sm">Intraday Volatility Ranges</h3>
        </div>
        <p className="text-xs text-gray-500">
          Select a date in daily view to see intraday volatility analysis
        </p>
      </Card>
    );
  }

  const { statistics, patterns } = volatilityAnalysis;

  return (
    <Card className="p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Activity className="h-4 w-4 text-orange-600" />
        <h3 className="font-semibold text-sm">Intraday Volatility Ranges</h3>
      </div>

      <div className="space-y-3">
        {/* Volatility Statistics */}
        <div className="grid grid-cols-1 gap-2">
          <div className="bg-orange-50 p-2 rounded">
            <div className="text-xs text-orange-700 font-medium">
              Average High-Low Range
            </div>
            <div className="text-sm font-bold text-orange-800">
              {statistics.avgHighLowRange}%
            </div>
          </div>
          <div className="bg-blue-50 p-2 rounded">
            <div className="text-xs text-blue-700 font-medium">
              Average Open-Close Range
            </div>
            <div className="text-sm font-bold text-blue-800">
              {statistics.avgOpenCloseRange}%
            </div>
          </div>
          <div className="bg-purple-50 p-2 rounded">
            <div className="text-xs text-purple-700 font-medium">
              Average True Range (ATR)
            </div>
            <div className="text-sm font-bold text-purple-800">
              {statistics.avgTrueRange}%
            </div>
          </div>
        </div>

        {/* Volatility Patterns */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">
            Volatility Patterns
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">High Volatility Days:</span>
            <span className="font-medium text-red-600">
              {patterns.highVolatilityDays}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Low Volatility Days:</span>
            <span className="font-medium text-green-600">
              {patterns.lowVolatilityDays}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Trend:</span>
            <div className="flex items-center space-x-1">
              {patterns.volatilityTrend === "increasing" ? (
                <TrendingUp className="h-3 w-3 text-red-500" />
              ) : patterns.volatilityTrend === "decreasing" ? (
                <TrendingDown className="h-3 w-3 text-green-500" />
              ) : null}
              <span
                className={`font-medium capitalize ${
                  patterns.volatilityTrend === "increasing"
                    ? "text-red-600"
                    : patterns.volatilityTrend === "decreasing"
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                {patterns.volatilityTrend}
              </span>
            </div>
          </div>
        </div>

        {/* Volatility Range Visualization */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-700">
            Recent Volatility Distribution
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  Number.parseFloat(statistics.avgTrueRange) * 10
                )}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
