# 🚀 Market Seasonality Explorer

> An advanced interactive calendar application for cryptocurrency market analysis with real-time data visualization, multiple themes, and comprehensive analytics.

![Market Seasonality Explorer](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Market+Seasonality+Explorer)

## 🌟 Features

### 📅 Interactive Calendar Views

- **Daily View**: Individual day analysis with detailed OHLC metrics, volatility indicators, and volume data
- **Weekly View**: Week-by-week aggregated data with performance summaries and trend analysis
- **Monthly View**: Monthly overview with comprehensive trend analysis and year-over-year comparisons
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🎨 Advanced Theming System

- **Default Theme**: Standard color scheme for general market analysis
- **High Contrast**: Enhanced accessibility with bold contrasts for better visibility
- **Colorblind Friendly**: Optimized color palette for users with color vision deficiencies
- **Monochrome**: Grayscale theme for minimal distraction and professional presentations

### 📊 Data Visualization Layers

- **Volatility Heatmap**: Color-coded volatility indicators with customizable thresholds
- **Performance Metrics**: Price change visualization with trend indicators and percentage displays
- **Liquidity Indicators**: Volume-based liquidity patterns with visual intensity mapping
- **Multi-layer Support**: Combine multiple data layers simultaneously for comprehensive analysis

### 🔍 Zoom & Navigation

- **4 Zoom Levels**: Small (75%), Normal (100%), Large (115%), X-Large (125%)
- **Keyboard Navigation**: Full keyboard support with arrow keys, Home, Escape, and Enter
- **Touch Gestures**: Swipe navigation on mobile devices with haptic feedback
- **Focus Management**: Accessible focus indicators and screen reader support

### 📈 Analytics Dashboard

- **Single Date Analysis**: Detailed breakdown of OHLC data, volatility, and volume metrics
- **Comparison Mode**: Side-by-side analysis of multiple dates with difference calculations
- **Pattern Detection**: Automatic identification of market patterns and anomalies
- **Live Charts**: Real-time price visualization with technical indicators

### 🔄 Data Management

- **Real-time API Integration**: Live data from Binance API with 30-second refresh intervals
- **Fallback Data System**: Realistic data generation with seasonal patterns when API unavailable
- **Export Functionality**: CSV and JSON export options with metadata
- **Data Filtering**: Symbol selection and visualization layer filtering

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0 with Vite 7.0.4
- **Styling**: Tailwind CSS 3.4.3 with custom themes
- **UI Components**: Radix UI primitives for accessibility
- **Animations**: Framer Motion 12.23.9 for smooth transitions
- **Date Handling**: date-fns 4.1.0 for robust date operations
- **Charts**: Recharts 3.1.0 for data visualization
- **Icons**: Lucide React 0.525.0 for consistent iconography
- **Forms**: React Hook Form 7.61.1 with Zod validation
- **Export**: jsPDF 3.0.1 and html2canvas 1.4.1 for data export

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/market-seasonality-explorer.git
   cd market-seasonality-explorer
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install

# or

