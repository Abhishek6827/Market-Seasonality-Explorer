"use client";
import { useEffect, useRef } from "react";
import { DailyView } from "./views/DailyView";
import ErrorBoundary from "../ErrorBoundary";

export function CalendarGrid({
  data,
  timeFrame,
  selectedDate,
  selectedDates,
  onDateSelect,
  onDatesSelect,
  loading,
  zoomLevel,
  isComparisonMode,
  currentTheme,
}) {
  const gridRef = useRef(null);

  // Handle keyboard navigation at grid level
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle if the grid or its children have focus
      if (!gridRef.current?.contains(document.activeElement)) return;

      // Let individual views handle their own keyboard events
      // This is just a fallback for grid-level shortcuts
      switch (e.key) {
        case "Tab":
          // Allow normal tab navigation
          break;
        default:
          // Let child components handle other keys
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const renderView = () => {
    switch (timeFrame) {
      case "daily":
        return (
          <DailyView
            data={data}
            selectedDate={selectedDate}
            selectedDates={selectedDates}
            onDateSelect={onDateSelect}
            onDatesSelect={onDatesSelect}
            loading={loading}
            zoomLevel={zoomLevel}
            isComparisonMode={isComparisonMode}
            currentTheme={currentTheme}
          />
        );
      case "weekly":
        // Weekly view would go here
        return (
          <div className="p-8 text-center text-gray-500">
            Weekly view coming soon...
          </div>
        );
      case "monthly":
        // Monthly view would go here
        return (
          <div className="p-8 text-center text-gray-500">
            Monthly view coming soon...
          </div>
        );
      default:
        return (
          <div className="p-8 text-center text-red-500">
            Unknown time frame: {timeFrame}
          </div>
        );
    }
  };

  return (
    <ErrorBoundary>
      <div
        ref={gridRef}
        className="calendar-grid w-full"
        role="grid"
        aria-label={`${timeFrame} calendar view`}
      >
        {renderView()}
      </div>
    </ErrorBoundary>
  );
}
