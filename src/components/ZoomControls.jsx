"use client";

import { useCallback } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

const ZOOM_LEVELS = [
  { value: "small", label: "Small", scale: 0.75 },
  { value: "normal", label: "Normal", scale: 1.0 },
  { value: "large", label: "Large", scale: 1.15 },
  { value: "xlarge", label: "X-Large", scale: 1.25 }, // Reduced from 1.4 to 1.25
];

export function ZoomControls({
  zoomLevel = "normal",
  onZoomChange,
  className = "",
}) {
  const handleZoomChange = useCallback(
    (e) => {
      const newZoomLevel = e.target.value;
      console.log("🔍 ZoomControls: Changing zoom to", newZoomLevel);
      if (onZoomChange) {
        onZoomChange(newZoomLevel);
      }
    },
    [onZoomChange]
  );

  const handleZoomIn = useCallback(() => {
    const currentIndex = ZOOM_LEVELS.findIndex(
      (level) => level.value === zoomLevel
    );
    const nextIndex = Math.min(currentIndex + 1, ZOOM_LEVELS.length - 1);
    if (onZoomChange) {
      onZoomChange(ZOOM_LEVELS[nextIndex].value);
    }
  }, [zoomLevel, onZoomChange]);

  const handleZoomOut = useCallback(() => {
    const currentIndex = ZOOM_LEVELS.findIndex(
      (level) => level.value === zoomLevel
    );
    const prevIndex = Math.max(currentIndex - 1, 0);
    if (onZoomChange) {
      onZoomChange(ZOOM_LEVELS[prevIndex].value);
    }
  }, [zoomLevel, onZoomChange]);

  const handleReset = useCallback(() => {
    if (onZoomChange) {
      onZoomChange("normal");
    }
  }, [onZoomChange]);

  const currentZoom =
    ZOOM_LEVELS.find((level) => level.value === zoomLevel) || ZOOM_LEVELS[1];

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2 pb-2 border-b">
        <ZoomIn className="h-4 w-4 text-blue-600" />
        <h3 className="text-sm font-semibold">Zoom</h3>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {ZOOM_LEVELS.map((level) => (
          <button
            key={level.value}
            onClick={() => onZoomChange && onZoomChange(level.value)}
            className={`h-10 px-2 text-xs font-semibold rounded-lg transition-all duration-300 ${
              zoomLevel === level.value
                ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md scale-105"
                : "bg-background/80 backdrop-blur-sm border border-white/20 hover:bg-background/90 hover:shadow-md"
            }`}
          >
            {level.label}
            <div className="text-[10px] opacity-70">
              {Math.round(level.scale * 100)}%
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
