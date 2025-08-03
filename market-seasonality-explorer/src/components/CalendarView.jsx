"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { format, addMonths, subMonths, isSameDay } from "date-fns";
import { useMediaQuery } from "../hooks/useMediaQuery";
import ErrorBoundary from "./ErrorBoundary";
import { CalendarGrid } from "./calendar/CalendarGrid";

export function CalendarView({
  data,
  timeFrame,
  filters,
  selectedDate,
  selectedDates = [],
  onDateSelect,
  onDatesSelect,
  loading,
  zoomLevel = "normal",
  isComparisonMode = false,
  currentTheme,
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);
  const [showMobileTooltip, setShowMobileTooltip] = useState(false);
  const [mobileTooltipData, setMobileTooltipData] = useState(null);

  // Use refs to prevent infinite re-renders
  const dataRef = useRef(data);
  const timeFrameRef = useRef(timeFrame);
  const selectedDateRef = useRef(selectedDate);
  const selectedDatesRef = useRef(selectedDates);

  // Navigation handlers
  const handlePrevious = useCallback(() => {
    try {
      const currentTimeFrame = timeFrameRef.current;
      if (currentTimeFrame === "daily") {
        setCurrentDate((prev) => subMonths(prev, 1));
      } else if (currentTimeFrame === "weekly") {
        setCurrentDate(
          (prev) =>
            new Date(prev.getFullYear() - 1, prev.getMonth(), prev.getDate())
        );
      } else if (currentTimeFrame === "monthly") {
        setCurrentDate(
          (prev) =>
            new Date(prev.getFullYear() - 1, prev.getMonth(), prev.getDate())
        );
      }
    } catch (error) {
      console.error("Error in handlePrevious:", error);
    }
  }, []);

  const handleNext = useCallback(() => {
    try {
      const currentTimeFrame = timeFrameRef.current;
      if (currentTimeFrame === "daily") {
        setCurrentDate((prev) => addMonths(prev, 1));
      } else if (currentTimeFrame === "weekly") {
        setCurrentDate(
          (prev) =>
            new Date(prev.getFullYear() + 1, prev.getMonth(), prev.getDate())
        );
      } else if (currentTimeFrame === "monthly") {
        setCurrentDate(
          (prev) =>
            new Date(prev.getFullYear() + 1, prev.getMonth(), prev.getDate())
        );
      }
    } catch (error) {
      console.error("Error in handleNext:", error);
    }
  }, []);

  const handleToday = useCallback(() => {
    try {
      const today = new Date();
      setCurrentDate(today);
      onDateSelect(today);
    } catch (error) {
      console.error("Error in handleToday:", error);
    }
  }, [onDateSelect]);

  // Update refs when props change
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    timeFrameRef.current = timeFrame;
  }, [timeFrame]);

  useEffect(() => {
    selectedDateRef.current = selectedDate;
  }, [selectedDate]);

  useEffect(() => {
    selectedDatesRef.current = selectedDates;
  }, [selectedDates]);

  // Enhanced responsive breakpoints
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isSmallMobile = useMediaQuery("(max-width: 480px)");
  const isLandscape = useMediaQuery("(orientation: landscape)");
  const isTouchDevice = useMediaQuery("(hover: none) and (pointer: coarse)");

  // Stable date selection checker using refs
  const isDateSelected = useCallback((date) => {
    try {
      const currentSelectedDate = selectedDateRef.current;
      const currentSelectedDates = selectedDatesRef.current;

      if (currentSelectedDate && isSameDay(date, currentSelectedDate))
        return true;
      return currentSelectedDates.some((selectedDate) =>
        isSameDay(date, selectedDate)
      );
    } catch (error) {
      console.error("Error in isDateSelected:", error);
      return false;
    }
  }, []);

  // Enhanced touch gesture handling with better mobile support
  const touchHandlers = useMemo(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let longPressTimer = null;

    return {
      onTouchStart: (e) => {
        try {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          touchStartTime = Date.now();

          // Set up long press detection for additional features
          longPressTimer = setTimeout(() => {
            // Haptic feedback for long press
            if ("vibrate" in navigator) {
              navigator.vibrate([50, 50, 50]);
            }
          }, 500);
        } catch (error) {
          console.error("Error in onTouchStart:", error);
        }
      },
      onTouchMove: (e) => {
        try {
          // Clear long press if user moves finger
          if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
          }

          // Prevent default scrolling for horizontal swipes
          const currentX = e.touches[0].clientX;
          const currentY = e.touches[0].clientY;
          const deltaX = Math.abs(currentX - touchStartX);
          const deltaY = Math.abs(currentY - touchStartY);

          // Only prevent scroll for clear horizontal gestures
          if (deltaX > deltaY && deltaX > 15) {
            e.preventDefault();
          }
        } catch (error) {
          console.error("Error in onTouchMove:", error);
        }
      },
      onTouchEnd: (e) => {
        try {
          // Clear long press timer
          if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
          }

          const touchEndX = e.changedTouches[0].clientX;
          const touchEndY = e.changedTouches[0].clientY;
          const touchEndTime = Date.now();
          const deltaX = touchEndX - touchStartX;
          const deltaY = touchEndY - touchStartY;
          const deltaTime = touchEndTime - touchStartTime;

          // Only process quick swipes (less than 400ms for better mobile experience)
          if (deltaTime > 400) return;

          const absDeltaX = Math.abs(deltaX);
          const absDeltaY = Math.abs(deltaY);

          // Horizontal swipes with lower threshold for mobile
          if (absDeltaX > absDeltaY && absDeltaX > 30) {
            // Haptic feedback for navigation
            if ("vibrate" in navigator) {
              navigator.vibrate(25);
            }

            if (deltaX > 0) {
              handlePrevious();
            } else {
              handleNext();
            }
          }
        } catch (error) {
          console.error("Error in onTouchEnd:", error);
        }
      },
    };
  }, [handlePrevious, handleNext, isDateSelected]);

  // Stable data getter using refs
  const getDataForDate = useCallback((date) => {
    try {
      const currentData = dataRef.current;
      if (!currentData || currentData.length === 0) return null;

      const targetDateStr = format(date, "yyyy-MM-dd");
      const matchingData = currentData.find((item) => {
        if (!item || !item.timestamp) return false;
        try {
          const itemDate = new Date(item.timestamp);
          const itemDateStr = format(itemDate, "yyyy-MM-dd");
          return itemDateStr === targetDateStr;
        } catch (error) {
          return false;
        }
      });
      return matchingData || null;
    } catch (error) {
      console.error("Error in getDataForDate:", error);
      return null;
    }
  }, []);

  // Enhanced cell click handler with better mobile support
  const handleCellClick = useCallback(
    (date) => {
      try {
        const currentSelectedDate = selectedDateRef.current;
        const currentSelectedDates = selectedDatesRef.current;

        // Enhanced mobile interaction
        if (isMobile || isTouchDevice) {
          const cellData = getDataForDate(date);

          // Show tooltip on first tap if data exists and not selected
          if (!isDateSelected(date) && cellData) {
            setMobileTooltipData({
              date,
              data: cellData,
            });
            setShowMobileTooltip(true);

            // Auto-hide mobile tooltip after 4 seconds
            setTimeout(() => {
              setShowMobileTooltip(false);
            }, 4000);
          }

          // Haptic feedback for mobile interactions
          if ("vibrate" in navigator) {
            navigator.vibrate(50);
          }
        }

        // Selection logic
        const isAlreadySelected = isDateSelected(date);

        if (isAlreadySelected) {
          if (currentSelectedDates.length > 0) {
            const newSelectedDates = currentSelectedDates.filter(
              (d) => !isSameDay(d, date)
            );
            onDatesSelect(newSelectedDates);
            if (newSelectedDates.length === 1) {
              onDateSelect(newSelectedDates[0]);
              onDatesSelect([]);
            } else if (newSelectedDates.length === 0) {
              onDateSelect(null);
            }
          } else if (
            currentSelectedDate &&
            isSameDay(currentSelectedDate, date)
          ) {
            onDateSelect(null);
          }
          return;
        }

        if (currentSelectedDate || currentSelectedDates.length > 0) {
          let newSelectedDates = [];
          if (currentSelectedDate) {
            newSelectedDates = [currentSelectedDate, date];
          } else {
            newSelectedDates = [...currentSelectedDates, date];
          }
          newSelectedDates.sort((a, b) => a.getTime() - b.getTime());
          onDateSelect(null);
          onDatesSelect(newSelectedDates);
          if (newSelectedDates.length >= 2) {
            const comparisonEvent = new CustomEvent("forceComparisonTab", {
              detail: { dates: newSelectedDates },
            });
            window.dispatchEvent(comparisonEvent);
          }
          return;
        }

        onDateSelect(date);
        if (currentSelectedDates.length > 0) {
          onDatesSelect([]);
        }
      } catch (error) {
        console.error("Error in handleCellClick:", error);
      }
    },
    [
      onDateSelect,
      onDatesSelect,
      isMobile,
      isTouchDevice,
      getDataForDate,
      isDateSelected,
    ]
  );

  // Stable hover handlers
  const handleCellHover = useCallback(
    (date, event) => {
      try {
        // Skip hover on touch devices
        if (isMobile || isTouchDevice) return;
        setHoveredDate(date);
        const cellData = getDataForDate(date);
        setTooltipData({
          date,
          data: cellData,
          position: { x: event.clientX, y: event.clientY },
        });
      } catch (error) {
        console.error("Error in handleCellHover:", error);
      }
    },
    [getDataForDate, isMobile, isTouchDevice]
  );

  const handleCellLeave = useCallback(() => {
    try {
      if (!isMobile && !isTouchDevice) {
        setHoveredDate(null);
        setTooltipData(null);
      }
    } catch (error) {
      console.error("Error in handleCellLeave:", error);
    }
  }, [isMobile, isTouchDevice]);

  // Memoized common props
  const commonProps = useMemo(
    () => ({
      data,
      timeFrame,
      filters,
      selectedDate,
      selectedDates,
      hoveredDate,
      onCellClick: handleCellClick,
      onCellHover: handleCellHover,
      onCellLeave: handleCellLeave,
      loading: false,
      zoomLevel,
      isComparisonMode,
      getDataForDate,
      isDateSelected,
      currentDate,
      handlePrevious,
      handleNext,
      handleToday,
      isMobile,
      isTablet,
      isSmallMobile,
      isLandscape,
      currentTheme,
    }),
    [
      data,
      timeFrame,
      filters,
      selectedDate,
      selectedDates,
      hoveredDate,
      handleCellClick,
      handleCellHover,
      handleCellLeave,
      zoomLevel,
      isComparisonMode,
      getDataForDate,
      isDateSelected,
      currentDate,
      handlePrevious,
      handleNext,
      handleToday,
      isMobile,
      isTablet,
      isSmallMobile,
      isLandscape,
      currentTheme,
    ]
  );

  return (
    <ErrorBoundary>
      <div className="calendar-view w-full">
        <CalendarGrid
          data={data}
          timeFrame={timeFrame}
          selectedDate={selectedDate}
          selectedDates={selectedDates}
          onDateSelect={onDateSelect}
          onDatesSelect={onDatesSelect}
          loading={loading}
          zoomLevel={zoomLevel}
          isComparisonMode={isComparisonMode}
          currentTheme={currentTheme}
        />
      </div>
    </ErrorBoundary>
  );
}
