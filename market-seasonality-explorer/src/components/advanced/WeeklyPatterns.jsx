"use client";

import { useMemo } from "react";
import { Card } from "../ui/card";
import { Calendar, TrendingUp, BarChart3, Activity } from "lucide-react";
import { format, getDay } from "date-fns";

export function WeeklyPatterns({ data, selectedDate, timeFrame }) {
  const weeklyAnalysis = useMemo(() => {
    if (!data || data.length === 0 || timeFrame !== "weekly") return null;

    // Group data by day of week and analyze patterns
    const dayOfWeekData = {
      0: {
        name: "Sunday",
        data: [],
        totalVolume: 0,
        avgPrice: 0,
        avgVolatility: 0,
      },
      1: {
        name: "Monday",
        data: [],
        totalVolume: 0,
        avgPrice: 0,
        avgVolatility: 0,
      },
      2: {
        name: "Tuesday",
        data: [],
        totalVolume: 0,
        avgPrice: 0,
        avgVolatility: 0,
      },
      3: {
        name: "Wednesday",
        data: [],
        totalVolume: 0,
        avgPrice: 0,
        avgVolatility: 0,
      },
      4: {
        name: "Thursday",
        data: [],
        totalVolume: 0,
        avgPrice: 0,
        avgVolatility: 0,
      },
      5: {
        name: "Friday",
        data: [],
        totalVolume: 0,
        avgPrice: 0,
        avgVolatility: 0,
      },
      6: {
        name: "Saturday",
        data: [],
        totalVolume: 0,
        avgPrice: 0,
        avgVolatility: 0,
      },
    };

    // Process data and group by day of week
    data.forEach((item) => {
      const date = new Date(item.timestamp);
      const dayOfWeek = getDay(date);

      dayOfWeekData[dayOfWeek].data.push(item);
      dayOfWeekData[dayOfWeek].totalVolume += item.volume || 0;
    });

    // Calculate averages for each day
    Object.keys(dayOfWeekData).forEach((day) => {
      const dayData = dayOfWeekData[day];
      if (dayData.data.length > 0) {
        dayData.avgPrice =
          dayData.data.reduce((sum, item) => sum + item.close, 0) /
          dayData.data.length;
        dayData.avgVolatility =
          dayData.data.reduce((sum, item) => sum + (item.volatility || 0), 0) /
          dayData.data.length;
        dayData.avgVolume = dayData.totalVolume / dayData.data.length;
      }
    });

    // Find patterns
    const bestPerformingDay = Object.entries(dayOfWeekData).reduce(
      (best, [day, data]) =>
        data.avgPrice > best.avgPrice
          ? { day: data.name, avgPrice: data.avgPrice }
          : best,
      { day: "", avgPrice: 0 }
    );

    const highestVolumeDay = Object.entries(dayOfWeekData).reduce(
      (highest, [day, data]) =>
        data.avgVolume > highest.avgVolume
          ? { day: data.name, avgVolume: data.avgVolume }
          : highest,
      { day: "", avgVolume: 0 }
    );

    const mostVolatileDay = Object.entries(dayOfWeekData).reduce(
      (most, [day, data]) =>
        data.avgVolatility > most.avgVolatility
          ? { day: data.name, avgVolatility: data.avgVolatility }
          : most,
      { day: "", avgVolatility: 0 }
    );

    // Weekly trend analysis
    const recentWeeks = data.slice(-28); // Last 4 weeks
    const weeklyTrends = [];

    for (let i = 0; i < recentWeeks.length; i += 7) {
      const weekData = recentWeeks.slice(i, i + 7);
      if (weekData.length > 0) {
        const weekStart = new Date(weekData[0].timestamp);
        const weekEnd = new Date(weekData[weekData.length - 1].timestamp);
        const weekVolume = weekData.reduce(
          (sum, item) => sum + (item.volume || 0),
          0
        );
        const weekAvgPrice =
          weekData.reduce((sum, item) => sum + item.close, 0) / weekData.length;
        const weekVolatility =
          weekData.reduce((sum, item) => sum + (item.volatility || 0), 0) /
          weekData.length;

        weeklyTrends.push({
          weekStart,
          weekEnd,
          volume: weekVolume,
          avgPrice: weekAvgPrice,
          volatility: weekVolatility,
        });
      }
    }

    return {
      dayOfWeekData,
      patterns: {
        bestPerformingDay,
        highestVolumeDay,
        mostVolatileDay,
      },
      weeklyTrends,
    };
  }, [data, timeFrame]);

  if (!weeklyAnalysis) {
    return (
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Calendar className="h-4 w-4 text-purple-600" />
          <h3 className="font-semibold text-sm">Advanced Weekly Patterns</h3>
        </div>
        <p className="text-xs text-gray-500">
          Switch to weekly view to see advanced weekly pattern analysis
        </p>
      </Card>
    );
  }

  const { dayOfWeekData, patterns, weeklyTrends } = weeklyAnalysis;

  const formatVolume = (volume) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return Math.round(volume).toString();
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(0)}`;
  };

  return (
    <Card className="p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Calendar className="h-4 w-4 text-purple-600" />
        <h3 className="font-semibold text-sm">Advanced Weekly Patterns</h3>
      </div>

      <div className="space-y-4">
        {/* Day of Week Performance */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">
            Day of Week Analysis
          </div>
          <div className="grid grid-cols-1 gap-1">
            {Object.entries(dayOfWeekData).map(([dayNum, dayData]) => (
              <div
                key={dayNum}
                className="flex items-center justify-between text-xs p-1 rounded bg-gray-50"
              >
                <span className="font-medium text-gray-700">
                  {dayData.name.slice(0, 3)}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">
                    {formatPrice(dayData.avgPrice)}
                  </span>
                  <span className="text-blue-600">
                    {formatVolume(dayData.avgVolume)}
                  </span>
                  <span className="text-orange-600">
                    {(dayData.avgVolatility * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pattern Insights */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">
            Weekly Patterns
          </div>
          <div className="space-y-1">
            <div className="bg-green-50 p-2 rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-700">
                    Best Performance:
                  </span>
                </div>
                <span className="text-xs font-medium text-green-800">
                  {patterns.bestPerformingDay.day}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 p-2 rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <BarChart3 className="h-3 w-3 text-blue-600" />
                  <span className="text-xs text-blue-700">Highest Volume:</span>
                </div>
                <span className="text-xs font-medium text-blue-800">
                  {patterns.highestVolumeDay.day}
                </span>
              </div>
            </div>

            <div className="bg-orange-50 p-2 rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Activity className="h-3 w-3 text-orange-600" />
                  <span className="text-xs text-orange-700">
                    Most Volatile:
                  </span>
                </div>
                <span className="text-xs font-medium text-orange-800">
                  {patterns.mostVolatileDay.day}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Weekly Trends */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">
            Recent Weekly Trends
          </div>
          <div className="space-y-1">
            {weeklyTrends.slice(-3).map((week, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-xs p-1 rounded bg-gray-50"
              >
                <span className="text-gray-600">
                  {format(week.weekStart, "MMM dd")}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">
                    {formatPrice(week.avgPrice)}
                  </span>
                  <span className="text-blue-600">
                    {formatVolume(week.volume)}
                  </span>
                  <span className="text-orange-600">
                    {(week.volatility * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Performance Visualization */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-700">
            Weekly Performance Distribution
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Object.entries(dayOfWeekData).map(([dayNum, dayData]) => (
              <div key={dayNum} className="text-center">
                <div className="text-xs text-gray-600 mb-1">
                  {dayData.name.charAt(0)}
                </div>
                <div
                  className="h-8 bg-gradient-to-t from-blue-200 to-blue-400 rounded"
                  style={{
                    height: `${Math.max(
                      8,
                      (dayData.avgVolume /
                        Math.max(
                          ...Object.values(dayOfWeekData).map(
                            (d) => d.avgVolume
                          )
                        )) *
                        32
                    )}px`,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-500 text-center">
            Volume distribution by day
          </div>
        </div>
      </div>
    </Card>
  );
}
