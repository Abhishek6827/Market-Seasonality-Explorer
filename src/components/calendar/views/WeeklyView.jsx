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
import { CalendarHeader } from "../CalendarHeader";

export function WeeklyView({
  data,
  timeFrame,
  filters,
  selectedDate,
  selectedDates,
  hoveredDate,
  focusedDate,
  onCellClick,
  onCellHover,
  onCellLeave,
  onCellFocus,
  onCellKeyDown,
  loading,
  zoomLevel,
  isComparisonMode,
  getDataForDate,
  isDateSelected,
  isDateFocused,
  currentDate,
  handlePrevious,
  handleNext,
  handleToday,
  currentTheme, // ENSURE currentTheme is passed through
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

  // Enhanced data generation with proper change calculation
  const getWeeklyData = (weekStart) => {
    if (isFuture(weekStart)) {
      return null;
    }

    const existingData = data.find((item) => {
      if (!item?.timestamp) return false;
      try {
        const itemDate = new Date(item.timestamp);
        const itemWeekStart = startOfWeek(itemDate);
        return itemWeekStart.getTime() === weekStart.getTime();
      } catch {
        return false;
      }
    });

    if (existingData && existingData.close) {
      // ENSURE existing data has change property
      if (
        existingData.change === undefined &&
        existingData.open &&
        existingData.close
      ) {
        existingData.change = existingData.close - existingData.open;
        existingData.priceChange = existingData.change;
        existingData.priceChangePercent =
          (existingData.change / existingData.open) * 100;
      }
      return existingData;
    }

    // Generate realistic weekly data
    const weekNumber = Number.parseInt(format(weekStart, "w"));
    const monthNumber = weekStart.getMonth() + 1;
    const yearNumber = weekStart.getFullYear();

    const basePrice =
      45000 +
      (yearNumber - 2020) * 5000 +
      monthNumber * 1000 +
      weekNumber * 100 +
      Math.sin(weekNumber / 10) * 5000;
    const volatility = Math.max(
      0.005,
      0.02 + (Math.sin(weekNumber / 10) + 1) * 0.03
    );
    const volume = Math.max(10000, 50000 + Math.random() * 100000);

    const open = Math.max(1, basePrice * (0.98 + Math.random() * 0.04));
    const close = Math.max(1, basePrice * (0.98 + Math.random() * 0.04));
    const high = Math.max(open, close) * (1.01 + Math.random() * 0.04);
    const low = Math.min(open, close) * (0.96 + Math.random() * 0.04);

    // Calculate change properly
    const priceChange = close - open;
    const priceChangePercent = (priceChange / open) * 100;

    return {
      timestamp: weekStart.toISOString(),
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.round(volume),
      volatility: Math.round(volatility * 10000) / 10000,
      liquidity: Math.round(volume * 0.8),
      // CRITICAL: Ensure change property exists and is calculated correctly
      change: Math.round(priceChange * 100) / 100,
      priceChange: Math.round(priceChange * 100) / 100,
      priceChangePercent: Math.round(priceChangePercent * 100) / 100,
    };
  };

  return (
    <div className="space-y-4">
      <CalendarHeader
        currentDate={currentDate}
        timeFrame={timeFrame}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
      />

      <div className="text-center">
        <h3 className="text-lg font-semibold">Weekly View - {currentYear}</h3>
        <p className="text-sm text-muted-foreground">
          Each cell represents a week starting on Sunday
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-3">
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
              isFocused={isDateFocused(weekStart)}
              onClick={isFutureWeek ? undefined : onCellClick}
              onHover={
                isFutureWeek ? undefined : (e) => onCellHover(weekStart, e)
              }
              onLeave={onCellLeave}
              onFocus={onCellFocus}
              onKeyDown={onCellKeyDown}
              loading={false}
              zoomLevel={zoomLevel}
              disabled={isFutureWeek}
              tabIndex={isFutureWeek ? -1 : 0}
              currentTheme={currentTheme} // PASS currentTheme to CalendarCell
            />
          );
        })}
      </div>

      <div className="text-xs text-center text-muted-foreground bg-gray-50 p-2 rounded">
        📅 <strong>Weekly View:</strong> Each cell represents one week. Click to
        select a week for analysis.
        <br />
        <span className="text-xs">
          Showing {weeks.filter((week) => !isFuture(week)).length} weeks for{" "}
          {currentYear} | Use ←→ to navigate weeks, ↑↓ to navigate months
        </span>
      </div>
    </div>
  );
}
