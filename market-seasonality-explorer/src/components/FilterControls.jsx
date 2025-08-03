"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import ErrorBoundary from "./ErrorBoundary";

export function FilterControls({ filters, onFiltersChange, loading }) {
  const handleSymbolChange = (symbol) => {
    onFiltersChange({ ...filters, symbol });
  };

  const handleToggle = (key) => {
    onFiltersChange({ ...filters, [key]: !filters[key] });
  };

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Market Filters</h3>
          {loading && <div className="text-xs text-gray-500">Loading...</div>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Symbol Selection */}
          <div className="space-y-2">
            <Label htmlFor="symbol-select" className="text-sm font-medium">
              Trading Pair
            </Label>
            <Select value={filters.symbol} onValueChange={handleSymbolChange}>
              <SelectTrigger id="symbol-select" className="w-full">
                <SelectValue placeholder="Select symbol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTCUSDT">BTC/USDT</SelectItem>
                <SelectItem value="ETHUSDT">ETH/USDT</SelectItem>
                <SelectItem value="ADAUSDT">ADA/USDT</SelectItem>
                <SelectItem value="DOTUSDT">DOT/USDT</SelectItem>
                <SelectItem value="LINKUSDT">LINK/USDT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Volatility Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="volatility-toggle"
              checked={filters.showVolatility}
              onCheckedChange={() => handleToggle("showVolatility")}
            />
            <Label htmlFor="volatility-toggle" className="text-sm">
              Show Volatility
            </Label>
          </div>

          {/* Liquidity Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="liquidity-toggle"
              checked={filters.showLiquidity}
              onCheckedChange={() => handleToggle("showLiquidity")}
            />
            <Label htmlFor="liquidity-toggle" className="text-sm">
              Show Liquidity
            </Label>
          </div>

          {/* Performance Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="performance-toggle"
              checked={filters.showPerformance}
              onCheckedChange={() => handleToggle("showPerformance")}
            />
            <Label htmlFor="performance-toggle" className="text-sm">
              Show Performance
            </Label>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
