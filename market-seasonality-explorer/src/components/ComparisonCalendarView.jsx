// "use client";

// import { CalendarView } from "./CalendarView";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Badge } from "./ui/badge";
// import { ArrowRight, TrendingUp, Activity, Volume2 } from "lucide-react";
// import { format } from "date-fns";

// export function ComparisonCalendarView({
//   primaryData,
//   comparisonData,
//   comparisonConfig,
//   timeFrame,
//   filters,
//   selectedDate,
//   selectedDateRange,
//   onDateSelect,
//   onDateRangeSelect,
//   loading,
//   zoomLevel,
// }) {
//   console.log("ComparisonCalendarView props:", {
//     onDateSelect: typeof onDateSelect,
//     onDateRangeSelect: typeof onDateRangeSelect,
//     selectedDate,
//     selectedDateRange,
//   });

//   const getComparisonMetrics = (primaryItem, comparisonItem) => {
//     if (!primaryItem || !comparisonItem) return null;

//     const volatilityChange =
//       ((primaryItem.volatility - comparisonItem.volatility) /
//         comparisonItem.volatility) *
//       100;
//     const priceChange =
//       ((primaryItem.close - comparisonItem.close) / comparisonItem.close) * 100;
//     const volumeChange =
//       ((primaryItem.volume - comparisonItem.volume) / comparisonItem.volume) *
//       100;

//     return {
//       volatilityChange,
//       priceChange,
//       volumeChange,
//       isVolatilityUp: volatilityChange > 0,
//       isPriceUp: priceChange > 0,
//       isVolumeUp: volumeChange > 0,
//     };
//   };

//   const renderComparisonHeader = () => {
//     if (comparisonConfig?.type === "symbol") {
//       return (
//         <div className="flex items-center justify-center space-x-4 mb-4">
//           <Badge variant="outline" className="text-sm">
//             {filters.symbol}
//           </Badge>
//           <ArrowRight className="h-4 w-4 text-muted-foreground" />
//           <Badge variant="outline" className="text-sm">
//             {comparisonConfig.comparisonSymbol}
//           </Badge>
//         </div>
//       );
//     }

//     if (comparisonConfig?.type === "time-period") {
//       return (
//         <div className="flex items-center justify-center space-x-4 mb-4">
//           <Badge variant="outline" className="text-sm">
//             {comparisonConfig.comparisonDate &&
//               format(comparisonConfig.comparisonDate, "MMM dd, yyyy")}
//           </Badge>
//           <ArrowRight className="h-4 w-4 text-muted-foreground" />
//           <Badge variant="outline" className="text-sm">
//             {format(new Date(), "MMM dd, yyyy")}
//           </Badge>
//         </div>
//       );
//     }

//     return null;
//   };

//   const renderSideBySideView = () => {
//     // Determine appropriate zoom and layout for weekly view to prevent overlap
//     const isWeeklyView = timeFrame === "weekly";
//     const effectiveZoomLevel = isWeeklyView ? "compact" : zoomLevel;

//     return (
//       <div className="space-y-4">
//         {renderComparisonHeader()}

//         {/* Responsive grid that adapts to screen size and timeframe */}
//         <div
//           className={`grid gap-3 ${
//             isWeeklyView
//               ? "grid-cols-1 xl:grid-cols-2" // Weekly: stack on smaller screens, side-by-side on XL+
//               : "grid-cols-1 lg:grid-cols-2" // Daily/Monthly: side-by-side on LG+
//           }`}
//         >
//           {/* Primary Calendar */}
//           <Card className={isWeeklyView ? "min-h-[400px]" : ""}>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-base flex items-center justify-between">
//                 <span>
//                   {comparisonConfig?.type === "symbol"
//                     ? filters.symbol
//                     : "Current Period"}
//                 </span>
//                 <Badge variant="secondary" className="text-xs">
//                   Primary
//                 </Badge>
//               </CardTitle>
//             </CardHeader>
//             <CardContent className={isWeeklyView ? "p-3" : "p-4"}>
//               <div className={isWeeklyView ? "scale-90 origin-top" : ""}>
//                 <CalendarView
//                   data={primaryData}
//                   timeFrame={timeFrame}
//                   filters={filters}
//                   selectedDate={selectedDate}
//                   selectedDateRange={selectedDateRange}
//                   onDateSelect={onDateSelect}
//                   onDateRangeSelect={onDateRangeSelect}
//                   loading={loading}
//                   zoomLevel={effectiveZoomLevel}
//                   isComparisonMode={true}
//                   comparisonSide="primary"
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           {/* Comparison Calendar */}
//           <Card className={isWeeklyView ? "min-h-[400px]" : ""}>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-base flex items-center justify-between">
//                 <span>
//                   {comparisonConfig?.type === "symbol"
//                     ? comparisonConfig.comparisonSymbol
//                     : "Comparison Period"}
//                 </span>
//                 <Badge variant="outline" className="text-xs">
//                   Comparison
//                 </Badge>
//               </CardTitle>
//             </CardHeader>
//             <CardContent className={isWeeklyView ? "p-3" : "p-4"}>
//               <div className={isWeeklyView ? "scale-90 origin-top" : ""}>
//                 <CalendarView
//                   data={comparisonData}
//                   timeFrame={timeFrame}
//                   filters={{
//                     ...filters,
//                     symbol:
//                       comparisonConfig?.type === "symbol"
//                         ? comparisonConfig.comparisonSymbol
//                         : filters.symbol,
//                   }}
//                   selectedDate={selectedDate}
//                   selectedDateRange={selectedDateRange}
//                   onDateSelect={onDateSelect}
//                   onDateRangeSelect={onDateRangeSelect}
//                   loading={loading}
//                   zoomLevel={effectiveZoomLevel}
//                   isComparisonMode={true}
//                   comparisonSide="comparison"
//                 />
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Show layout info for weekly view */}
//         {isWeeklyView && (
//           <div className="text-xs text-center text-muted-foreground bg-blue-50 p-2 rounded">
//             Weekly comparison view optimized for side-by-side display. Calendars
//             are scaled to prevent overlap.
//           </div>
//         )}

