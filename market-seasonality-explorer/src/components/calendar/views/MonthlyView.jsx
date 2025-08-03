"use client";

import {
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  format,
  isFuture,
  startOfMonth,
} from "date-fns";
import { CalendarCell } from "../../CalendarCell";
import { CalendarHeader } from "../CalendarHeader";

export function MonthlyView({
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
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  const isMonthToday = (monthStart) => {
    const today = new Date();
    const currentMonthStart = startOfMonth(today);
    return monthStart.getTime() === currentMonthStart.getTime();
  };

  // Enhanced data generation for monthly view - Fixed to prevent future data
  const getMonthlyData = (monthStart) => {
    // Don't generate data for future months
    if (isFuture(monthStart)) {
      return null;
    }

    // First try to get existing data from the data prop
    const existingData = getDataForDate(monthStart);
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

    // Generate enhanced monthly data with proper date handling
    const monthNumber = monthStart.getMonth() + 1;
    const yearNumber = monthStart.getFullYear();

    // Create more realistic base price calculation
    const basePrice =
      45000 +
      (yearNumber - 2020) * 5000 +
      monthNumber * 2000 +
      Math.sin((monthNumber / 12) * 2 * Math.PI) * 8000;

    // Generate realistic volatility and volume for monthly data
    const volatility = Math.max(
      0.01,
      0.03 + (Math.sin(monthNumber / 6) + 1) * 0.04
    );
    const volume = Math.max(50000, 200000 + Math.random() * 500000);

    // Create realistic OHLC data
    const open = Math.max(1, basePrice * (0.95 + Math.random() * 0.1));
    const close = Math.max(1, basePrice * (0.95 + Math.random() * 0.1));
    const high = Math.max(open, close) * (1.02 + Math.random() * 0.08);
    const low = Math.min(open, close) * (0.92 + Math.random() * 0.08);

    // Calculate change properly
    const priceChange = close - open;
    const priceChangePercent = (priceChange / open) * 100;

    return {
      timestamp: monthStart.toISOString(),
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.round(volume),
      volatility: Math.round(volatility * 10000) / 10000,
      liquidity: Math.round(volume * 0.9),
      // Add the change property that CalendarCell expects
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
        <h3 className="text-lg font-semibold">Monthly View - {currentYear}</h3>
        <p className="text-sm text-muted-foreground">
          Each cell represents a month
        </p>
      </div>

      {/* Use a responsive grid that works well for 12 months */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {months.map((monthStart, index) => {
          const cellData = getMonthlyData(monthStart);
          const isFutureMonth = isFuture(monthStart);

          return (
            <CalendarCell
              key={format(monthStart, "yyyy-MM")}
              date={monthStart}
              data={cellData}
              timeFrame={timeFrame}
              filters={filters}
              isSelected={isDateSelected(monthStart)}
              isInRange={false}
              isCurrentMonth={true} // Always true for monthly view
              isToday={isMonthToday(monthStart)}
              isHovered={
                hoveredDate && hoveredDate.getTime() === monthStart.getTime()
              }
              isFocused={isDateFocused(monthStart)}
              onClick={isFutureMonth ? undefined : onCellClick}
              onHover={
                isFutureMonth ? undefined : (e) => onCellHover(monthStart, e)
              }
              onLeave={onCellLeave}
              onFocus={onCellFocus}
              onKeyDown={onCellKeyDown}
              loading={false} // Always false since we generate data synchronously
              zoomLevel={zoomLevel}
              disabled={isFutureMonth}
              tabIndex={isFutureMonth ? -1 : 0}
              currentTheme={currentTheme} // PASS currentTheme to CalendarCell
            />
          );
        })}
      </div>

      <div className="text-xs text-center text-muted-foreground bg-gray-50 p-2 rounded">
        📅 <strong>Monthly View:</strong> Each cell represents one month. Click
        to select a month for analysis.
        <br />
        <span className="text-xs">
          Showing {months.filter((month) => !isFuture(month)).length} months for{" "}
          {currentYear} | Use ←→ to navigate years
        </span>
      </div>
    </div>
  );
}
