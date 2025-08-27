"use client";

import { useMemo } from "react";
import { Card } from "../ui/card";
import {
  Snowflake,
  Sun,
  Leaf,
  Flower,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { getMonth, getQuarter } from "date-fns";

export function SeasonalTrendAnalysis({ data, timeFrame }) {
  const seasonalAnalysis = useMemo(() => {
    if (
      !data ||
      data.length === 0 ||
      (timeFrame !== "weekly" && timeFrame !== "monthly")
    )
      return null;

    // Group data by seasons and quarters
    const seasonalData = {
      spring: { name: "Spring", icon: Flower, data: [], months: [2, 3, 4] }, // Mar, Apr, May
      summer: { name: "Summer", icon: Sun, data: [], months: [5, 6, 7] }, // Jun, Jul, Aug
      autumn: { name: "Autumn", icon: Leaf, data: [], months: [8, 9, 10] }, // Sep, Oct, Nov
      winter: { name: "Winter", icon: Snowflake, data: [], months: [11, 0, 1] }, // Dec, Jan, Feb
    };

    const quarterlyData = {
      Q1: { name: "Q1", data: [], months: [0, 1, 2] },
      Q2: { name: "Q2", data: [], months: [3, 4, 5] },
      Q3: { name: "Q3", data: [], months: [6, 7, 8] },
      Q4: { name: "Q4", data: [], months: [9, 10, 11] },
    };

    // Process data and group by seasons and quarters
    data.forEach((item) => {
      const date = new Date(item.timestamp);
      const month = getMonth(date);
      const quarter = getQuarter(date);

      // Group by season
      Object.keys(seasonalData).forEach((season) => {
        if (seasonalData[season].months.includes(month)) {
          seasonalData[season].data.push(item);
        }
      });

      // Group by quarter
      quarterlyData[`Q${quarter}`].data.push(item);
    });

    // Calculate seasonal statistics
    const seasonalStats = {};
    Object.keys(seasonalData).forEach((season) => {
      const seasonData = seasonalData[season].data;
      if (seasonData.length > 0) {
        const avgPrice =
          seasonData.reduce((sum, item) => sum + item.close, 0) /
          seasonData.length;
        const avgVolume =
          seasonData.reduce((sum, item) => sum + (item.volume || 0), 0) /
          seasonData.length;
        const avgVolatility =
          seasonData.reduce((sum, item) => sum + (item.volatility || 0), 0) /
          seasonData.length;
        const totalReturn =
          seasonData.length > 1
            ? ((seasonData[seasonData.length - 1].close - seasonData[0].close) /
                seasonData[0].close) *
              100
            : 0;

        seasonalStats[season] = {
          avgPrice,
          avgVolume,
          avgVolatility,
          totalReturn,
          dataPoints: seasonData.length,
        };
      }
    });

    // Calculate quarterly statistics
    const quarterlyStats = {};
    Object.keys(quarterlyData).forEach((quarter) => {
      const quarterData = quarterlyData[quarter].data;
      if (quarterData.length > 0) {
        const avgPrice =
          quarterData.reduce((sum, item) => sum + item.close, 0) /
          quarterData.length;
        const avgVolume =
          quarterData.reduce((sum, item) => sum + (item.volume || 0), 0) /
          quarterData.length;
        const avgVolatility =
          quarterData.reduce((sum, item) => sum + (item.volatility || 0), 0) /
          quarterData.length;
        const totalReturn =
          quarterData.length > 1
            ? ((quarterData[quarterData.length - 1].close -
                quarterData[0].close) /
                quarterData[0].close) *
              100
            : 0;

        quarterlyStats[quarter] = {
          avgPrice,
          avgVolume,
          avgVolatility,
          totalReturn,
          dataPoints: quarterData.length,
        };
      }
    });

    // Find best and worst performing seasons/quarters
    const bestSeason = Object.entries(seasonalStats).reduce(
      (best, [season, stats]) =>
        stats.totalReturn > best.totalReturn
          ? { season, totalReturn: stats.totalReturn }
          : best,
      { season: "", totalReturn: Number.NEGATIVE_INFINITY }
    );

    const worstSeason = Object.entries(seasonalStats).reduce(
      (worst, [season, stats]) =>
        stats.totalReturn < worst.totalReturn
          ? { season, totalReturn: stats.totalReturn }
          : worst,
      { season: "", totalReturn: Number.POSITIVE_INFINITY }
    );

    const bestQuarter = Object.entries(quarterlyStats).reduce(
      (best, [quarter, stats]) =>
        stats.totalReturn > best.totalReturn
          ? { quarter, totalReturn: stats.totalReturn }
          : best,
      { quarter: "", totalReturn: Number.NEGATIVE_INFINITY }
    );

    // Seasonal volatility patterns
    const volatilityPattern = Object.entries(seasonalStats)
      .sort((a, b) => b[1].avgVolatility - a[1].avgVolatility)
      .map(([season, stats]) => ({ season, volatility: stats.avgVolatility }));

    return {
      seasonalStats,
      quarterlyStats,
      patterns: {
        bestSeason,
        worstSeason,
        bestQuarter,
        volatilityPattern,
      },
      seasonalData,
    };
  }, [data, timeFrame]);

  if (!seasonalAnalysis) {
    return (
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Sun className="h-4 w-4 text-yellow-600" />
          <h3 className="font-semibold text-sm">Seasonal Trend Analysis</h3>
        </div>
        <p className="text-xs text-gray-500">
          Switch to weekly or monthly view to see seasonal trend analysis
        </p>
      </Card>
    );
  }

  const { seasonalStats, quarterlyStats, patterns, seasonalData } =
    seasonalAnalysis;

  const formatPrice = (price) => `$${price.toFixed(0)}`;
  const formatVolume = (volume) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return Math.round(volume).toString();
  };
  const formatReturn = (returnPct) =>
    `${returnPct >= 0 ? "+" : ""}${returnPct.toFixed(1)}%`;

  return (
    <Card className="p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Sun className="h-4 w-4 text-yellow-600" />
        <h3 className="font-semibold text-sm">Seasonal Trend Analysis</h3>
      </div>

      <div className="space-y-4">
        {/* Seasonal Performance */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">
            Seasonal Performance
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(seasonalData).map(([season, seasonInfo]) => {
              const stats = seasonalStats[season];
              if (!stats) return null;

              const IconComponent = seasonInfo.icon;
              return (
                <div key={season} className="bg-gray-50 p-2 rounded">
                  <div className="flex items-center space-x-1 mb-1">
                    <IconComponent className="h-3 w-3 text-gray-600" />
                    <span className="text-xs font-medium text-gray-700">
                      {seasonInfo.name}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Return:</span>
                      <span
                        className={`font-medium ${
                          stats.totalReturn >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatReturn(stats.totalReturn)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Avg Price:</span>
                      <span className="text-gray-800">
                        {formatPrice(stats.avgPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Volatility:</span>
                      <span className="text-orange-600">
                        {(stats.avgVolatility * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quarterly Analysis */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">
            Quarterly Breakdown
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(quarterlyStats).map(([quarter, stats]) => (
              <div key={quarter} className="bg-blue-50 p-2 rounded">
                <div className="text-xs font-medium text-blue-700 mb-1">
                  {quarter}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Return:</span>
                    <span
                      className={`font-medium ${
                        stats.totalReturn >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatReturn(stats.totalReturn)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Volume:</span>
                    <span className="text-blue-600">
                      {formatVolume(stats.avgVolume)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pattern Insights */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">
            Seasonal Insights
          </div>
          <div className="space-y-1">
            <div className="bg-green-50 p-2 rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-700">Best Season:</span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-green-800 capitalize">
                    {patterns.bestSeason.season}
                  </div>
                  <div className="text-xs text-green-600">
                    {formatReturn(patterns.bestSeason.totalReturn)}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-2 rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <TrendingDown className="h-3 w-3 text-red-600" />
                  <span className="text-xs text-red-700">Worst Season:</span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-red-800 capitalize">
                    {patterns.worstSeason.season}
                  </div>
                  <div className="text-xs text-red-600">
                    {formatReturn(patterns.worstSeason.totalReturn)}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-2 rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-blue-600" />
                  <span className="text-xs text-blue-700">Best Quarter:</span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-blue-800">
                    {patterns.bestQuarter.quarter}
                  </div>
                  <div className="text-xs text-blue-600">
                    {formatReturn(patterns.bestQuarter.totalReturn)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Volatility Pattern */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">
            Volatility by Season
          </div>
          <div className="space-y-1">
            {patterns.volatilityPattern.map((item, index) => (
              <div
                key={item.season}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-gray-600 capitalize">{item.season}:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-400 rounded-full"
                      style={{
                        width: `${
                          (item.volatility /
                            Math.max(
                              ...patterns.volatilityPattern.map(
                                (p) => p.volatility
                              )
                            )) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-orange-600 font-medium">
                    {(item.volatility * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