//         {/* Comparison Summary */}
//         {primaryData.length > 0 && comparisonData.length > 0 && (
//           <Card>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-lg">Comparison Summary</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                 {comparisonConfig?.showVolatility && (
//                   <div className="text-center p-3 bg-orange-50 rounded-lg">
//                     <Activity className="h-4 w-4 mx-auto mb-2 text-orange-600" />
//                     <div className="text-xs text-muted-foreground">
//                       Avg Volatility
//                     </div>
//                     <div className="font-semibold text-sm">
//                       {(
//                         (primaryData.reduce((sum, d) => sum + d.volatility, 0) /
//                           primaryData.length) *
//                         100
//                       ).toFixed(2)}
//                       %
//                     </div>
//                     <div className="text-xs text-muted-foreground">vs</div>
//                     <div className="font-semibold text-sm">
//                       {(
//                         (comparisonData.reduce(
//                           (sum, d) => sum + d.volatility,
//                           0
//                         ) /
//                           comparisonData.length) *
//                         100
//                       ).toFixed(2)}
//                       %
//                     </div>
//                   </div>
//                 )}

//                 {comparisonConfig?.showPerformance && (
//                   <div className="text-center p-3 bg-green-50 rounded-lg">
//                     <TrendingUp className="h-4 w-4 mx-auto mb-2 text-green-600" />
//                     <div className="text-xs text-muted-foreground">
//                       Avg Price
//                     </div>
//                     <div className="font-semibold text-sm">
//                       $
//                       {(
//                         primaryData.reduce((sum, d) => sum + d.close, 0) /
//                         primaryData.length
//                       ).toLocaleString()}
//                     </div>
//                     <div className="text-xs text-muted-foreground">vs</div>
//                     <div className="font-semibold text-sm">
//                       $
//                       {(
//                         comparisonData.reduce((sum, d) => sum + d.close, 0) /
//                         comparisonData.length
//                       ).toLocaleString()}
//                     </div>
//                   </div>
//                 )}

//                 {comparisonConfig?.showVolume && (
//                   <div className="text-center p-3 bg-blue-50 rounded-lg">
//                     <Volume2 className="h-4 w-4 mx-auto mb-2 text-blue-600" />
//                     <div className="text-xs text-muted-foreground">
//                       Total Volume
//                     </div>
//                     <div className="font-semibold text-sm">
//                       {primaryData
//                         .reduce((sum, d) => sum + d.volume, 0)
//                         .toLocaleString()}
//                     </div>
//                     <div className="text-xs text-muted-foreground">vs</div>
//                     <div className="font-semibold text-sm">
//                       {comparisonData
//                         .reduce((sum, d) => sum + d.volume, 0)
//                         .toLocaleString()}
//                     </div>
//                   </div>
//                 )}

//                 {comparisonConfig?.showLiquidity && (
//                   <div className="text-center p-3 bg-purple-50 rounded-lg">
//                     <Activity className="h-4 w-4 mx-auto mb-2 text-purple-600" />
//                     <div className="text-xs text-muted-foreground">
//                       Avg Liquidity
//                     </div>
//                     <div className="font-semibold text-sm">
//                       $
//                       {(
//                         primaryData.reduce((sum, d) => sum + d.liquidity, 0) /
//                         primaryData.length
//                       ).toLocaleString()}
//                     </div>
//                     <div className="text-xs text-muted-foreground">vs</div>
//                     <div className="font-semibold text-sm">
//                       $
//                       {(
//                         comparisonData.reduce(
//                           (sum, d) => sum + d.liquidity,
//                           0
//                         ) / comparisonData.length
//                       ).toLocaleString()}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     );
//   };

//   return renderSideBySideView();
// }
