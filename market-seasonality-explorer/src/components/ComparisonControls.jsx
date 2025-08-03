// "use client";

// import { useState } from "react";
// import { Button } from "./ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "./ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Badge } from "./ui/badge";
// import { Switch } from "./ui/switch";
// import { Label } from "./ui/label";
// import { GitCompare, Calendar, TrendingUp, Info } from "lucide-react";
// import { format, subDays } from "date-fns";

// const COMPARISON_PRESETS = [
//   {
//     value: "week-over-week",
//     label: "Week over Week",
//     offset: (date) => subDays(date, 7),
//     description: "Compare with 7 days ago",
//   },
//   {
//     value: "month-over-month",
//     label: "Month over Month",
//     offset: (date) => subDays(date, 30),
//     description: "Compare with 30 days ago",
//   },
//   {
//     value: "year-over-year",
//     label: "Year over Year",
//     offset: (date) => subDays(date, 365),
//     description: "Compare with 365 days ago",
//   },
//   {
//     value: "custom",
//     label: "Custom Range",
//     offset: null,
//     description: "Select custom date range",
//   },
// ];

// const CRYPTO_SYMBOLS = [
//   { value: "BTCUSDT", label: "Bitcoin (BTC/USDT)" },
//   { value: "ETHUSDT", label: "Ethereum (ETH/USDT)" },
//   { value: "BNBUSDT", label: "Binance Coin (BNB/USDT)" },
//   { value: "ADAUSDT", label: "Cardano (ADA/USDT)" },
//   { value: "SOLUSDT", label: "Solana (SOL/USDT)" },
// ];

// export function ComparisonControls({
//   isComparisonMode,
//   onToggleComparison,
//   comparisonConfig,
//   onComparisonConfigChange,
//   currentSymbol,
//   selectedDateRange,
//   className,
// }) {
//   const [comparisonType, setComparisonType] = useState("time-period");

//   const handlePresetChange = (preset) => {
//     const config = COMPARISON_PRESETS.find((p) => p.value === preset);
//     if (config && config.offset && preset !== "custom") {
//       const baseDate = new Date();
//       const comparisonDate = config.offset(baseDate);
//       const newConfig = {
//         ...comparisonConfig,
//         preset,
//         baseDate,
//         comparisonDate,
//         type: "time-period",
//       };
//       onComparisonConfigChange(newConfig);
//     } else if (preset === "custom") {
//       const newConfig = {
//         ...comparisonConfig,
//         preset: "custom",
//         type: "time-period",
//       };
//       onComparisonConfigChange(newConfig);
//     }
//   };

//   const handleSymbolComparison = (symbol) => {
//     const newConfig = {
//       ...comparisonConfig,
//       comparisonSymbol: symbol,
//       type: "symbol",
//     };
//     onComparisonConfigChange(newConfig);
//   };

//   const handleToggle = (checked) => {
//     onToggleComparison(checked);
//   };

//   const getComparisonDescription = () => {
//     if (!isComparisonMode) {
//       return "Enable to compare different time periods by selecting date ranges";
//     }

//     if (selectedDateRange && selectedDateRange.length === 2) {
//       const days = Math.ceil(
//         (selectedDateRange[1] - selectedDateRange[0]) / (1000 * 60 * 60 * 24)
//       );
//       return `Selected ${days} days: ${format(
//         selectedDateRange[0],
//         "MMM dd"
//       )} - ${format(selectedDateRange[1], "MMM dd, yyyy")}`;
//     }

//     return "Select a date range on the calendar to start comparison";
//   };

//   return (
//     <Card
//       className={`border-2 ${
//         isComparisonMode ? "border-blue-500 bg-blue-50" : "border-gray-200"
//       } ${className}`}
//     >
//       <CardHeader className="pb-3">
//         <div className="flex items-center justify-between">
//           <CardTitle className="text-lg flex items-center space-x-2">
//             <GitCompare className="h-5 w-5" />
//             <span>Comparison Analysis</span>
//             {isComparisonMode && <Badge variant="secondary">Active</Badge>}
//           </CardTitle>
//           <Switch checked={isComparisonMode} onCheckedChange={handleToggle} />
//         </div>
//         <p className="text-sm text-muted-foreground">
//           {getComparisonDescription()}
//         </p>
//       </CardHeader>

//       {isComparisonMode && (
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <Label>Comparison Type</Label>
//             <div className="flex space-x-2">
//               <Button
//                 variant={
//                   comparisonType === "time-period" ? "default" : "outline"
//                 }
//                 size="sm"
//                 onClick={() => setComparisonType("time-period")}
//               >
//                 <Calendar className="h-4 w-4 mr-2" />
//                 Time Period
//               </Button>
//               <Button
//                 variant={comparisonType === "symbol" ? "default" : "outline"}
//                 size="sm"
//                 onClick={() => setComparisonType("symbol")}
//               >
//                 <TrendingUp className="h-4 w-4 mr-2" />
//                 Symbol
//               </Button>
//             </div>
//           </div>

