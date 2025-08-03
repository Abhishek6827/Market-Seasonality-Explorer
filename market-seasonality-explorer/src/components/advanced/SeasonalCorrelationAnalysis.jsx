"use client";

import { useMemo } from "react";
import { Card } from "../ui/card";
import { TrendingUp, Activity, Zap } from "lucide-react";
import { getMonth } from "date-fns";

export function SeasonalCorrelationAnalysis({ data, timeFrame }) {
  const correlationAnalysis = useMemo(() => {
    if (!data || data.length === 0 || timeFrame !== "monthly") return null;

    // Calculate correlations between different metrics across seasons
    const seasonalData = {
      spring: { months: [2, 3, 4], data: [] },
      summer: { months: [5, 6, 7], data: [] },
      autumn: { months: [8, 9, 10], data: [] },
      winter: { months: [11, 0, 1], data: [] },
    };

    // Group data by seasons
    data.forEach((item) => {
      const month = getMonth(new Date(item.timestamp));
      Object.keys(seasonalData).forEach((season) => {
        if (seasonalData[season].months.includes(month)) {
          seasonalData[season].data.push(item);
        }
      });
    });

    // Calculate correlation metrics for each season
    const seasonalMetrics = {};
    Object.keys(seasonalData).forEach((season) => {
      const seasonData = seasonalData[season].data;
      if (seasonData.length > 1) {
        // Calculate various metrics
        const prices = seasonData.map((item) => item.close);
        const volumes = seasonData.map((item) => item.volume || 0);
        const volatilities = seasonData.map((item) => item.volatility || 0);

        // Price-Volume Correlation
        const priceVolumeCorr = calculateCorrelation(prices, volumes);

        // Price-Volatility Correlation
        const priceVolatilityCorr = calculateCorrelation(prices, volatilities);

        // Volume-Volatility Correlation
        const volumeVolatilityCorr = calculateCorrelation(
          volumes,
          volatilities
        );

        // Seasonal strength (how much metrics deviate from annual average)
        const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
        const avgVolume =
          volumes.reduce((sum, v) => sum + v, 0) / volumes.length;
        const avgVolatility =
          volatilities.reduce((sum, v) => sum + v, 0) / volatilities.length;

        seasonalMetrics[season] = {
          priceVolumeCorr,
          priceVolatilityCorr,
          volumeVolatilityCorr,
          avgPrice,
          avgVolume,
          avgVolatility,
          dataPoints: seasonData.length,
          seasonalStrength:
            Math.abs(priceVolumeCorr) +
            Math.abs(priceVolatilityCorr) +
            Math.abs(volumeVolatilityCorr),
        };
      }
    });

    // Calculate annual averages for comparison
    const allPrices = data.map((item) => item.close);
    const allVolumes = data.map((item) => item.volume || 0);
    const allVolatilities = data.map((item) => item.volatility || 0);

    const annualAvgPrice =
      allPrices.reduce((sum, p) => sum + p, 0) / allPrices.length;
    const annualAvgVolume =
      allVolumes.reduce((sum, v) => sum + v, 0) / allVolumes.length;
    const annualAvgVolatility =
      allVolatilities.reduce((sum, v) => sum + v, 0) / allVolatilities.length;

    // Find strongest correlations
    const seasonalCorrelations = Object.entries(seasonalMetrics).map(
      ([season, metrics]) => ({
        season,
        ...metrics,
      })
    );

    const strongestPriceVolumeCorr = seasonalCorrelations.reduce(
      (strongest, season) =>
        Math.abs(season.priceVolumeCorr) > Math.abs(strongest.priceVolumeCorr)
          ? season
          : strongest,
      { season: "", priceVolumeCorr: 0 }
    );

    const strongestSeasonalEffect = seasonalCorrelations.reduce(
      (strongest, season) =>
        season.seasonalStrength > strongest.seasonalStrength
          ? season
          : strongest,
      { season: "", seasonalStrength: 0 }
    );

    // Market regime analysis
    const marketRegimes = {
      bullish: seasonalCorrelations.filter(
        (s) => s.avgPrice > annualAvgPrice * 1.05
      ),
      bearish: seasonalCorrelations.filter(
        (s) => s.avgPrice < annualAvgPrice * 0.95
      ),
      neutral: seasonalCorrelations.filter(
        (s) =>
          s.avgPrice >= annualAvgPrice * 0.95 &&
          s.avgPrice <= annualAvgPrice * 1.05
      ),
    };

    return {
      seasonalMetrics,
      correlations: {
        strongestPriceVolumeCorr,
        strongestSeasonalEffect,
      },
      annualAverages: {
        price: annualAvgPrice,
        volume: annualAvgVolume,
        volatility: annualAvgVolatility,
      },
      marketRegimes,
      seasonalCorrelations,
    };
  }, [data, timeFrame]);

  // Helper function to calculate correlation coefficient
  function calculateCorrelation(x, y) {
    if (x.length !== y.length || x.length < 2) return 0;

    const n = x.length;
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);
    const sumYY = y.reduce((sum, val) => sum + val * val, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY)
    );

    return denominator === 0 ? 0 : numerator / denominator;
  }

  if (!correlationAnalysis) {
    return (
      <Card className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Zap className="h-4 w-4 text-purple-600" />
          <h3 className="font-semibold text-sm">
            Seasonal Correlation Analysis
          </h3>
        </div>
        <p className="text-xs text-gray-500">
          Switch to monthly view to see seasonal correlation analysis
        </p>
      </Card>
    );
  }

  const {
    seasonalMetrics,
    correlations,
    annualAverages,
    marketRegimes,
    seasonalCorrelations,
  } = correlationAnalysis;

  const formatCorrelation = (corr) => {
    const absCorr = Math.abs(corr);
    const strength =
      absCorr > 0.7 ? "Strong" : absCorr > 0.4 ? "Moderate" : "Weak";
    const direction = corr > 0 ? "Positive" : "Negative";
    return `${strength} ${direction} (${corr.toFixed(2)})`;
  };

  const formatPrice = (price) => `$${price.toFixed(0)}`;
  const formatVolume = (volume) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return Math.round(volume).toString();
  };

  return (
    <Card className="p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Zap className="h-4 w-4 text-purple-600" />
        <h3 className="font-semibold text-sm">Seasonal Correlation Analysis</h3>
      </div>

      <div className="space-y-4">
        {/* Seasonal Correlation Matrix */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">
            Seasonal Correlations
          </div>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(seasonalMetrics).map(([season, metrics]) => (
              <div key={season} className="bg-gray-50 p-2 rounded">
                <div className="text-xs font-medium text-gray-700 capitalize mb-1">
                  {season}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Price-Volume:</span>
                    <span
                      className={`font-medium ${
                        Math.abs(metrics.priceVolumeCorr) > 0.5
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {metrics.priceVolumeCorr.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Price-Volatility:</span>
                    <span
                      className={`font-medium ${
                        Math.abs(metrics.priceVolatilityCorr) > 0.5
                          ? "text-orange-600"
                          : "text-gray-600"
                      }`}
                    >
                      {metrics.priceVolatilityCorr.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Volume-Volatility:</span>
                    <span
                      className={`font-medium ${
                        Math.abs(metrics.volumeVolatilityCorr) > 0.5
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {metrics.volumeVolatilityCorr.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strongest Correlations */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">
            Key Correlation Insights
          </div>
          <div className="space-y-1">
            <div className="bg-blue-50 p-2 rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-blue-600" />
                  <span className="text-xs text-blue-700">
                    Strongest Price-Volume:
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-blue-800 capitalize">
                    {correlations.strongestPriceVolumeCorr.season}
                  </div>
                  <div className="text-xs text-blue-600">
                    {correlations.strongestPriceVolumeCorr.priceVolumeCorr.toFixed(
                      2
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-2 rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Activity className="h-3 w-3 text-purple-600" />
                  <span className="text-xs text-purple-700">
                    Strongest Seasonal Effect:
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-purple-800 capitalize">
                    {correlations.strongestSeasonalEffect.season}
                  </div>
                  <div className="text-xs text-purple-600">
                    {correlations.strongestSeasonalEffect.seasonalStrength.toFixed(
                      2
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Regime Analysis */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">
            Market Regime by Season
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-green-50 p-2 rounded text-center">
              <div className="text-xs text-green-700 font-medium">Bullish</div>
              <div className="text-sm font-bold text-green-800">
                {marketRegimes.bullish.length}
              </div>
              <div className="text-xs text-green-600">seasons</div>
            </div>
            <div className="bg-gray-50 p-2 rounded text-center">
              <div className="text-xs text-gray-700 font-medium">Neutral</div>
              <div className="text-sm font-bold text-gray-800">
                {marketRegimes.neutral.length}
              </div>
              <div className="text-xs text-gray-600">seasons</div>
            </div>
            <div className="bg-red-50 p-2 rounded text-center">
              <div className="text-xs text-red-700 font-medium">Bearish</div>
              <div className="text-sm font-bold text-red-800">
                {marketRegimes.bearish.length}
              </div>
              <div className="text-xs text-red-600">seasons</div>
            </div>
          </div>
        </div>

        {/* Annual Benchmarks */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">
            Annual Benchmarks
          </div>
          <div className="grid grid-cols-1 gap-1">
            <div className="flex justify-between text-xs p-1 bg-gray-50 rounded">
              <span className="text-gray-600">Average Price:</span>
              <span className="font-medium text-gray-800">
                {formatPrice(annualAverages.price)}
              </span>
            </div>
            <div className="flex justify-between text-xs p-1 bg-gray-50 rounded">
              <span className="text-gray-600">Average Volume:</span>
              <span className="font-medium text-gray-800">
                {formatVolume(annualAverages.volume)}
              </span>
            </div>
            <div className="flex justify-between text-xs p-1 bg-gray-50 rounded">
              <span className="text-gray-600">Average Volatility:</span>
              <span className="font-medium text-gray-800">
                {(annualAverages.volatility * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Correlation Strength Visualization */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">
            Correlation Strength by Season
          </div>
          <div className="space-y-1">
            {seasonalCorrelations.map((season) => (
              <div
                key={season.season}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-gray-600 capitalize">
                  {season.season}:
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-400 rounded-full"
                      style={{
                        width: `${
                          (season.seasonalStrength /
                            Math.max(
                              ...seasonalCorrelations.map(
                                (s) => s.seasonalStrength
                              )
                            )) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-purple-600 font-medium">
                    {season.seasonalStrength.toFixed(1)}
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