yarn install
\`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

Edit `.env.local`:
\`\`\`env
VITE_BINANCE_API_URL=https://api.binance.com/api/v3
VITE_DEFAULT_SYMBOL=BTCUSDT
VITE_REFRESH_INTERVAL=30000
\`\`\`

4. **Start development server**
   \`\`\`bash
   npm run dev

# or

yarn dev
\`\`\`

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

\`\`\`bash
npm run build
npm run preview
\`\`\`

## 📁 Project Structure

\`\`\`
market-seasonality-explorer/
├── public/ # Static assets
├── src/
│ ├── components/ # React components
│ │ ├── calendar/ # Calendar-specific components
│ │ │ ├── views/ # Daily, Weekly, Monthly views
│ │ │ ├── CalendarGrid.jsx
│ │ │ └── CalendarHeader.jsx
│ │ ├── ui/ # Reusable UI components
│ │ ├── CalendarCell.jsx # Individual calendar cell
│ │ ├── CalendarView.jsx # Main calendar component
│ │ ├── CalendarTooltip.jsx
│ │ ├── MarketDashboard.jsx # Main dashboard
│ │ ├── FilterControls.jsx
│ │ ├── ThemeControls.jsx
│ │ ├── ZoomControls.jsx
│ │ ├── ExportControls.jsx
│ │ └── ErrorBoundary.jsx
│ ├── hooks/ # Custom React hooks
│ │ ├── use-market-data.js
│ │ └── useMediaQuery.js
│ ├── utils/ # Utility functions
│ ├── styles/ # Global styles
│ ├── App.jsx # Root component
│ └── main.jsx # Entry point
├── .env.example # Environment variables template
├── vite.config.js # Vite configuration
├── tailwind.config.js # Tailwind configuration
├── package.json # Dependencies and scripts
└── README.md # This file
\`\`\`

## 🎯 Usage Examples

### Basic Calendar Navigation

\`\`\`javascript
// Navigate through different time frames
const [timeFrame, setTimeFrame] = useState('daily')

// Switch between daily, weekly, monthly views
<Tabs value={timeFrame} onValueChange={setTimeFrame}>
<TabsTrigger value="daily">Daily</TabsTrigger>
<TabsTrigger value="weekly">Weekly</TabsTrigger>
<TabsTrigger value="monthly">Monthly</TabsTrigger>
</Tabs>
\`\`\`

### Theme Customization

\`\`\`javascript
// Apply different themes
const [currentTheme, setCurrentTheme] = useState(COLOR_SCHEMES.default)

// Theme options: default, highContrast, colorblindFriendly, monochrome
<ThemeControls onThemeChange={setCurrentTheme} />
\`\`\`

### Data Export

\`\`\`javascript
// Export selected data
<ExportControls 
  data={marketData}
  selectedDate={selectedDate}
  selectedDates={selectedDates}
  timeFrame={timeFrame}
  symbol="BTCUSDT"
/>
\`\`\`

## 🧪 Testing

### Running Tests

\`\`\`bash

# Run all tests

npm test

# Run tests in watch mode

npm run test:watch

# Run tests with coverage

npm run test:coverage
\`\`\`

### Test Structure

\`\`\`
**tests**/
├── components/
│ ├── CalendarCell.test.jsx
│ ├── CalendarView.test.jsx
│ ├── MarketDashboard.test.jsx
│ └── FilterControls.test.jsx
├── hooks/
│ ├── use-market-data.test.js
│ └── useMediaQuery.test.js
└── utils/
└── data-processing.test.js
\`\`\`

### Critical Test Cases

#### CalendarCell Component

\`\`\`javascript
test('renders volatility heatmap correctly', () => {
const mockData = {
volatility: 0.05,
close: 50000,
open: 49000
}
render(<CalendarCell data={mockData} filters={{ showVolatility: true }} />)
expect(screen.getByText('Vol: 5.0%')).toBeInTheDocument()
})

test('applies theme colors correctly', () => {
const highContrastTheme = COLOR_SCHEMES.highContrast
render(<CalendarCell currentTheme={highContrastTheme} data={mockData} />)
// Assert theme-specific styling is applied
})
\`\`\`

#### useMarketData Hook

\`\`\`javascript
test('fetches data from Binance API', async () => {
const { result } = renderHook(() => useMarketData('BTCUSDT', 'daily'))
await waitFor(() => {
expect(result.current.data).toHaveLength(90)
expect(result.current.loading).toBe(false)
})
})

test('generates fallback data when API fails', async () => {
global.fetch = jest.fn().mockRejectedValue(new Error('API Error'))

const { result } = renderHook(() => useMarketData('BTCUSDT', 'daily'))
await waitFor(() => {
expect(result.current.data).toHaveLength(365)
expect(result.current.error).toBeNull()
})
})
\`\`\`

### Edge Cases Tested

1. **Network Failures**: API unavailable, timeout scenarios
2. **Invalid Data**: Malformed API responses, missing fields
3. **Extreme Values**: Very high/low volatility, zero volume
4. **Date Boundaries**: Leap years, month transitions, weekends
5. **Mobile Interactions**: Touch gestures, screen rotation
6. **Accessibility**: Screen readers, keyboard navigation
7. **Performance**: Large datasets, rapid interactions

## 🔌 API Integration

### Binance API Integration

\`\`\`javascript
// Primary endpoint
GET https://api.binance.com/api/v3/klines

// Parameters
{
symbol: 'BTCUSDT',
interval: '1d', // 1d, 1w, 1M
limit: 90 // Number of data points
}
\`\`\`

### Data Transformation

\`\`\`javascript
// Binance format: [timestamp, open, high, low, close, volume, ...]
// Application format:
{
timestamp: '2024-01-01T00:00:00.000Z',
open: 45000.00,
high: 46000.00,
low: 44000.00,
close: 45500.00,
volume: 1234567,
volatility: 0.025,
liquidity: 1111110.15,
change: 500.00,
priceChange: 500.00,
priceChangePercent: 1.11
}
\`\`\`

### Fallback Data System

When the API is unavailable, the system generates realistic fallback data:

\`\`\`javascript
const generateFallbackData = (symbol, timeFrame) => {
// Seasonal patterns
const seasonalMultiplier = 1 + Math.sin((dayOfYear / 365) _ 2 _ Math.PI) \* 0.1

// Weekly patterns
const weeklyPattern = 1 + Math.sin((date.getDay() / 7) _ 2 _ Math.PI) \* 0.05

// Realistic OHLC generation with proper change calculations
const basePrice = 45000 + seasonalMultiplier \* weeklyPattern
// ... additional calculations for volatility and volume
}
\`\`\`

## 🎯 Assumptions & Design Decisions

### Data Assumptions

1. **Market Hours**: 24/7 crypto market (no weekend gaps)
2. **Data Availability**: Binance API provides sufficient historical data
3. **Time Zones**: All data normalized to UTC
4. **Currency**: Primary focus on USDT pairs
5. **Data Quality**: API data is accurate and doesn't require extensive validation

### Design Decisions

1. **Vite + React**: Modern build tool with fast HMR for development efficiency
2. **JavaScript**: Chose JS over TypeScript for rapid prototyping and simplicity
3. **Tailwind CSS**: Utility-first approach for consistent styling and rapid development
4. **Radix UI**: Collection of headless UI components for accessibility
5. **Mobile-First**: Responsive design prioritizing mobile experience
6. **Component Architecture**: Modular components for maintainability and reusability

### Technical Assumptions

1. **Browser Support**: Modern browsers with ES6+ support
2. **JavaScript Enabled**: Application requires JavaScript
3. **Network**: Stable internet connection for API calls
4. **Screen Size**: Minimum 320px width support
5. **Touch Support**: Assumes touch capability on mobile devices

## 📚 Libraries & Dependencies

### Core Dependencies

\`\`\`json
{
"react": "^19.1.0",
"react-dom": "^19.1.0",
"vite": "^7.0.4"
}
\`\`\`

### UI & Styling

- **Tailwind CSS** (^3.4.3): Utility-first CSS framework for rapid styling
- **Framer Motion** (^12.23.9): Animation library for smooth transitions
- **Lucide React** (^0.525.0): Icon library with consistent design
- **Radix UI**: Collection of headless UI components for accessibility

### Data & Utilities

- **date-fns** (^4.1.0): Modern date manipulation library
- **Recharts** (^3.1.0): Composable charting library for React
- **React Hook Form** (^7.61.1): Performant forms with easy validation
- **Zod** (^4.0.10): TypeScript-first schema validation

### Why These Libraries?

#### Tailwind CSS

- **Pros**: Rapid development, consistent design system, small bundle size
- **Cons**: Learning curve, verbose HTML classes
- **Alternative Considered**: Styled Components, Material-UI

#### Framer Motion

- **Pros**: Declarative animations, great performance, React-first approach
- **Cons**: Bundle size impact for simple animations
- **Alternative Considered**: React Spring, CSS animations

#### date-fns

- **Pros**: Modular, tree-shakeable, immutable, comprehensive
- **Cons**: Larger than some alternatives
- **Alternative Considered**: Day.js, Moment.js

## 🔧 Configuration

### Vite Configuration

\`\`\`javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
plugins: [react()],
server: {
port: 5173,
host: true
},
build: {
outDir: 'dist',
sourcemap: true
},
resolve: {
alias: {
'@': path.resolve(\_\_dirname, './src'),
},
},
})
\`\`\`

### Tailwind Configuration

\`\`\`javascript
// tailwind.config.js
module.exports = {
content: [
"./index.html",
"./src/**/*.{js,ts,jsx,tsx}",
],
theme: {
extend: {
colors: {
// Custom color palette for themes
},
animation: {
// Custom animations for smooth interactions
},
},
},
plugins: [require("tailwindcss-animate")],
}
\`\`\`

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**
   \`\`\`bash
   npm i -g vercel
   vercel --prod
   \`\`\`

2. **Environment Variables**
   Set in Vercel dashboard:

- `VITE_BINANCE_API_URL`
- `VITE_DEFAULT_SYMBOL`
- `VITE_REFRESH_INTERVAL`

### Netlify Deployment

1. **Build Settings**

- Build Command: `npm run build`
- Publish Directory: `dist`

2. **Deploy**
   \`\`\`bash
   npm run build
   netlify deploy --prod --dir=dist
   \`\`\`

### Docker Deployment

\`\`\`dockerfile

# Dockerfile

FROM node:18-alpine AS builder

WORKDIR /app
COPY package\*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

\`\`\`bash

# Build and run

docker build -t market-explorer .
docker run -p 80:80 market-explorer
\`\`\`

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create feature branch**
   \`\`\`bash
   git checkout -b feature/amazing-feature
   \`\`\`

3. **Make changes and test**
   \`\`\`bash
   npm run dev
   npm run lint
   npm test
   \`\`\`

4. **Commit with conventional commits**
   \`\`\`bash
   git commit -m "feat: add amazing feature"
   \`\`\`

5. **Push and create PR**

### Code Standards

- **ESLint**: Follow configured rules for code quality
- **Prettier**: Auto-format on save for consistency
- **Testing**: Comprehensive test coverage for critical components
- **Documentation**: Clear component documentation with JSDoc

### Commit Convention

\`\`\`
feat: new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code restructuring
test: adding tests
chore: maintenance tasks
\`\`\`

## 📄 License

## 🙏 Acknowledgments

- **Binance API**: For providing free, reliable market data
- **React Team**: For the amazing framework and ecosystem
- **Vite**: For the lightning-fast build tool and development experience
- **Tailwind CSS**: For the utility-first approach to styling
- **Radix UI**: For accessible, unstyled components
- **Open Source Community**: For the incredible libraries and tools

---

**Built with ❤️ using Vite + React**
