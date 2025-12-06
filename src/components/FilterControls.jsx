"use client";

import { useState, useCallback } from "react";
import { Badge } from "./ui/Badge";
import { Switch } from "./ui/Switch";
import { Label } from "./ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import {
  Loader2,
  TrendingUp,
  BarChart3,
  Activity,
  Volume2,
} from "lucide-react";
import ErrorBoundary from "./ErrorBoundary";
import { Button } from "./ui/Button";

export function FilterControls({ filters, onFiltersChange, loading }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = useCallback(
    (key, value) => {
      try {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        onFiltersChange(newFilters);
      } catch (error) {
        console.error("Error changing filter:", error);
      }
    },
    [localFilters, onFiltersChange]
  );

  const handleSymbolChange = useCallback(
    (symbol) => {
      handleFilterChange("symbol", symbol);
    },
    [handleFilterChange]
  );

  const handleToggleFilter = useCallback(
    (filterKey) => {
      handleFilterChange(filterKey, !localFilters[filterKey]);
    },
    [localFilters, handleFilterChange]
  );

  const symbols = [
    {
      value: "BTCUSDT",
      label: "Bitcoin (BTC/USDT)",
      symbol: "₿",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
      value: "ETHUSDT",
      label: "Ethereum (ETH/USDT)",
      symbol: "Ξ",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      value: "ADAUSDT",
      label: "Cardano (ADA/USDT)",
      symbol: "₳",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      value: "SOLUSDT",
      label: "Solana (SOL/USDT)",
      symbol: "◎",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      value: "DOTUSDT",
      label: "Polkadot (DOT/USDT)",
      symbol: "●",
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-950/20",
    },
    {
      value: "LINKUSDT",
      label: "Chainlink (LINK/USDT)",
      symbol: "🔗",
      color: "text-blue-700",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
  ];

  return (
    <ErrorBoundary>
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <span>Filters & Controls</span>
          </h3>
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          )}
        </div>

        {/* Trading Pair */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-gray-700">
            Trading Pair
          </Label>
          <Select value={filters.symbol} onValueChange={handleSymbolChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select trading pair">
                {filters.symbol &&
                  (() => {
                    const selected = symbols.find(
                      (s) => s.value === filters.symbol
                    );
                    return (
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`text-xl font-bold ${selected?.color}`}
                        >
                          {selected?.symbol}
                        </span>
                        <span className="font-semibold">{selected?.label}</span>
                      </div>
                    );
                  })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {symbols.map((symbol) => (
                <SelectItem key={symbol.value} value={symbol.value}>
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-lg ${symbol.bgColor}`}
                    >
                      <span className={`text-xl font-bold ${symbol.color}`}>
                        {symbol.symbol}
                      </span>
                    </div>
                    <span className="font-semibold">{symbol.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Data Layers - Horizontal Cards */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-gray-700">
            Data Layers
          </Label>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-800/30 hover:bg-orange-100/50 transition-colors">
              <div className="flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-orange-600" />
                <Label
                  htmlFor="volatility"
                  className="text-xs font-semibold cursor-pointer"
                >
                  Volatility
                </Label>
              </div>
              <Switch
                id="volatility"
                checked={filters.showVolatility}
                onCheckedChange={() => handleToggleFilter("showVolatility")}
              />
            </div>

            <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30 hover:bg-blue-100/50 transition-colors">
              <div className="flex items-center gap-1.5">
                <Volume2 className="h-4 w-4 text-blue-600" />
                <Label
                  htmlFor="liquidity"
                  className="text-xs font-semibold cursor-pointer"
                >
                  Liquidity
                </Label>
              </div>
              <Switch
                id="liquidity"
                checked={filters.showLiquidity}
                onCheckedChange={() => handleToggleFilter("showLiquidity")}
              />
            </div>

            <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-800/30 hover:bg-green-100/50 transition-colors">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <Label
                  htmlFor="performance"
                  className="text-xs font-semibold cursor-pointer"
                >
                  Performance
                </Label>
              </div>
              <Switch
                id="performance"
                checked={filters.showPerformance}
                onCheckedChange={() => handleToggleFilter("showPerformance")}
              />
            </div>
          </div>
        </div>

        {/* Active Filters Summary - Horizontal */}
        <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
          <Label className="text-xs font-semibold">Active:</Label>
          <Badge variant="secondary" className="text-xs">
            {filters.symbol}
          </Badge>
          {filters.showVolatility && (
            <Badge variant="outline" className="text-xs">
              Volatility
            </Badge>
          )}
          {filters.showLiquidity && (
            <Badge variant="outline" className="text-xs">
              Liquidity
            </Badge>
          )}
          {filters.showPerformance && (
            <Badge variant="outline" className="text-xs">
              Performance
            </Badge>
          )}
          <span className="text-xs text-muted-foreground ml-auto">
            Data: {loading ? "Loading..." : "Available"}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              handleFilterChange("showVolatility", true);
              handleFilterChange("showLiquidity", true);
              handleFilterChange("showPerformance", true);
            }}
            className="text-xs flex-1 h-8"
          >
            Show All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              handleFilterChange("showVolatility", false);
              handleFilterChange("showLiquidity", false);
              handleFilterChange("showPerformance", false);
            }}
            className="text-xs flex-1 h-8"
          >
            Hide All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              handleFilterChange("symbol", "BTCUSDT");
              handleFilterChange("showVolatility", true);
              handleFilterChange("showLiquidity", true);
              handleFilterChange("showPerformance", true);
            }}
            className="text-xs flex-1 h-8"
          >
            Reset
          </Button>
        </div>
      </div>
    </ErrorBoundary>
  );
}
