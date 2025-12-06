"use client";

import { useState, useCallback } from "react";
import { Palette, Sun, Moon, Eye, Contrast } from "lucide-react";

export const COLOR_SCHEMES = {
  default: {
    name: "Default",
    icon: Sun,
    colorScheme: "default",
    volatility: {
      low: "bg-green-200 border-green-400 text-green-800",
      medium: "bg-yellow-200 border-yellow-400 text-yellow-800",
      high: "bg-orange-200 border-orange-400 text-orange-800",
      veryHigh: "bg-red-200 border-red-400 text-red-800",
    },
    volatilityAggregated: {
      low: "bg-emerald-300 border-emerald-500 text-emerald-900",
      medium: "bg-amber-300 border-amber-500 text-amber-900",
      high: "bg-orange-400 border-orange-600 text-orange-900",
      veryHigh: "bg-red-500 border-red-700 text-red-100",
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
  },
};

export function ThemeControls({ onThemeChange, className = "" }) {
  const [selectedTheme, setSelectedTheme] = useState("default");

  const handleThemeChange = useCallback(
    (e) => {
      try {
        const themeKey = e.target.value;
        setSelectedTheme(themeKey);
        const theme = COLOR_SCHEMES[themeKey];
        if (theme && onThemeChange) {
          console.log("🎨 ThemeControls: Changing theme to", themeKey);
          onThemeChange(theme);
        }
      } catch (error) {
        console.error("Error changing theme:", error);
      }
    },
    [onThemeChange]
  );

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2 pb-2 border-b">
        <Palette className="h-4 w-4 text-blue-600" />
        <h3 className="text-sm font-semibold">Themes</h3>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700 block">
          Color Scheme
        </label>
        <select
          value={selectedTheme}
          onChange={handleThemeChange}
          className="w-full h-8 text-xs border border-gray-300 rounded px-2 bg-white"
        >
          {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
            <option key={key} value={key}>
              {scheme.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => {
          const IconComponent = scheme.icon;
          return (
            <button
              key={key}
              onClick={() => {
                setSelectedTheme(key);
                if (onThemeChange) {
                  onThemeChange(scheme);
                }
              }}
              className={`text-xs flex items-center gap-1.5 justify-center h-8 px-2 border rounded transition-all ${
                selectedTheme === key
                  ? "bg-blue-500 text-white border-blue-600 shadow-sm"
                  : "bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              }`}
            >
              <IconComponent className="h-3 w-3 flex-shrink-0" />
              <span className="truncate text-xs font-medium">
                {scheme.name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-xs font-semibold text-gray-700 flex items-center gap-1">
          <span>📊</span>
          <span>Data Visualization Layers</span>
        </div>

        <div className="space-y-1.5">
          <div className="text-xs text-gray-600 font-medium">
            🌡️ Volatility Heatmap
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {Object.entries(COLOR_SCHEMES[selectedTheme].volatility).map(
              ([level, classes]) => (
                <div
                  key={level}
                  className={`px-2 py-1.5 rounded text-[10px] text-center font-semibold ${classes} border shadow-sm`}
                  style={{
                    minHeight: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span className="capitalize leading-tight">{level}</span>
                </div>
              )
            )}
          </div>
          <div className="text-[10px] text-gray-500 text-center mt-1 leading-relaxed">
            Green (Low) → Yellow (Medium) → Orange (High) → Red (Very High)
          </div>
        </div>
      </div>
    </div>
  );
}
