"use client";
import { useState, useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import { Palette, Sun, Moon, Eye, Contrast } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import ErrorBoundary from "./ErrorBoundary";

export const COLOR_SCHEMES = {
  default: {
    name: "Default",
    icon: Sun,
    colorScheme: "default",
    // Daily view colors (fine-grained)
    volatility: {
      low: "bg-green-200 border-green-400 text-green-800",
      medium: "bg-yellow-200 border-yellow-400 text-yellow-800",
      high: "bg-orange-200 border-orange-400 text-orange-800",
      veryHigh: "bg-red-200 border-red-400 text-red-800",
    },
    // Weekly/Monthly view colors (more contrast)
    volatilityAggregated: {
      low: "bg-emerald-300 border-emerald-500 text-emerald-900",
      medium: "bg-amber-300 border-amber-500 text-amber-900",
      high: "bg-orange-400 border-orange-600 text-orange-900",
      veryHigh: "bg-red-500 border-red-700 text-red-100",
    },
    volatilityDark: {
      low: "bg-green-800/30 border-green-600 text-green-200",
      medium: "bg-yellow-800/30 border-yellow-600 text-yellow-200",
      high: "bg-orange-800/30 border-orange-600 text-orange-200",
      veryHigh: "bg-red-800/30 border-red-600 text-red-200",
    },
  },
  highContrast: {
    name: "High Contrast",
    icon: Contrast,
    colorScheme: "highContrast",
    volatility: {
      low: "bg-white border-black border-2 text-black",
      medium: "bg-gray-300 border-black border-2 text-black",
      high: "bg-gray-600 border-black border-2 text-white",
      veryHigh: "bg-black border-white border-2 text-white",
    },
    volatilityAggregated: {
      low: "bg-white border-black border-3 text-black",
      medium: "bg-gray-400 border-black border-3 text-black",
      high: "bg-gray-700 border-white border-3 text-white",
      veryHigh: "bg-black border-white border-3 text-white",
    },
    volatilityDark: {
      low: "bg-white border-black border-2 text-black",
      medium: "bg-gray-300 border-black border-2 text-black",
      high: "bg-gray-800 border-gray-600 text-gray-200",
      veryHigh: "bg-gray-600 border-gray-400 text-gray-200",
    },
  },
  colorblindFriendly: {
    name: "Colorblind Friendly",
    icon: Eye,
    colorScheme: "colorblindFriendly",
    volatility: {
      low: "bg-blue-200 border-blue-500 text-blue-800",
      medium: "bg-purple-200 border-purple-500 text-purple-800",
      high: "bg-orange-200 border-orange-500 text-orange-800",
      veryHigh: "bg-pink-200 border-pink-500 text-pink-800",
    },
    volatilityAggregated: {
      low: "bg-blue-400 border-blue-600 text-blue-900",
      medium: "bg-purple-400 border-purple-600 text-purple-900",
      high: "bg-orange-500 border-orange-700 text-orange-100",
      veryHigh: "bg-pink-500 border-pink-700 text-pink-100",
    },
    volatilityDark: {
      low: "bg-blue-800/30 border-blue-400 text-blue-200",
      medium: "bg-purple-800/30 border-purple-400 text-purple-200",
      high: "bg-orange-800/30 border-orange-400 text-orange-200",
      veryHigh: "bg-pink-800/30 border-pink-400 text-pink-200",
    },
  },
  monochrome: {
    name: "Monochrome",
    icon: Moon,
    colorScheme: "monochrome",
    volatility: {
      low: "bg-gray-100 border-gray-300 text-gray-800",
      medium: "bg-gray-300 border-gray-500 text-gray-800",
      high: "bg-gray-500 border-gray-700 text-white",
      veryHigh: "bg-gray-800 border-gray-900 text-white",
    },
    volatilityAggregated: {
      low: "bg-gray-200 border-gray-400 text-gray-800",
      medium: "bg-gray-400 border-gray-600 text-gray-900",
      high: "bg-gray-600 border-gray-800 text-white",
      veryHigh: "bg-gray-900 border-black text-white",
    },
    volatilityDark: {
      low: "bg-gray-800 border-gray-600 text-gray-200",
      medium: "bg-gray-600 border-gray-400 text-gray-200",
      high: "bg-gray-400 border-gray-200 text-black",
      veryHigh: "bg-gray-200 border-gray-100 text-black",
    },
  },
};

export function ThemeControls({ onThemeChange, className = "" }) {
  const [selectedTheme, setSelectedTheme] = useState("default");

  const handleThemeChange = useCallback(
    (themeKey) => {
      try {
        setSelectedTheme(themeKey);
        const theme = COLOR_SCHEMES[themeKey];
        if (theme && onThemeChange) {
          onThemeChange(theme);
        }
      } catch (error) {
        console.error("Error changing theme:", error);
      }
    },
    [onThemeChange]
  );

  // Apply default theme on mount
  useEffect(() => {
    if (onThemeChange) {
      onThemeChange(COLOR_SCHEMES.default);
    }
  }, [onThemeChange]);

  return (
    <ErrorBoundary>
      <div className={`space-y-3 sm:space-y-4 ${className}`}>
        <div className="flex items-center space-x-2">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Theme Controls</h3>
        </div>

        {/* Theme Selection */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">
            Color Scheme
          </label>
          <Select value={selectedTheme} onValueChange={handleThemeChange}>
            <SelectTrigger className="w-full h-9 text-sm">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => {
                const IconComponent = scheme.icon;
                return (
                  <SelectItem key={key} value={key} className="text-sm">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{scheme.name}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Theme Buttons */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => {
            const IconComponent = scheme.icon;
            return (
              <Button
                key={key}
                variant={selectedTheme === key ? "default" : "outline"}
                size="sm"
                onClick={() => handleThemeChange(key)}
                className="text-xs flex items-center space-x-1 justify-start h-8 sm:h-9 px-2 sm:px-3"
              >
                <IconComponent className="h-3 w-3 flex-shrink-0" />
                <span className="truncate text-[10px] sm:text-xs">
                  {scheme.name}
                </span>
              </Button>
            );
          })}
        </div>

        {/* Theme Preview - Show both daily and aggregated */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Preview</label>

          {/* Daily View Preview */}
          <div className="space-y-1">
            <div className="text-[10px] text-gray-500">Daily View:</div>
            <div className="grid grid-cols-4 gap-1">
              {Object.entries(COLOR_SCHEMES[selectedTheme].volatility).map(
                ([level, classes]) => (
                  <div
                    key={level}
                    className={`p-1.5 sm:p-2 rounded text-[10px] sm:text-xs text-center ${classes} leading-tight`}
                  >
                    <span className="block sm:hidden">
                      {level.charAt(0).toUpperCase()}
                    </span>
                    <span className="hidden sm:block">{level}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Weekly/Monthly View Preview */}
          <div className="space-y-1">
            <div className="text-[10px] text-gray-500">
              Weekly/Monthly View:
            </div>
            <div className="grid grid-cols-4 gap-1">
              {Object.entries(
                COLOR_SCHEMES[selectedTheme].volatilityAggregated ||
                  COLOR_SCHEMES[selectedTheme].volatility
              ).map(([level, classes]) => (
                <div
                  key={level}
                  className={`p-1.5 sm:p-2 rounded text-[10px] sm:text-xs text-center ${classes} leading-tight`}
                >
                  <span className="block sm:hidden">
                    {level.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden sm:block">{level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
