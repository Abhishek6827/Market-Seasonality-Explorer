"use client";
import { useState, useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ZoomIn, ZoomOut, Maximize2, Eye, Grid, RotateCcw } from "lucide-react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import ErrorBoundary from "./ErrorBoundary";

export const ZOOM_LEVELS = [
  {
    value: "compact",
    label: "Compact",
    scale: 0.8,
    cellHeight: "40px",
    textSize: "text-[10px]",
    padding: "p-1",
    showDetails: false,
  },
  {
    value: "normal",
    label: "Normal",
    scale: 1.0,
    cellHeight: "60px",
    textSize: "text-xs",
    padding: "p-1.5",
    showDetails: true,
  },
  {
    value: "detailed",
    label: "Detailed",
    scale: 1.2,
    cellHeight: "80px",
    textSize: "text-sm",
    padding: "p-2",
    showDetails: true,
  },
  {
    value: "large",
    label: "Large",
    scale: 1.5,
    cellHeight: "100px",
    textSize: "text-base",
    padding: "p-2.5",
    showDetails: true,
  },
];

export function EnhancedZoomControls({
  zoomLevel,
  onZoomChange,
  className = "",
  showGrid = true,
  onGridToggle,
  autoFit = false,
  onAutoFitToggle,
}) {
  const [isAnimating, setIsAnimating] = useState(false);

  const currentZoomIndex = ZOOM_LEVELS.findIndex(
    (level) => level.value === zoomLevel
  );
  const currentZoom = ZOOM_LEVELS[currentZoomIndex] || ZOOM_LEVELS[1];

  const handleZoomChange = useCallback(
    (newZoomLevel) => {
      setIsAnimating(true);
      onZoomChange(newZoomLevel);
      setTimeout(() => setIsAnimating(false), 300);
    },
    [onZoomChange]
  );

  const handleZoomIn = useCallback(() => {
    if (currentZoomIndex < ZOOM_LEVELS.length - 1) {
      const nextLevel = ZOOM_LEVELS[currentZoomIndex + 1];
      handleZoomChange(nextLevel.value);
    }
  }, [currentZoomIndex, handleZoomChange]);

  const handleZoomOut = useCallback(() => {
    if (currentZoomIndex > 0) {
      const prevLevel = ZOOM_LEVELS[currentZoomIndex - 1];
      handleZoomChange(prevLevel.value);
    }
  }, [currentZoomIndex, handleZoomChange]);

  const handleFitToScreen = useCallback(() => {
    handleZoomChange("normal");
  }, [handleZoomChange]);

  const handleSelectChange = useCallback(
    (value) => {
      handleZoomChange(value);
    },
    [handleZoomChange]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "=":
          case "+":
            event.preventDefault();
            handleZoomIn();
            break;
          case "-":
            event.preventDefault();
            handleZoomOut();
            break;
          case "0":
            event.preventDefault();
            handleFitToScreen();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleZoomIn, handleZoomOut, handleFitToScreen]);

  return (
    <ErrorBoundary>
      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 ${className}`}
      >
        {/* Main Zoom Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-gray-50 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={currentZoomIndex === 0 || isAnimating}
              title="Zoom Out (Ctrl + -)"
              className="h-7 w-7 p-0 hover:bg-white"
            >
              <ZoomOut className="h-3 w-3" />
            </Button>

            <Select
              value={zoomLevel}
              onValueChange={handleSelectChange}
              disabled={isAnimating}
            >
              <SelectTrigger className="w-24 h-7 text-xs border-0 bg-transparent focus:ring-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ZOOM_LEVELS.map((level) => (
                  <SelectItem
                    key={level.value}
                    value={level.value}
                    className="text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <span>{level.label}</span>
                      <span className="text-gray-400">
                        ({Math.round(level.scale * 100)}%)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={
                currentZoomIndex === ZOOM_LEVELS.length - 1 || isAnimating
              }
              title="Zoom In (Ctrl + +)"
              className="h-7 w-7 p-0 hover:bg-white"
            >
              <ZoomIn className="h-3 w-3" />
            </Button>

            <div className="w-px h-4 bg-gray-300 mx-1" />

            <Button
              variant="ghost"
              size="sm"
              onClick={handleFitToScreen}
              disabled={isAnimating}
              title="Reset to Normal (Ctrl + 0)"
              className="h-7 w-7 p-0 hover:bg-white"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
          </div>

          {/* Zoom Level Indicator */}
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <Eye className="h-3 w-3" />
            <span className="font-medium">
              {Math.round(currentZoom.scale * 100)}%
            </span>
          </div>
        </div>

        {/* Additional Controls */}
        <div className="flex items-center space-x-3 text-xs">
          {/* Grid Toggle */}
          {onGridToggle && (
            <div className="flex items-center space-x-2">
              <Switch
                id="grid-toggle"
                checked={showGrid}
                onCheckedChange={onGridToggle}
                className="scale-75"
              />
              <Label
                htmlFor="grid-toggle"
                className="text-xs flex items-center space-x-1"
              >
                <Grid className="h-3 w-3" />
                <span>Grid</span>
              </Label>
            </div>
          )}

          {/* Auto Fit Toggle */}
          {onAutoFitToggle && (
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-fit"
                checked={autoFit}
                onCheckedChange={onAutoFitToggle}
                className="scale-75"
              />
              <Label
                htmlFor="auto-fit"
                className="text-xs flex items-center space-x-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Auto Fit</span>
              </Label>
            </div>
          )}
        </div>

        {/* Zoom Info */}
        <div className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          Cell: {currentZoom.cellHeight} •{" "}
          {currentZoom.showDetails ? "Details" : "Compact"}
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="mt-2 text-[10px] text-gray-400 hidden sm:block">
        💡 <strong>Shortcuts:</strong> Ctrl + Plus/Minus to zoom • Ctrl + 0 to
        reset
      </div>
    </ErrorBoundary>
  );
}

// Export the original component with fixed imports for backward compatibility
export function ZoomControls({ zoomLevel, onZoomChange, className }) {
  const currentZoomIndex = ZOOM_LEVELS.findIndex(
    (level) => level.value === zoomLevel
  );
  const currentZoom = ZOOM_LEVELS[currentZoomIndex] || ZOOM_LEVELS[1];

  const handleZoomIn = () => {
    if (currentZoomIndex < ZOOM_LEVELS.length - 1) {
      const nextLevel = ZOOM_LEVELS[currentZoomIndex + 1];
      onZoomChange(nextLevel.value);
    }
  };

  const handleZoomOut = () => {
    if (currentZoomIndex > 0) {
      const prevLevel = ZOOM_LEVELS[currentZoomIndex - 1];
      onZoomChange(prevLevel.value);
    }
  };

  const handleFitToScreen = () => {
    onZoomChange("normal");
  };

  const handleSelectChange = (value) => {
    onZoomChange(value);
  };

  return (
    <ErrorBoundary>
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={currentZoomIndex === 0}
            title="Zoom Out"
            className="h-8 w-8 p-0 bg-transparent"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Select value={zoomLevel} onValueChange={handleSelectChange}>
            <SelectTrigger className="w-28 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ZOOM_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={currentZoomIndex === ZOOM_LEVELS.length - 1}
            title="Zoom In"
            className="h-8 w-8 p-0 bg-transparent"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleFitToScreen}
            title="Reset to Normal"
            className="h-8 w-8 p-0 bg-transparent"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          {Math.round(currentZoom.scale * 100)}%
        </div>
      </div>
    </ErrorBoundary>
  );
}
