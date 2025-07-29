# 🚀 Market Seasonality Explorer

> An advanced interactive calendar application for cryptocurrency market analysis with real-time data visualization, multiple themes, and comprehensive analytics.

![Market Seasonality Explorer](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Market+Seasonality+Explorer)

## 🌟 Features

### 📅 Interactive Calendar Views
- **Daily View**: Individual day analysis with detailed metrics
- **Weekly View**: Week-by-week aggregated data visualization  
- **Monthly View**: Monthly overview with trend analysis
- **Responsive Design**: Optimized for desktop, tablet, and mobile

### 🎨 Advanced Theming System
- **Default Theme**: Standard color scheme for general use
- **High Contrast**: Enhanced accessibility with bold contrasts
- **Colorblind Friendly**: Optimized for color vision deficiencies
- **Monochrome**: Grayscale theme for minimal distraction

### 📊 Data Visualization Layers
- **Volatility Heatmap**: Color-coded volatility indicators
- **Performance Metrics**: Price change visualization with trend indicators
- **Liquidity Indicators**: Volume-based liquidity patterns
- **Multi-layer Support**: Combine multiple data layers simultaneously

### 🔍 Zoom & Navigation
- **4 Zoom Levels**: Small (75%), Normal (100%), Large (115%), X-Large (125%)
- **Keyboard Navigation**: Full keyboard support with arrow keys
- **Touch Gestures**: Swipe navigation on mobile devices
- **Focus Management**: Accessible focus indicators

### 📈 Analytics Dashboard
- **Single Date Analysis**: Detailed breakdown of selected dates
- **Comparison Mode**: Side-by-side analysis of multiple dates
- **Pattern Detection**: Automatic identification of market patterns
- **Live Charts**: Real-time price visualization

### 🔄 Data Management
- **Real-time API Integration**: Live data from Binance API
- **Fallback Data System**: Realistic data generation when API unavailable
- **Export Functionality**: CSV and JSON export options
- **Data Filtering**: Symbol selection and layer filtering

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0 with Vite 7.0.4
- **Styling**: Tailwind CSS 3.4.3 with custom themes
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion 12.23.9
- **Date Handling**: date-fns 4.1.0
- **Charts**: Recharts 3.1.0
- **Icons**: Lucide React 0.525.0
- **Forms**: React Hook Form 7.61.1 with Zod validation
- **Export**: jsPDF 3.0.1 and html2canvas 1.4.1

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
├── public/                     # Static assets
├── src/
│   ├── components/            # React components
│   │   ├── calendar/         # Calendar-specific components
│   │   │   ├── views/       # Daily, Weekly, Monthly views
│   │   │   ├── CalendarGrid.jsx
│   │   │   └── CalendarHeader.jsx
│   │   ├── ui/              # Reusable UI components
│   │   ├── CalendarCell.jsx # Individual calendar cell
│   │   ├── CalendarView.jsx # Main calendar component
│   │   ├── CalendarTooltip.jsx
│   │   ├── MarketDashboard.jsx # Main dashboard
│   │   ├── FilterControls.jsx
│   │   ├── ThemeControls.jsx
│   │   ├── ZoomControls.jsx
│   │   ├── ExportControls.jsx
│   │   └── ErrorBoundary.jsx
│   ├── hooks/                # Custom React hooks
│   │   ├── use-market-data.js
│   │   └── useMediaQuery.js
│   ├── utils/                # Utility functions
│   ├── styles/               # Global styles
│   ├── App.jsx              # Root component
│   └── main.jsx             # Entry point
├── .env.example              # Environment variables template
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── package.json             # Dependencies and scripts
└── README.md               # This file
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
__tests__/
├── components/
│   ├── CalendarCell.test.jsx
│   ├── CalendarView.test.jsx
│   ├── MarketDashboard.test.jsx
│   └── FilterControls.test.jsx
├── hooks/
│   ├── use-market-data.test.js
│   └── useMediaQuery.test.js
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
\`\`\`

## 🔌 API Integration

### Binance API Integration

\`\`\`javascript
// Primary endpoint
GET https://api.binance.com/api/v3/klines

// Parameters
{
  symbol: 'BTCUSDT',
  interval: '1d', // 1d, 1w, 1M
  limit: 90       // Number of data points
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

## 🎯 Assumptions & Design Decisions

### Data Assumptions
1. **Market Hours**: 24/7 crypto market (no weekend gaps)
2. **Data Availability**: Binance API provides sufficient historical data
3. **Time Zones**: All data normalized to UTC
4. **Currency**: Primary focus on USDT pairs

### Design Decisions
1. **Vite + React**: Modern build tool with fast HMR
2. **JavaScript**: Chose JS over TypeScript for rapid prototyping
3. **Tailwind CSS**: Utility-first approach for consistent styling
4. **Radix UI**: Accessible, unstyled components
5. **Mobile-First**: Responsive design prioritizing mobile experience

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
- **Tailwind CSS** (^3.4.3): Utility-first CSS framework
- **Framer Motion** (^12.23.9): Animation library
- **Lucide React** (^0.525.0): Icon library
- **Radix UI**: Headless UI components

### Data & Utilities
- **date-fns** (^4.1.0): Date manipulation library
- **Recharts** (^3.1.0): Chart library
- **React Hook Form** (^7.61.1): Form handling
- **Zod** (^4.0.10): Schema validation

## 🔧 Configuration

### Vite Configuration

\`\`\`javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
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
        // Custom color palette
      },
      animation: {
        // Custom animations
      },
    },
  },
  plugins: [],
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
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
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
\`\`\`

4. **Commit with conventional commits**
\`\`\`bash
git commit -m "feat: add amazing feature"
\`\`\`

5. **Push and create PR**

### Code Standards
- **ESLint**: Follow configured rules
- **Prettier**: Auto-format on save
- **Testing**: Comprehensive test coverage
- **Documentation**: Clear component documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Binance API**: For providing free market data
- **React Team**: For the amazing framework
- **Vite**: For the lightning-fast build tool
- **Tailwind CSS**: For the utility-first approach
- **Radix UI**: For accessible components

---

**Built with ❤️ using Vite + React**

*Last updated: January 2024*
