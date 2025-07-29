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
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center space-x-1">
        <ZoomIn className="h-3 w-3 text-gray-500" />
        <h3 className="text-xs font-medium">Zoom</h3>
      </div>

      {/* Zoom Level Select */}
      <select
        value={zoomLevel}
        onChange={handleZoomChange}
        className="w-full h-8 text-xs border border-gray-300 rounded px-2 bg-white"
      >
        {ZOOM_LEVELS.map((level) => (
          <option key={level.value} value={level.value}>
            {level.label} ({Math.round(level.scale * 100)}%)
          </option>
        ))}
      </select>

      {/* Quick Zoom Buttons */}
      <div className="flex space-x-1">
        <button
          onClick={handleZoomOut}
          disabled={zoomLevel === "small"}
          className="flex-1 h-7 text-xs px-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <ZoomOut className="h-3 w-3" />
        </button>
        <button
          onClick={handleReset}
          className="flex-1 h-7 text-xs px-1 border border-gray-300 rounded bg-white hover:bg-gray-50 flex items-center justify-center"
          title="Reset to Normal"
        >
          <RotateCcw className="h-3 w-3" />
        </button>
        <button
          onClick={handleZoomIn}
          disabled={zoomLevel === "xlarge"}
          className="flex-1 h-7 text-xs px-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <ZoomIn className="h-3 w-3" />
        </button>
      </div>

      {/* Current Zoom Info */}
      <div className="text-xs text-center text-gray-500">
        {Math.round(currentZoom.scale * 100)}%
      </div>
    </div>
  );
}
