"use client";
import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  BarChart3,
  LineChart,
  Calendar,
} from "lucide-react";
import ErrorBoundary from "./ErrorBoundary";

export function EnhancedDataDashboard({
  data,
  selectedDate,
  selectedDates,
  timeFrame,
  symbol,
  loading,
  error,
  isComparisonMode,
}) {
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate analytics for selected data
  const analytics = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        overview: { price: 0, change: 0, volume: 0, volatility: 0 },
        technical: {
          rsi: 0,
          macd: 0,
          bollinger: { upper: 0, lower: 0, middle: 0 },
        },
        volume: { total: 0, average: 0, trend: "neutral" },
        performance: { returns: 0, sharpe: 0, maxDrawdown: 0 },
      };
    }

    let selectedData = [];

    if (isComparisonMode && selectedDates.length > 0) {
      selectedData = data.filter((item) => {
        const itemDate = new Date(item.timestamp);
        return selectedDates.some(
          (date) => itemDate.toDateString() === date.toDateString()
        );
      });
    } else if (selectedDate) {
      selectedData = data.filter((item) => {
        const itemDate = new Date(item.timestamp);
        return itemDate.toDateString() === selectedDate.toDateString();
      });
    } else {
      selectedData = data.slice(-30); // Last 30 data points
    }

    if (selectedData.length === 0) {
      return {
        overview: { price: 0, change: 0, volume: 0, volatility: 0 },
        technical: {
          rsi: 0,
          macd: 0,
          bollinger: { upper: 0, lower: 0, middle: 0 },
        },
        volume: { total: 0, average: 0, trend: "neutral" },
        performance: { returns: 0, sharpe: 0, maxDrawdown: 0 },
      };
    }

    const latestData = selectedData[selectedData.length - 1];
    const prices = selectedData.map((d) => d.price || 0);
    const volumes = selectedData.map((d) => d.volume || 0);

    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    const totalVolume = volumes.reduce((a, b) => a + b, 0);

    // Calculate volatility
    const priceVariance =
      prices.reduce((acc, price) => acc + Math.pow(price - avgPrice, 2), 0) /
      prices.length;
    const volatility = (Math.sqrt(priceVariance) / avgPrice) * 100;

    // Calculate returns
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const returns =
      firstPrice > 0 ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0;

    return {
      overview: {
        price: latestData?.price || 0,
        change: latestData?.change || 0,
        volume: latestData?.volume || 0,
        volatility: volatility,
      },
      technical: {
        rsi: Math.random() * 100, // Mock RSI
        macd: Math.random() * 2 - 1, // Mock MACD
        bollinger: {
          upper: avgPrice * 1.02,
          lower: avgPrice * 0.98,
          middle: avgPrice,
        },
      },
      volume: {
        total: totalVolume,
        average: avgVolume,
        trend: avgVolume > totalVolume / selectedData.length ? "up" : "down",
      },
      performance: {
        returns: returns,
        sharpe: returns / (volatility || 1), // Simplified Sharpe ratio
        maxDrawdown: Math.min(
          ...prices.map((price, i) =>
            i === 0 ? 0 : ((price - prices[i - 1]) / prices[i - 1]) * 100
          )
        ),
      },
    };
  }, [data, selectedDate, selectedDates, isComparisonMode]);

  if (loading) {
    return (
      <div className="w-full max-w-sm mx-auto">
        <div className="animate-pulse space-y-3">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-sm mx-auto p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600">Error loading data</p>
      </div>
    );
  }

  const formatNumber = (num) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toFixed(2);
  };

  const formatPercent = (num) => {
    return `${num >= 0 ? "+" : ""}${num.toFixed(2)}%`;
  };

  const tabs = isComparisonMode
    ? [
        { id: "comparison", label: "Compare", icon: BarChart3 },
        { id: "overview", label: "Overview", icon: Activity },
        { id: "performance", label: "Performance", icon: TrendingUp },
      ]
    : [
        { id: "overview", label: "Overview", icon: Activity },
        { id: "technical", label: "Technical", icon: LineChart },
        { id: "volume", label: "Volume", icon: BarChart3 },
        { id: "performance", label: "Performance", icon: TrendingUp },
      ];

  return (
    <ErrorBoundary>
      <div className="w-full max-w-sm mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-1 h-auto p-1 bg-gray-50">
            {tabs.slice(0, 2).map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center justify-center space-x-1 text-[10px] px-2 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-sm"
                >
                  <Icon className="h-3 w-3" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {tabs.length > 2 && (
            <TabsList className="grid w-full grid-cols-2 gap-1 h-auto p-1 bg-gray-50 mt-1">
              {tabs.slice(2).map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center justify-center space-x-1 text-[10px] px-2 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-sm"
                  >
                    <Icon className="h-3 w-3" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          )}

          <div className="mt-3 max-h-80 overflow-y-auto">
            <TabsContent value="overview" className="mt-0 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Card className="p-2">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-600">Price</p>
                      <p className="text-sm font-semibold">
                        ${formatNumber(analytics.overview.price)}
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="p-2">
                  <div className="flex items-center space-x-2">
                    {analytics.overview.change >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <div>
                      <p className="text-xs text-gray-600">Change</p>
                      <p
                        className={`text-sm font-semibold ${
                          analytics.overview.change >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatPercent(analytics.overview.change)}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Volume</span>
                    <span className="text-sm font-medium">
                      {formatNumber(analytics.overview.volume)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Volatility</span>
                    <span className="text-sm font-medium">
                      {analytics.overview.volatility.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="technical" className="mt-0 space-y-3">
              <Card className="p-3">
                <h4 className="text-sm font-medium mb-2">
                  Technical Indicators
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">RSI</span>
                    <span className="text-sm font-medium">
                      {analytics.technical.rsi.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">MACD</span>
                    <span
                      className={`text-sm font-medium ${
                        analytics.technical.macd >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {analytics.technical.macd.toFixed(3)}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-3">
                <h4 className="text-sm font-medium mb-2">Bollinger Bands</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Upper</span>
                    <span>
                      ${analytics.technical.bollinger.upper.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Middle</span>
                    <span>
                      ${analytics.technical.bollinger.middle.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Lower</span>
                    <span>
                      ${analytics.technical.bollinger.lower.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="volume" className="mt-0 space-y-3">
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Volume Analysis</h4>
                  <div
                    className={`px-2 py-1 rounded-full text-xs ${
                      analytics.volume.trend === "up"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {analytics.volume.trend === "up" ? "↗" : "↘"}{" "}
                    {analytics.volume.trend}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Total Volume</span>
                    <span className="text-sm font-medium">
                      {formatNumber(analytics.volume.total)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Average</span>
                    <span className="text-sm font-medium">
                      {formatNumber(analytics.volume.average)}
                    </span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="mt-0 space-y-3">
              <Card className="p-3">
                <h4 className="text-sm font-medium mb-2">
                  Performance Metrics
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Returns</span>
                    <span
                      className={`text-sm font-medium ${
                        analytics.performance.returns >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatPercent(analytics.performance.returns)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Sharpe Ratio</span>
                    <span className="text-sm font-medium">
                      {analytics.performance.sharpe.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Max Drawdown</span>
                    <span className="text-sm font-medium text-red-600">
                      {formatPercent(analytics.performance.maxDrawdown)}
                    </span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="comparison" className="mt-0 space-y-3">
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Date Comparison</h4>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-500">
                      {selectedDates.length} dates
                    </span>
                  </div>
                </div>
                {selectedDates.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDates.slice(0, 3).map((date, index) => {
                      const dateData = data.find(
                        (item) =>
                          new Date(item.timestamp).toDateString() ===
                          date.toDateString()
                      );
                      return (
                        <div
                          key={index}
                          className="flex justify-between items-center text-xs"
                        >
                          <span className="text-gray-600">
                            {date.toLocaleDateString()}
                          </span>
                          <span className="font-medium">
                            ${dateData?.price?.toFixed(2) || "N/A"}
                          </span>
                        </div>
                      );
                    })}
                    {selectedDates.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{selectedDates.length - 3} more dates
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    Select dates to compare
                  </p>
                )}
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
}
