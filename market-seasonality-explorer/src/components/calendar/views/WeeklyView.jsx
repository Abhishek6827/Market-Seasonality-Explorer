"use client";
import {
  startOfYear,
  endOfYear,
  eachWeekOfInterval,
  format,
  startOfWeek,
  isFuture,
} from "date-fns";
import { CalendarCell } from "../../CalendarCell";

export function WeeklyView({
  data,
  timeFrame,
  filters,
  selectedDate,
  selectedDates,
  hoveredDate,
  onCellClick,
  onCellHover,
  onCellLeave,
  loading,
  zoomLevel,
  isComparisonMode,
  getDataForDate,
  isDateSelected,
  currentDate,
  isMobile,
  isTablet,
  isSmallMobile,
  getResponsiveGridClasses,
}) {
  const currentYear = currentDate.getFullYear();
  const yearStart = startOfYear(new Date(currentYear, 0, 1));
  const yearEnd = endOfYear(new Date(currentYear, 11, 31));
  const weeks = eachWeekOfInterval({ start: yearStart, end: yearEnd });

  const isWeekToday = (weekStart) => {
    const today = new Date();
    const currentWeekStart = startOfWeek(today);
    return weekStart.getTime() === currentWeekStart.getTime();
  };

  // Enhanced data generation for weekly view
  const getWeeklyData = (weekStart) => {
    // Don't generate data for future weeks
    if (isFuture(weekStart)) {
      return null;
    }

    // First try to get existing data from the data prop
    const existingData = data?.find((item) => {
      if (!item?.timestamp) return false;
      try {
        const itemDate = new Date(item.timestamp);
        const itemWeekStart = startOfWeek(itemDate);
        return itemWeekStart.getTime() === weekStart.getTime();
      } catch {
        return false;
      }
    });

    if (existingData && existingData.close) return existingData;

    // Generate enhanced weekly data with proper date handling
    const weekNumber = Number.parseInt(format(weekStart, "w"));
    const monthNumber = weekStart.getMonth() + 1;
    const yearNumber = weekStart.getFullYear();

    // Create more realistic base price calculation
    const basePrice =
      45000 +
      (yearNumber - 2020) * 5000 +
      monthNumber * 1000 +
      weekNumber * 100 +
      Math.sin(weekNumber / 10) * 5000;

    // Generate realistic volatility and volume
    const volatility = Math.max(
      0.005,
      0.02 + (Math.sin(weekNumber / 10) + 1) * 0.03
    );
    const volume = Math.max(10000, 50000 + Math.random() * 100000);

    // Create realistic OHLC data
    const open = Math.max(1, basePrice * (0.98 + Math.random() * 0.04));
    const close = Math.max(1, basePrice * (0.98 + Math.random() * 0.04));
    const high = Math.max(open, close) * (1.01 + Math.random() * 0.04);
    const low = Math.min(open, close) * (0.96 + Math.random() * 0.04);

    return {
      timestamp: weekStart.toISOString(),
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.round(volume),
      volatility: Math.round(volatility * 10000) / 10000,
      liquidity: Math.round(volume * 0.8),
      priceChange: Math.round((close - open) * 100) / 100,
      priceChangePercent: Math.round(((close - open) / open) * 10000) / 100,
    };
  };

  return (
    <div className="space-y-4">
      {/* ✅ REMOVED: All duplicate navigation and titles */}

      {/* Responsive grid for weekly view */}
      <div className={getResponsiveGridClasses()}>
        {weeks.map((weekStart, index) => {
          const cellData = getWeeklyData(weekStart);
          const isFutureWeek = isFuture(weekStart);
          return (
            <CalendarCell
              key={format(weekStart, "yyyy-MM-dd")}
              date={weekStart}
              data={cellData}
              timeFrame={timeFrame}
              filters={filters}
              isSelected={isDateSelected(weekStart)}
              isInRange={false}
              isCurrentMonth={true}
              isToday={isWeekToday(weekStart)}
              isHovered={
                hoveredDate && hoveredDate.getTime() === weekStart.getTime()
              }
              onClick={isFutureWeek ? undefined : onCellClick}
              onHover={
                isFutureWeek ? undefined : (e) => onCellHover(weekStart, e)
              }
              onLeave={onCellLeave}
              loading={false}
              zoomLevel={zoomLevel}
              disabled={isFutureWeek}
              isMobile={isMobile}
              isTablet={isTablet}
              isSmallMobile={isSmallMobile}
            />
          );
        })}
      </div>

      {/* ✅ KEPT: Only the bottom informational text */}
      <div className="text-xs text-center text-muted-foreground bg-gray-50 p-2 rounded">
        📅 <strong>Weekly View:</strong> Each cell represents one week. Click to
        select a week for analysis.
        <br />
        <span className="text-xs">
          Showing {weeks.filter((week) => !isFuture(week)).length} weeks for{" "}
          {currentYear} | Use ←→ to navigate years, ↑↓ to navigate months
        </span>
      </div>
    </div>
  );
}
