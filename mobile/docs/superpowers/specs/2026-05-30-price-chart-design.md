# PriceChart Component Design

**Date:** 2026-05-30
**Status:** Approved

## Overview

Trade Republic-style price chart for the asset detail screen. Line chart with gradient fill, date range filter bar, and scrub-to-inspect interaction. Light theme, no new dependencies.

## Component API

```tsx
interface ChartPoint {
  date: Date;
  price: number;
}

type FilterPeriod = '1D' | '1W' | '1M' | '1Y' | 'Max';

interface PriceChartProps {
  data: ChartPoint[];
  onFilterChange: (period: FilterPeriod) => void;
  activeFilter: FilterPeriod;
  color?: string;   // default: '#0a7ea4' (app tint)
  height?: number;  // SVG chart area height, default: 200
}
```

Filter is controlled: parent owns `activeFilter` state, fetches data per period, passes updated `data` prop.

## Internal Structure

Single file: `components/PriceChart.tsx`

### Subcomponents (internal)

**`PriceDisplay`**
Top section showing price and date. Updates during scrub via `useAnimatedProps` (UI thread, no re-renders). Shows last data point when idle.

**`FilterBar`**
Row of buttons: `1D | 1W | 1M | 1Y | Max`. Active filter bold + underlined. Taps call `onFilterChange`.

**SVG area**
Wrapped in `GestureDetector`. Contains:
- Gradient fill path — color to transparent, vertical, covers area under line
- Line path — smooth cubic bezier curve (TR-style)
- Scrub indicator — vertical `AnimatedLine` + `AnimatedCircle` dot on curve, hidden when idle (`scrubX === -1`)

### Layout (top → bottom)
```
PriceDisplay  (price + date)
FilterBar     (1D 1W 1M 1Y Max)
SVG           (gradient fill + line + scrub indicator)
```

## Path Generation

- Runs on JS thread at render time (layout-time, not animation-time)
- Normalize `ChartPoint[]` → SVG coordinate space `[0, svgWidth] × [0, height]`
- Y-axis: `yMin` padded 5%, `yMax` padded 5%
- Smooth cubic bezier: control points derived from adjacent point slopes (Catmull-Rom style)
- Area path: line path + `L svgWidth,height L 0,height Z`
- Gradient: vertical `LinearGradient`, `color` at 30% opacity (top) → transparent (bottom)

## Scrub Interaction

- `Pan` gesture tracks finger X across SVG width
- `scrubX = useSharedValue(-1)` — `-1` = idle
- Gesture active: clamp X to `[0, svgWidth]`, set `scrubX`
- Gesture end: reset `scrubX = -1`, price display reverts to last point
- `useDerivedValue`: maps `scrubX` → nearest point index → `{ price, date }`
- `PriceDisplay` reads price/date via `useAnimatedProps` — updates on UI thread
- Scrub indicator driven entirely by shared values — zero JS re-renders during scrub

## Dependencies

All already in `package.json`:
- `react-native-svg` — SVG path, gradient, animated elements
- `react-native-reanimated` — shared values, derived values, animated props
- `react-native-gesture-handler` — `GestureDetector`, `Gesture.Pan()`

## File Location

`components/PriceChart.tsx`