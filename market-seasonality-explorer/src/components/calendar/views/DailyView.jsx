"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "../../ui/button";
import ErrorBoundary from "../../ErrorBoundary";
import { motion } from "framer-motion";

export function DailyView({
  data,
  selectedDate,
  selectedDates,
  onDateSelect,
  onDatesSelect,
  loading,
  zoomLevel,
  isComparisonMode,
  currentTheme,
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [focusedDate, setFocusedDate] = useState(null);
  const cellRefs = useRef({});
  const containerRef = useRef(null);

  // Initialize focused date
  useEffect(() => {
    if (!focusedDate) {
      setFocusedDate(new Date());
    }
  }, [focusedDate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        !focusedDate ||
        !containerRef.current?.contains(document.activeElement)
      )
        return;

      const currentFocused = new Date(focusedDate);
      let newFocused = new Date(currentFocused);

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          newFocused.setDate(currentFocused.getDate() - 1);
          break;
        case "ArrowRight":
          e.preventDefault();
          newFocused.setDate(currentFocused.getDate() + 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          newFocused.setDate(currentFocused.getDate() - 7);
          break;
        case "ArrowDown":
          e.preventDefault();
          newFocused.setDate(currentFocused.getDate() + 7);
          break;
        case "Home":
          e.preventDefault();
          newFocused = new Date();
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (isComparisonMode) {
            const newDates = selectedDates.includes(currentFocused)
              ? selectedDates.filter(
                  (d) => d.getTime() !== currentFocused.getTime()
                )
              : [...selectedDates, currentFocused];
            onDatesSelect(newDates);
          } else {
            onDateSelect(currentFocused);
          }
          return;
        case "Escape":
          e.preventDefault();
          if (isComparisonMode) {
            onDatesSelect([]);
          } else {
            onDateSelect(null);
          }
          return;
        default:
          return;
      }

      // Update month if necessary
      if (
        newFocused.getMonth() !== currentMonth.getMonth() ||
        newFocused.getFullYear() !== currentMonth.getFullYear()
      ) {
        setCurrentMonth(
          new Date(newFocused.getFullYear(), newFocused.getMonth(), 1)
        );
      }

      setFocusedDate(newFocused);

      // Focus the new cell
      setTimeout(() => {
        const dateKey = newFocused.toDateString();
        const cellElement = cellRefs.current[dateKey];
        if (cellElement) {
          cellElement.focus();
        }
      }, 0);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    focusedDate,
    currentMonth,
    selectedDate,
    selectedDates,
    isComparisonMode,
    onDateSelect,
    onDatesSelect,
  ]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getDataForDate = (date) => {
    if (!date || !data) return null;
    return data.find((item) => {
      const itemDate = new Date(item.timestamp);
      return itemDate.toDateString() === date.toDateString();
    });
  };

  const isSelected = (date) => {
    if (!date) return false;
    if (isComparisonMode) {
      return selectedDates.some(
        (selectedDate) => selectedDate.toDateString() === date.toDateString()
      );
    }
    return selectedDate && selectedDate.toDateString() === date.toDateString();
  };

  const isFocused = (date) => {
    return (
      focusedDate && date && focusedDate.toDateString() === date.toDateString()
    );
  };

  const handleCellClick = (date) => {
    if (!date) return;

    setFocusedDate(date);

    if (isComparisonMode) {
      const newDates = selectedDates.some(
        (d) => d.toDateString() === date.toDateString()
      )
        ? selectedDates.filter((d) => d.toDateString() !== date.toDateString())
        : [...selectedDates, date];
      onDatesSelect(newDates);
    } else {
      onDateSelect(date);
    }
  };

  const handleCellFocus = (date) => {
    if (date) {
      setFocusedDate(date);
    }
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setFocusedDate(today);
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const zoomClasses = {
    small: "text-xs p-1",
    normal: "text-sm p-2",
    large: "text-base p-3",
    xlarge: "text-lg p-4",
  };

  return (
    <ErrorBoundary>
      <div ref={containerRef} className="w-full" tabIndex={-1}>
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth(-1)}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <h2 className="text-lg font-semibold min-w-[200px] text-center">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth(1)}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="flex items-center space-x-1 bg-transparent"
          >
            <Calendar className="h-3 w-3" />
            <span className="text-xs">Today</span>
          </Button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 p-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="aspect-square" />;
            }

            const dateData = getDataForDate(date);
            const selected = isSelected(date);
            const focused = isFocused(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const dateKey = date.toDateString();

            return (
              <motion.button
                key={dateKey}
                ref={(el) => (cellRefs.current[dateKey] = el)}
                className={`
                  aspect-square border rounded-lg transition-all duration-200 relative
                  ${zoomClasses[zoomLevel] || zoomClasses.normal}
                  ${
                    selected
                      ? "bg-blue-500 text-white border-blue-600 ring-2 ring-blue-300"
                      : "bg-white hover:bg-gray-50 border-gray-200"
                  }
                  ${focused ? "ring-2 ring-purple-400 ring-offset-1" : ""}
                  ${isToday ? "font-bold border-blue-400" : ""}
                  ${dateData ? "cursor-pointer" : "cursor-default opacity-50"}
                  focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1
                `}
                onClick={() => handleCellClick(date)}
                onFocus={() => handleCellFocus(date)}
                tabIndex={focused ? 0 : -1}
                aria-label={`${date.toDateString()}${
                  selected ? " (selected)" : ""
                }${focused ? " (focused)" : ""}`}
                aria-selected={selected}
                role="gridcell"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span
                    className={`${
                      zoomLevel === "small" ? "text-xs" : "text-sm"
                    } font-medium`}
                  >
                    {date.getDate()}
                  </span>

                  {dateData && (
                    <div className="flex flex-col items-center mt-1 space-y-1">
                      {/* Price indicator */}
                      <div
                        className={`w-2 h-2 rounded-full ${
                          dateData.change > 0
                            ? "bg-green-400"
                            : dateData.change < 0
                            ? "bg-red-400"
                            : "bg-gray-400"
                        }`}
                      />

                      {/* Volume bar */}
                      {zoomLevel !== "small" && (
                        <div
                          className="w-full bg-gray-200 rounded-full h-1"
                          style={{ maxWidth: "80%" }}
                        >
                          <div
                            className="bg-blue-400 h-1 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(
                                100,
                                ((dateData.volume || 0) / 1000000) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selection indicator for comparison mode */}
                {isComparisonMode && selected && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {selectedDates.findIndex(
                      (d) => d.toDateString() === date.toDateString()
                    ) + 1}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="text-sm text-gray-500">
              Loading calendar data...
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
