"use client";

import { useMemo } from "react";
import { Card } from "../ui/card";
import { Droplets, TrendingUp, BarChart3 } from "lucide-react";
import { getMonth } from "date-fns";

export function MonthlyLiquidityPatterns({ data, timeFrame }) {
  const liquidityAnalysis = useMemo(() => {
    if (!data || data.length === 0 || timeFrame !== "monthly") return null;

    // Group data by month and analyze liquidity patterns
    const monthlyData = {};
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Initialize monthly data structure
    monthNames.forEach((month, index) => {
      monthlyData[index] = {
        name: month,
        data: [],
        totalVolume: 0,
        avgLiquidity: 0,
        liquidityScore: 0,
        marketDepth: 0,
        spreadTightness: 0,
      };
    });

    // Process data and group by month
    data.forEach((item) => {
      const date = new Date(item.timestamp);
      const month = getMonth(date);

      // Calculate advanced liquidity metrics
      const volume = item.volume || 0;
      const priceRange = (item.high - item.low) / item.close;
      const liquidityScore = volume / (priceRange * item.close); // Volume per price impact
      const marketDepth = Math.log(volume) / Math.log(item.close); // Depth approximation
      const spreadTightness = 1 / (priceRange + 0.001); // Inverse of spread

      monthlyData[month].data.push({
        ...item,
        liquidityScore,
        marketDepth,
        spreadTightness,
      });

      monthlyData[month].totalVolume += volume;
    });

    // Calculate monthly statistics
    Object.keys(monthlyData).forEach((month) => {
      const monthData = monthlyData[month];
      if (monthData.data.length > 0) {
        monthData.avgLiquidity =
          monthData.data.reduce((sum, item) => sum + item.liquidityScore, 0) /
          monthData.data.length;
        monthData.liquidityScore = monthData.avgLiquidity;
        monthData.marketDepth =
          monthData.data.reduce((sum, item) => sum + item.marketDepth, 0) /
          monthData.data.length;
        monthData.spreadTightness =
          monthData.data.reduce((sum, item) => sum + item.spreadTightness, 0) /
          monthData.data.length;
        monthData.avgVolume = monthData.totalVolume / monthData.data.length;
        monthData.dataPoints = monthData.data.length;
      }
    });

    // Find liquidity patterns
    const monthsWithData = Object.entries(monthlyData).filter(
      ([_, data]) => data.dataPoints > 0
    );

    const bestLiquidityMonth = monthsWithData.reduce(
      (best, [month, data]) =>
        data.liquidityScore > best.liquidityScore
          ? { month: data.name, liquidityScore: data.liquidityScore }
          : best,
      { month: "", liquidityScore: 0 }
    );

    const worstLiquidityMonth = monthsWithData.reduce(
      (worst, [month, data]) =>
        data.liquidityScore < worst.liquidityScore
          ? { month: data.name, liquidityScore: data.liquidityScore }
          : worst,
      { month: "", liquidityScore: Number.POSITIVE_INFINITY }
    );

    const highestVolumeMonth = monthsWithData.reduce(
      (highest, [month, data]) =>
        data.avgVolume > highest.avgVolume
          ? { month: data.name, avgVolume: data.avgVolume }
          : highest,
      { month: "", avgVolume: 0 }
    );

    // Seasonal liquidity trends
    const seasonalLiquidity = {
      Q1:
        monthsWithData
          .filter(([month]) => [0, 1, 2].includes(Number.parseInt(month)))
          .reduce((sum, [_, data]) => sum + data.liquidityScore, 0) / 3,
      Q2:
        monthsWithData
          .filter(([month]) => [3, 4, 5].includes(Number.parseInt(month)))
          .reduce((sum, [_, data]) => sum + data.liquidityScore, 0) / 3,
      Q3:
        monthsWithData
          .filter(([month]) => [6, 7, 8].includes(Number.parseInt(month)))
          .reduce((sum, [_, data]) => sum + data.liquidityScore, 0) / 3,
      Q4:
        monthsWithData
          .filter(([month]) => [9, 10, 11].includes(Number.parseInt(month)))
          .reduce((sum, [_, data]) => sum + data.liquidityScore, 0) / 3,
    };

    // Liquidity consistency analysis
    const liquidityScores = monthsWithData.map(
      ([_, data]) => data.liquidityScore
    );
    const avgLiquidityScore =
      liquidityScores.reduce((sum, score) => sum + score, 0) /
      liquidityScores.length;
    const liquidityVariance =
      liquidityScores.reduce(
        (sum, score) => sum + Math.pow(score - avgLiquidityScore, 2),
        0
      ) / liquidityScores.length;
    const liquidityConsistency = 1 / (1 + liquidityVariance); // Higher is more consistent

    return {
      monthlyData,
      patterns: {
        bestLiquidityMonth,
        worstLiquidityMonth,
        highestVolumeMonth,
      },
      seasonalLiquidity,
      metrics: {
        avgLiquidityScore,
        liquidityConsistency,
        totalMonthsAnalyzed: monthsWithData.length,
      },
    };
  }, [data, timeFrame]);

  if (!liquidityAnalysis) {
    return (
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Droplets className="h-4 w-4 text-blue-600" />
          <h3 className="font-semibold text-sm">Advanced Liquidity Patterns</h3>
        </div>
        <p className="text-xs text-gray-500">
          Switch to monthly view to see advanced liquidity pattern analysis
        </p>
      </Card>
    );
  }

  const { monthlyData, patterns, seasonalLiquidity, metrics } =
    liquidityAnalysis;

  const formatVolume = (volume) => {
    if (volume >= 1000000000) return `${(volume / 1000000000).toFixed(1)}B`;
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return Math.round(volume).toString();
  };

  const formatLiquidityScore = (score) => {
    if (score >= 1000000) return `${(score / 1000000).toFixed(1)}M`;
    if (score >= 1000) return `${(score / 1000).toFixed(1)}K`;
    return score.toFixed(0);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Droplets className="h-4 w-4 text-blue-600" />
        <h3 className="font-semibold text-sm">Advanced Liquidity Patterns</h3>
      </div>

      <div className="space-y-4">
        {/* Monthly Liquidity Overview */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">
            Monthly Liquidity Scores
          </div>
          <div className="grid grid-cols-3 gap-1">
            {Object.entries(monthlyData).map(([monthNum, monthData]) => {
              if (monthData.dataPoints === 0) return null;
              return (
                <div
                  key={monthNum}
                  className="bg-blue-50 p-1.5 rounded text-center"
                >
                  <div className="text-xs text-blue-700 font-medium">
                    {monthData.name.slice(0, 3)}
                  </div>
                  <div className="text-xs font-bold text-blue-800">
                    {formatLiquidityScore(monthData.liquidityScore)}
                  </div>
                  <div className="text-xs text-gray-600">
                    {formatVolume(monthData.avgVolume)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Liquidity Pattern Insights */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">
            Liquidity Insights
          </div>
          <div className="space-y-1">
            <div className="bg-green-50 p-2 rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-700">
                    Best Liquidity:
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-green-800">
                    {patterns.bestLiquidityMonth.month}
                  </div>
                  <div className="text-xs text-green-600">
                    {formatLiquidityScore(
                      patterns.bestLiquidityMonth.liquidityScore
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-2 rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
                  <span className="text-xs text-red-700">
                    Lowest Liquidity:
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-red-800">
                    {patterns.worstLiquidityMonth.month}
                  </div>
                  <div className="text-xs text-red-600">
                    {formatLiquidityScore(
                      patterns.worstLiquidityMonth.liquidityScore
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-2 rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <BarChart3 className="h-3 w-3 text-purple-600" />
                  <span className="text-xs text-purple-700">
                    Highest Volume:
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-purple-800">
                    {patterns.highestVolumeMonth.month}
                  </div>
                  <div className="text-xs text-purple-600">
                    {formatVolume(patterns.highestVolumeMonth.avgVolume)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seasonal Liquidity Analysis */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">
            Seasonal Liquidity Trends
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(seasonalLiquidity).map(
              ([quarter, liquidityScore]) => (
                <div key={quarter} className="bg-gray-50 p-2 rounded">
                  <div className="text-xs font-medium text-gray-700">
                    {quarter}
                  </div>
                  <div className="text-sm font-bold text-blue-600">
                    {formatLiquidityScore(liquidityScore)}
                  </div>
                  <div className="w-full h-1 bg-gray-200 rounded-full mt-1">
                    <div
                      className="h-full bg-blue-400 rounded-full"
                      style={{
                        width: `${
                          (liquidityScore /
                            Math.max(...Object.values(seasonalLiquidity))) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Liquidity Metrics Summary */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">
            Liquidity Health Metrics
          </div>
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-blue-50 p-2 rounded">
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-700">
                  Average Liquidity Score:
                </span>
                <span className="text-xs font-bold text-blue-800">
                  {formatLiquidityScore(metrics.avgLiquidityScore)}
                </span>
              </div>
            </div>
            <div className="bg-green-50 p-2 rounded">
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-700">
                  Consistency Index:
                </span>
                <span className="text-xs font-bold text-green-800">
                  {(metrics.liquidityConsistency * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-700">Months Analyzed:</span>
                <span className="text-xs font-bold text-gray-800">
                  {metrics.totalMonthsAnalyzed}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Liquidity Consistency Visualization */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-700">
            Liquidity Consistency
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                metrics.liquidityConsistency > 0.7
                  ? "bg-green-400"
                  : metrics.liquidityConsistency > 0.4
                  ? "bg-yellow-400"
                  : "bg-red-400"
              }`}
              style={{ width: `${metrics.liquidityConsistency * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Volatile</span>
            <span>Consistent</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
