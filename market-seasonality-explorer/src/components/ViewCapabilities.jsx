"use client";

import {
  Calendar,
  BarChart3,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card } from "./ui/card";

export function ViewCapabilities() {
  const capabilities = {
    daily: {
      icon: Calendar,
      name: "Daily View",
      implemented: [
        "Individual day metrics",
        "Intraday volatility display",
        "Daily volume indicators",
        "Price change percentages",
        "OHLC data visualization",
        "Interactive tooltips",
      ],
      planned: ["Intraday volatility ranges", "Advanced liquidity metrics"],
    },
    weekly: {
      icon: BarChart3,
      name: "Weekly View",
      implemented: [
        "Weekly data aggregation",
        "Week-over-week comparisons",
        "Weekly volatility averages",
        "Total weekly volume",
        "Weekly performance summary",
      ],
      planned: ["Advanced weekly patterns", "Seasonal trend analysis"],
    },
    monthly: {
      icon: TrendingUp,
      name: "Monthly View",
      implemented: [
        "Monthly overview metrics",
        "Month-over-month analysis",
        "Monthly volatility trends",
        "Monthly performance highlights",
        "Yearly comparison view",
      ],
      planned: ["Advanced liquidity patterns", "Seasonal correlation analysis"],
    },
  };

  return (
    <div className="space-y-4">
      {Object.entries(capabilities).map(([key, view]) => {
        const IconComponent = view.icon;
        return (
          <Card key={key} className="p-3">
            <div className="flex items-center space-x-2 mb-3">
              <IconComponent className="h-4 w-4 text-blue-600" />
              <h3 className="font-medium text-sm">{view.name}</h3>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-medium text-green-700">
                    Implemented
                  </span>
                </div>
                <ul className="text-xs text-gray-600 space-y-1">
                  {view.implemented.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-1">
                      <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {view.planned.length > 0 && (
                <div>
                  <div className="flex items-center space-x-1 mb-1">
                    <XCircle className="h-3 w-3 text-orange-500" />
                    <span className="text-xs font-medium text-orange-600">
                      Planned
                    </span>
                  </div>
                  <ul className="text-xs text-gray-500 space-y-1">
                    {view.planned.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-1">
                        <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
