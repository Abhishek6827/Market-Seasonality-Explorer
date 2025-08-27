"use client";

import { useMemo } from "react";
import { Card } from "../ui/card";
import { Volume2, Droplets, TrendingUp } from "lucide-react";

export function AdvancedLiquidityMetrics({ data, selectedDate, timeFrame }) {
  const liquidityAnalysis = useMemo(() => {
    if (!data || data.length === 0 || timeFrame !== "daily") return null;

    // Get relevant data for analysis
    const relevantData = selectedDate
      ? data.filter((item) => {
          const itemDate = new Date(item.timestamp);
          return itemDate.toDateString() === selectedDate.toDateString();
        })
      : data.slice(-30); // Last 30 days

    if (relevantData.length === 0) return null;

    // Calculate advanced liquidity metrics
    const liquidityMetrics = relevantData.map((item) => {
      // Volume-Weighted Average Price approximation
      const vwap = (item.high + item.low + item.close) / 3;

      // Liquidity Score (combination of volume and price stability)
      const priceStability = 1 - (item.high - item.low) / item.close;
      const volumeScore = Math.log(item.volume) / 20; // Normalized volume score
      const liquidityScore = (priceStability * 0.6 + volumeScore * 0.4) * 100;

      // Market Impact (how much volume affects price)
      const marketImpact =
        (item.high - item.low) / item.close / (item.volume / 1000000);

      // Bid-Ask Spread approximation (based on volatility)
      const bidAskSpread = ((item.high - item.low) / item.close) * 0.1 * 100; // Approximate spread in %

      return {
        date: new Date(item.timestamp),
        volume: item.volume,
        vwap,
        liquidityScore: Math.max(0, Math.min(100, liquidityScore)),
        marketImpact: marketImpact || 0,
        bidAskSpread: bidAskSpread || 0,
        price: item.close,
      };
    });

    // Calculate aggregate statistics
    const avgLiquidityScore =
      liquidityMetrics.reduce((sum, item) => sum + item.liquidityScore, 0) /
      liquidityMetrics.length;
    const avgMarketImpact =
      liquidityMetrics.reduce((sum, item) => sum + item.marketImpact, 0) /
      liquidityMetrics.length;
    const avgBidAskSpread =
      liquidityMetrics.reduce((sum, item) => sum + item.bidAskSpread, 0) /
      liquidityMetrics.length;
    const totalVolume = liquidityMetrics.reduce(
      (sum, item) => sum + item.volume,
      0
    );

    // Liquidity quality assessment
    const highLiquidityDays = liquidityMetrics.filter(
      (item) => item.liquidityScore > avgLiquidityScore * 1.2
    ).length;
    const lowLiquidityDays = liquidityMetrics.filter(
      (item) => item.liquidityScore < avgLiquidityScore * 0.8
    ).length;

    // Volume distribution analysis
    const volumeDistribution = {
      high: liquidityMetrics.filter(
        (item) => item.volume > (totalVolume / liquidityMetrics.length) * 1.5
      ).length,
      medium: liquidityMetrics.filter(
        (item) =>
          item.volume <= (totalVolume / liquidityMetrics.length) * 1.5 &&
          item.volume >= (totalVolume / liquidityMetrics.length) * 0.5
      ).length,
      low: liquidityMetrics.filter(
        (item) => item.volume < (totalVolume / liquidityMetrics.length) * 0.5
      ).length,
    };

    return {
      metrics: liquidityMetrics,
      statistics: {
        avgLiquidityScore: avgLiquidityScore.toFixed(1),
        avgMarketImpact: avgMarketImpact.toFixed(4),
        avgBidAskSpread: avgBidAskSpread.toFixed(3),
        totalVolume: totalVolume,
      },
      quality: {
        highLiquidityDays,
        lowLiquidityDays,
        liquidityTrend:
          liquidityMetrics.length > 1
            ? liquidityMetrics[liquidityMetrics.length - 1].liquidityScore >
              liquidityMetrics[0].liquidityScore
              ? "improving"
              : "declining"
            : "stable",
      },
      volumeDistribution,
    };
  }, [data, selectedDate, timeFrame]);

  if (!liquidityAnalysis) {
    return (
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Droplets className="h-4 w-4 text-blue-600" />
          <h3 className="font-semibold text-sm">Advanced Liquidity Metrics</h3>
        </div>
        <p className="text-xs text-gray-500">
          Select a date in daily view to see advanced liquidity analysis
        </p>
      </Card>
    );
  }

  const { statistics, quality, volumeDistribution } = liquidityAnalysis;

  const formatVolume = (volume) => {
    if (volume >= 1000000000) return `${(volume / 1000000000).toFixed(1)}B`;
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  return (
    <Card className="p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Droplets className="h-4 w-4 text-blue-600" />
        <h3 className="font-semibold text-sm">Advanced Liquidity Metrics</h3>
      </div>

      <div className="space-y-3">
        {/* Core Liquidity Metrics */}
        <div className="grid grid-cols-1 gap-2">
          <div className="bg-blue-50 p-2 rounded">
            <div className="text-xs text-blue-700 font-medium">
              Liquidity Score
            </div>
            <div className="text-sm font-bold text-blue-800">
              {statistics.avgLiquidityScore}/100
            </div>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <div className="text-xs text-green-700 font-medium">
              Market Impact
            </div>
            <div className="text-sm font-bold text-green-800">
              {statistics.avgMarketImpact}
            </div>
          </div>
          <div className="bg-purple-50 p-2 rounded">
            <div className="text-xs text-purple-700 font-medium">
              Avg Bid-Ask Spread
            </div>
            <div className="text-sm font-bold text-purple-800">
              {statistics.avgBidAskSpread}%
            </div>
          </div>
        </div>

        {/* Liquidity Quality Assessment */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">
            Liquidity Quality
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">High Liquidity Days:</span>
            <span className="font-medium text-green-600">
              {quality.highLiquidityDays}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Low Liquidity Days:</span>
            <span className="font-medium text-red-600">
              {quality.lowLiquidityDays}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Trend:</span>
            <div className="flex items-center space-x-1">
              <TrendingUp
                className={`h-3 w-3 ${
                  quality.liquidityTrend === "improving"
                    ? "text-green-500"
                    : quality.liquidityTrend === "declining"
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              />
              <span
                className={`font-medium capitalize ${
                  quality.liquidityTrend === "improving"
                    ? "text-green-600"
                    : quality.liquidityTrend === "declining"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {quality.liquidityTrend}
              </span>
            </div>
          </div>
        </div>

        {/* Volume Distribution */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">
            Volume Distribution
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">High Volume Days:</span>
              <span className="font-medium text-blue-600">
                {volumeDistribution.high}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Medium Volume Days:</span>
              <span className="font-medium text-yellow-600">
                {volumeDistribution.medium}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Low Volume Days:</span>
              <span className="font-medium text-red-600">
                {volumeDistribution.low}
              </span>
            </div>
          </div>
        </div>

        {/* Total Volume */}
        <div className="bg-gray-50 p-2 rounded">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Volume2 className="h-3 w-3 text-gray-600" />
              <span className="text-xs text-gray-600">Total Volume:</span>
            </div>
            <span className="text-sm font-bold text-gray-800">
              {formatVolume(statistics.totalVolume)}
            </span>
          </div>
        </div>

        {/* Liquidity Score Visualization */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-700">
            Liquidity Health
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                Number.parseFloat(statistics.avgLiquidityScore) > 70
                  ? "bg-green-400"
                  : Number.parseFloat(statistics.avgLiquidityScore) > 40
                  ? "bg-yellow-400"
                  : "bg-red-400"
              }`}
              style={{ width: `${statistics.avgLiquidityScore}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Poor</span>
            <span>Excellent</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
