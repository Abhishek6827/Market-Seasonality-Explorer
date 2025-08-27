export interface MarketData {
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  volatility: number
  liquidity: number
}

export type TimeFrame = "daily" | "weekly" | "monthly"

export interface FilterOptions {
  symbol: string
  colorScheme: "default" | "dark" | "high-contrast" | "colorblind"
  showVolatility: boolean
  showLiquidity: boolean
  showPerformance: boolean
}

export interface TechnicalIndicator {
  name: string
  value: number
  signal: "buy" | "sell" | "neutral"
}

export interface MarketAlert {
  id: string
  type: "volatility" | "price" | "volume"
  threshold: number
  condition: "above" | "below"
  isActive: boolean
  triggeredAt?: string
}
