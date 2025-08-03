"use client";
import { format } from "date-fns";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export function CalendarCell({
  date,
  data,
  timeFrame,
  filters,
  isSelected,
  isInRange,
  isCurrentMonth,
  isToday,
  isHovered,
  onClick,
  onHover,
  onLeave,
  loading,
  zoomLevel,
  disabled,
  isMobile,
  isTablet,
  isSmallMobile,
}) {
  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return "N/A";
    // More compact formatting for mobile
    if (isMobile) {
      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
      return `$${value.toFixed(0)}`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value) => {
    if (!value || isNaN(value)) return "0%";
    return `${(value * 100).toFixed(1)}%`;
  };

  const getDateDisplay = () => {
    if (timeFrame === "weekly") {
      return isMobile ? format(date, "M/d") : format(date, "MMM dd");
    } else if (timeFrame === "monthly") {
      return isMobile ? format(date, "MMM") : format(date, "MMM yyyy");
    } else {
      return format(date, "d");
    }
  };

  const getCellSize = () => {
    if (isSmallMobile) {
      return timeFrame === "daily" ? "h-12 w-full" : "h-16 w-full";
    } else if (isMobile) {
      return timeFrame === "daily" ? "h-14 w-full" : "h-20 w-full";
    } else if (isTablet) {
      return timeFrame === "daily" ? "h-16 w-full" : "h-24 w-full";
    } else {
      // Desktop sizes based on zoom level
      const baseSize = timeFrame === "daily" ? 20 : 28;
      const multiplier =
        zoomLevel === "small" ? 0.8 : zoomLevel === "large" ? 1.2 : 1;
      const size = Math.round(baseSize * multiplier);
      return `h-${size} w-full`;
    }
  };

  const getTextSize = () => {
    if (isSmallMobile) return "text-xs";
    if (isMobile) return "text-sm";
    if (isTablet) return "text-sm";
    return zoomLevel === "small"
      ? "text-xs"
      : zoomLevel === "large"
      ? "text-base"
      : "text-sm";
  };

  const getPriceChangeColor = () => {
    if (!data || !data.open || !data.close) return "text-gray-600";
    const change = data.close - data.open;
    return change >= 0 ? "text-green-600" : "text-red-600";
  };

  const getPriceChangeIcon = () => {
    if (!data || !data.open || !data.close) return null;
    const change = data.close - data.open;
    const IconComponent = change >= 0 ? TrendingUp : TrendingDown;
    return <IconComponent className={`h-3 w-3 ${isMobile ? "h-2 w-2" : ""}`} />;
  };

  // ✅ Fixed: Theme-aware background colors using data attributes
  const getBackgroundColor = () => {
    if (disabled) return "bg-gray-100";
    if (isSelected) return "bg-blue-600 text-white";
    if (isToday) return "bg-blue-100 border-blue-300";
    if (isHovered && !isMobile) return "bg-gray-100";
    if (!isCurrentMonth && timeFrame === "daily")
      return "bg-gray-50 text-gray-400";

    // ✅ Theme-aware data-based coloring using CSS data attributes
    if (data && data.close && data.open) {
      const change = ((data.close - data.open) / data.open) * 100;
      if (Math.abs(change) < 0.5) return "bg-gray-50";

      // Use data attributes for theme-aware coloring
      const root = document.documentElement;
      const colorScheme = root.getAttribute("data-color-scheme") || "default";

      if (change >= 0) {
        // Positive colors based on theme
        switch (colorScheme) {
          case "colorblind":
            return "bg-blue-50 border-blue-200";
          case "highContrast":
            return "bg-green-200 border-green-600";
          case "monochrome":
            return "bg-gray-100 border-gray-400";
          default:
            return "bg-green-50 border-green-200";
        }
      } else {
        // Negative colors based on theme
        switch (colorScheme) {
          case "colorblind":
            return "bg-orange-50 border-orange-200";
          case "highContrast":
            return "bg-red-200 border-red-600";
          case "monochrome":
            return "bg-gray-200 border-gray-500";
          default:
            return "bg-red-50 border-red-200";
        }
      }
    }
    return "bg-white";
  };

  const handleClick = (e) => {
    if (disabled || !onClick) return;
    // Prevent double-tap zoom on mobile
    e.preventDefault();
    onClick(date);
  };

  const handleMouseEnter = (e) => {
    if (isMobile || !onHover) return;
    onHover(date, e);
  };

  const handleMouseLeave = () => {
    if (isMobile || !onLeave) return;
    onLeave();
  };

  // Touch-friendly tap target size (minimum 44px)
  const tapTargetClass = isMobile ? "min-h-[44px] min-w-[44px]" : "";

  return (
    <div
      className={`
        relative border rounded-lg cursor-pointer transition-all duration-200 
        ${getCellSize()} ${getBackgroundColor()} ${tapTargetClass}
        ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "hover:shadow-md active:scale-95"
        }
        ${isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""}
        ${isMobile ? "touch-manipulation" : ""}
      `}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Date Display */}
      <div
        className={`absolute top-1 left-1 ${getTextSize()} font-medium ${
          isSelected ? "text-white" : ""
        }`}
      >
        {getDateDisplay()}
      </div>

      {/* Today Indicator */}
      {isToday && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
      )}

      {/* Data Display */}
      {data && data.close && (
        <div className="absolute inset-0 flex flex-col justify-center items-center p-1">
          {/* Price */}
          <div
            className={`${getTextSize()} font-bold ${
              isSelected ? "text-white" : "text-gray-900"
            } text-center leading-tight`}
          >
            {formatCurrency(data.close)}
          </div>

          {/* Price Change - Only show on larger screens or when selected */}
          {(!isMobile || isSelected) && data.open && (
            <div
              className={`flex items-center space-x-1 ${
                isSmallMobile ? "text-xs" : "text-xs"
              } ${isSelected ? "text-white" : getPriceChangeColor()}`}
            >
              {getPriceChangeIcon()}
              <span>
                {(((data.close - data.open) / data.open) * 100).toFixed(1)}%
              </span>
            </div>
          )}

          {/* Volatility Indicator - Only on desktop or when selected */}
          {!isMobile && data.volatility && (
            <div
              className={`flex items-center space-x-1 text-xs ${
                isSelected ? "text-white opacity-80" : "text-gray-600"
              } mt-1`}
            >
              <Activity className="h-2 w-2" />
              <span>{formatPercentage(data.volatility)}</span>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Mobile Selection Indicator */}
      {isMobile && isSelected && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      )}

      {/* Comparison Mode Indicator */}
      {isInRange && (
        <div className="absolute inset-0 bg-blue-200 opacity-30 rounded-lg" />
      )}
    </div>
  );
}
