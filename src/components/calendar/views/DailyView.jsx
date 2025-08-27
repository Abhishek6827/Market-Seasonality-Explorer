"use client";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";
import ErrorBoundary from "../../ErrorBoundary";
import { CalendarHeader } from "../CalendarHeader";
import CalendarGrid from "../CalendarGrid";
import { ComparisonModeInfo } from "../ComparisonModeInfo";

export function DailyView({
  data = [],
  currentDate,
  setCurrentDate,
  selectedDate,
  selectedDates = [],
  onCellClick,
  onCellHover,
  onCellLeave,
  onCellFocus,
  onCellKeyDown,
  getDataForDate,
  isDateSelected,
  isDateFocused,
  handlePrevious,
  handleNext,
  handleToday,
  loading = false,
  zoomLevel = "normal",
  currentTheme,
  isMobile = false,
  isTablet = false,
  timeFrame,
  filters,
  hoveredDate,
  focusedDate,
  isComparisonMode,
}) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        <CalendarHeader
          currentDate={currentDate}
          timeFrame={timeFrame}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onToday={handleToday}
        />

        <ComparisonModeInfo
          isComparisonMode={isComparisonMode}
          selectedDates={selectedDates}
        />

        <CalendarGrid
          days={days}
          data={data}
          timeFrame={timeFrame}
          filters={filters}
          selectedDate={selectedDate}
          selectedDates={selectedDates}
          hoveredDate={hoveredDate}
          focusedDate={focusedDate}
          currentDate={currentDate}
          onCellClick={onCellClick}
          onCellHover={onCellHover}
          onCellLeave={onCellLeave}
          onCellFocus={onCellFocus}
          onCellKeyDown={onCellKeyDown}
          loading={loading}
          zoomLevel={zoomLevel}
          isComparisonMode={isComparisonMode}
          getDataForDate={getDataForDate}
          isDateSelected={isDateSelected}
          isDateFocused={isDateFocused}
          currentTheme={currentTheme}
        />

        <div className="text-xs text-center text-muted-foreground bg-gray-50 p-2 rounded">
          ⌨️ <strong>Keyboard shortcuts:</strong>
          <span className="mx-2">←→ Navigate days</span>
          <span className="mx-2">↑↓ Navigate weeks</span>
          <span className="mx-2">Home: Go to today</span>
          <span className="mx-2">Escape: Clear selection</span>
          <span className="mx-2">Enter/Space: Select date</span>
        </div>
      </div>
    </ErrorBoundary>
  );
}
