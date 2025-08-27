"use client";
import { useRef, useCallback } from "react";

export function useTouchGestures({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  preventScroll = false,
}) {
  const touchStartRef = useRef(null);
  const isProcessingRef = useRef(false);

  // Stable handlers to prevent infinite re-renders
  const onTouchStart = useCallback((e) => {
    if (isProcessingRef.current) return;
    touchStartRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
      time: Date.now(),
    };
  }, []);

  const onTouchMove = useCallback(
    (e) => {
      if (isProcessingRef.current || !touchStartRef.current) return;

      if (preventScroll) {
        const currentTouch = {
          x: e.targetTouches[0].clientX,
          y: e.targetTouches[0].clientY,
        };
        const deltaX = Math.abs(currentTouch.x - touchStartRef.current.x);
        const deltaY = Math.abs(currentTouch.y - touchStartRef.current.y);

        // Prevent scroll if horizontal swipe is detected
        if (deltaX > deltaY && deltaX > 10) {
          e.preventDefault();
        }
      }
    },
    [preventScroll]
  );

  const onTouchEnd = useCallback(
    (e) => {
      if (isProcessingRef.current || !touchStartRef.current) return;

      isProcessingRef.current = true;

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
        time: Date.now(),
      };

      const deltaX = touchEnd.x - touchStartRef.current.x;
      const deltaY = touchEnd.y - touchStartRef.current.y;
      const deltaTime = touchEnd.time - touchStartRef.current.time;

      // Only process quick swipes (less than 300ms)
      if (deltaTime > 300) {
        isProcessingRef.current = false;
        touchStartRef.current = null;
        return;
      }

      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Horizontal swipes
      if (absDeltaX > absDeltaY && absDeltaX > threshold) {
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      }
      // Vertical swipes
      else if (absDeltaY > absDeltaX && absDeltaY > threshold) {
        if (deltaY > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
      }

      // Reset with delay to prevent rapid firing
      setTimeout(() => {
        touchStartRef.current = null;
        isProcessingRef.current = false;
      }, 100);
    },
    [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold]
  );

  return { onTouchStart, onTouchMove, onTouchEnd };
}