//           {/* Time Period Comparison */}
//           {comparisonType === "time-period" && (
//             <div className="space-y-3">
//               <div>
//                 <Label htmlFor="comparison-preset">Quick Presets</Label>
//                 <Select
//                   value={comparisonConfig?.preset || ""}
//                   onValueChange={handlePresetChange}
//                 >
//                   <SelectTrigger id="comparison-preset">
//                     <SelectValue placeholder="Select comparison period" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {COMPARISON_PRESETS.map((preset) => (
//                       <SelectItem key={preset.value} value={preset.value}>
//                         <div>
//                           <div>{preset.label}</div>
//                           <div className="text-xs text-muted-foreground">
//                             {preset.description}
//                           </div>
//                         </div>
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {comparisonConfig?.preset &&
//                 comparisonConfig.preset !== "custom" && (
//                   <div className="p-3 bg-blue-100 rounded-lg border border-blue-300">
//                     <div className="text-sm">
//                       <div className="font-medium">Comparing:</div>
//                       <div className="flex items-center justify-between mt-1">
//                         <Badge variant="outline">
//                           Current: {format(new Date(), "MMM yyyy")}
//                         </Badge>
//                         <span className="text-muted-foreground">vs</span>
//                         <Badge variant="outline">
//                           Previous:{" "}
//                           {comparisonConfig.comparisonDate &&
//                             format(comparisonConfig.comparisonDate, "MMM yyyy")}
//                         </Badge>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//             </div>
//           )}

//           {/* Symbol Comparison */}
//           {comparisonType === "symbol" && (
//             <div className="space-y-3">
//               <div>
//                 <Label htmlFor="comparison-symbol">Compare Symbol</Label>
//                 <Select
//                   value={comparisonConfig?.comparisonSymbol || ""}
//                   onValueChange={handleSymbolComparison}
//                 >
//                   <SelectTrigger id="comparison-symbol">
//                     <SelectValue placeholder="Select symbol to compare" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {CRYPTO_SYMBOLS.filter(
//                       (s) => s.value !== currentSymbol
//                     ).map((symbol) => (
//                       <SelectItem key={symbol.value} value={symbol.value}>
//                         {symbol.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {comparisonConfig?.comparisonSymbol && (
//                 <div className="p-3 bg-green-100 rounded-lg border border-green-300">
//                   <div className="text-sm">
//                     <div className="font-medium">Comparing:</div>
//                     <div className="flex items-center justify-between mt-1">
//                       <Badge variant="outline">
//                         {
//                           CRYPTO_SYMBOLS.find((s) => s.value === currentSymbol)
//                             ?.label
//                         }
//                       </Badge>
//                       <span className="text-muted-foreground">vs</span>
//                       <Badge variant="outline">
//                         {
//                           CRYPTO_SYMBOLS.find(
//                             (s) => s.value === comparisonConfig.comparisonSymbol
//                           )?.label
//                         }
//                       </Badge>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Comparison Metrics */}
//           {selectedDateRange && selectedDateRange.length === 2 && (
//             <div className="p-3 bg-blue-100 rounded-lg border border-blue-300">
//               <div className="flex items-center space-x-2 mb-2">
//                 <Info className="h-4 w-4 text-blue-600" />
//                 <span className="text-sm font-medium text-blue-900">
//                   How Comparison Works
//                 </span>
//               </div>
//               <div className="text-sm text-blue-800 space-y-1">
//                 <div>
//                   • <strong>Current Period:</strong> Your selected date range
//                 </div>
//                 <div>
//                   • <strong>Previous Period:</strong> Same number of days,
//                   immediately before your selection
//                 </div>
//                 <div>
//                   • <strong>Analysis:</strong> Shows differences in price,
//                   volatility, and volume
//                 </div>
//               </div>
//             </div>
//           )}

//           {selectedDateRange && selectedDateRange.length === 2 && (
//             <div className="p-3 bg-green-100 rounded-lg border border-green-300">
//               <div className="text-sm">
//                 <div className="font-medium text-green-900 mb-1">
//                   Active Comparison:
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <Badge variant="outline" className="bg-white">
//                     Current: {format(selectedDateRange[0], "MMM dd")} -{" "}
//                     {format(selectedDateRange[1], "MMM dd")}
//                   </Badge>
//                   <span className="text-muted-foreground text-xs">vs</span>
//                   <Badge variant="outline" className="bg-white">
//                     Previous: Same period length
//                   </Badge>
//                 </div>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       )}
//     </Card>
//   );
// }
