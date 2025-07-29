"use client";

import { isSameMonth, isToday } from "date-fns";
import { CalendarCell } from "../CalendarCell";
import ErrorBoundary from "../ErrorBoundary";

export default function CalendarGrid({
  days,
  data,
  timeFrame,
  filters,
  selectedDate,
  selectedDates,
  hoveredDate,
  focusedDate,
  currentDate,
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
  currentTheme,
}) {
  return (
    <ErrorBoundary>
      <div className="space-y-2">
        {/* Days of week header - responsive */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (day, index) => (
              <div
                key={day}
                className="p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-gray-500"
              >
                <span className="hidden xs:inline">{day}</span>
                <span className="xs:hidden">{day.charAt(0)}</span>
              </div>
            )
          )}
        </div>

        {/* Calendar grid using CalendarCell components */}
        <div
          className={`grid grid-cols-7 gap-1 sm:gap-2 ${
            zoomLevel === "xlarge"
              ? "gap-1"
              : zoomLevel === "large"
              ? "gap-1.5"
              : "gap-1 sm:gap-2"
          }`}
        >
          {days.map((date, index) => {
            const dayData = getDataForDate(date);
            const isSelected = isDateSelected(date);
            const isDayToday = isToday(date);
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isHovered =
              hoveredDate && date.getTime() === hoveredDate.getTime();
            const isFocused = isDateFocused && isDateFocused(date);

            return (
              <CalendarCell
                key={`${date.getTime()}-${index}`}
                date={date}
                data={dayData}
                timeFrame={timeFrame}
                filters={filters}
                isSelected={isSelected}
                isInRange={false}
                isCurrentMonth={isCurrentMonth}
                isToday={isDayToday}
                isHovered={isHovered}
                isFocused={isFocused}
                onClick={onCellClick}
                onHover={onCellHover}
                onLeave={onCellLeave}
                onFocus={onCellFocus}
                onKeyDown={onCellKeyDown}
                loading={loading}
                zoomLevel={zoomLevel}
                disabled={false}
                tabIndex={0}
                currentTheme={currentTheme}
                className={`touch-manipulation select-none active:scale-95 ${
                  zoomLevel === "xlarge" ? "max-w-[125px]" : ""
                }`}
              />
            );
          })}
        </div>
      </div>
    </ErrorBoundary>
  );
}
