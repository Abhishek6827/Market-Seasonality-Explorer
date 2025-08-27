"use client";

import { MousePointer, Hand, Square, Info } from "lucide-react";
import { Card } from "./ui/card";

export function InteractionGuide() {
  return (
    <Card className="p-4 bg-blue-50 border-blue-200">
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Info className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-blue-800">
            Interaction Modes Guide
          </h3>
        </div>

        <div className="space-y-3 text-xs text-blue-700">
          {/* Hover Mode */}
          <div className="flex items-start space-x-3 p-2 bg-white rounded border">
            <MousePointer className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-blue-800">
                Hover Mode (Default)
              </div>
              <div className="text-blue-600 mt-1">
                • Move your mouse over calendar cells to see instant tooltips •
                Perfect for quick data exploration without clicking • Shows
                detailed metrics: price, volume, volatility • Non-intrusive -
                doesn't change selections
              </div>
            </div>
          </div>

          {/* Click Mode */}
          <div className="flex items-start space-x-3 p-2 bg-white rounded border">
            <Hand className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-green-800">Click Mode</div>
              <div className="text-green-600 mt-1">
                • Click on dates to select them for detailed analysis • Selected
                dates appear in the Analytics Dashboard • Click another date to
                compare (switches to comparison mode) • Great for focused
                analysis of specific dates
              </div>
            </div>
          </div>

          {/* Selection Mode */}
          <div className="flex items-start space-x-3 p-2 bg-white rounded border">
            <Square className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-purple-800">Selection Mode</div>
              <div className="text-purple-600 mt-1">
                • Advanced multi-date selection for range analysis • Click
                multiple dates to build custom date ranges • Perfect for
                seasonal pattern analysis • Enables bulk export and comparison
                features
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-2 rounded border border-blue-200">
          <div className="text-xs text-blue-700">
            <strong>💡 Pro Tips:</strong>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>Use Hover for quick exploration</li>
              <li>Use Click for single-date analysis</li>
              <li>Use Selection for multi-date comparisons</li>
              <li>Keyboard shortcuts work in all modes</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
