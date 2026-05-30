# PriceChart Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Trade Republic-style price chart with gradient fill, filter bar (1D/1W/1M/1Y/Max), and scrub-to-inspect interaction driven entirely on the UI thread.

**Architecture:** Single file `components/PriceChart.tsx` containing three internal components (`FilterBar`, `PriceDisplay`, `PriceChart`). Path math runs on JS thread at render time via `useMemo`. Scrub interaction uses Reanimated shared values + `useAnimatedProps` — zero JS re-renders during finger drag.

**Tech Stack:** react-native-svg, react-native-reanimated ~4.1.1, react-native-gesture-handler ~2.28.0 (all already in package.json — no new deps)

---

### Task 1: Types + SVG path utilities

**Files:**
- Create: `components/PriceChart.tsx`

No test framework is configured — verify via TypeScript.

- [ ] **Step 1: Create `components/PriceChart.tsx` with types and pure path utilities**

```tsx
import React, { useMemo, useState, useEffect } from 'react';
import {
  LayoutChangeEvent,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Stop,
  Svg,
} from 'react-native-svg';

export interface ChartPoint {
  date: Date;
  price: number;
}

export type FilterPeriod = '1D' | '1W' | '1M' | '1Y' | 'Max';

export interface PriceChartProps {
  data: ChartPoint[];
  onFilterChange: (period: FilterPeriod) => void;
  activeFilter: FilterPeriod;
  color?: string;
  height?: number;
}

const FILTER_PERIODS: FilterPeriod[] = ['1D', '1W', '1M', '1Y', 'Max'];

function normalizePoints(
  data: ChartPoint[],
  width: number,
  height: number,
): { x: number; y: number }[] {
  if (data.length < 2) return [];
  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;
  const padding = priceRange * 0.05;
  const yMin = minPrice - padding;
  const yMax = maxPrice + padding;
  return data.map((point, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((point.price - yMin) / (yMax - yMin)) * height,
  }));
}

function buildLinePath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function buildAreaPath(points: { x: number; y: number }[], height: number): string {
  if (points.length < 2) return '';
  const linePath = buildLinePath(points);
  const last = points[points.length - 1];
  const first = points[0];
  return `${linePath} L ${last.x} ${height} L ${first.x} ${height} Z`;
}

function formatDateForFilter(date: Date, filter: FilterPeriod): string {
  if (filter === '1D') {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (filter === '1W') {
    return date.toLocaleDateString([], { weekday: 'short' }) +
      ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (filter === '1M') {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors on `components/PriceChart.tsx`

---

### Task 2: FilterBar + PriceDisplay internal components

**Files:**
- Modify: `components/PriceChart.tsx` (append below the utilities)

- [ ] **Step 1: Append `FilterBar` to `PriceChart.tsx`**

```tsx
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface FilterBarProps {
  active: FilterPeriod;
  onSelect: (p: FilterPeriod) => void;
}

function FilterBar({ active, onSelect }: FilterBarProps) {
  return (
    <View style={filterBarStyles.row}>
      {FILTER_PERIODS.map(period => (
        <TouchableOpacity
          key={period}
          style={filterBarStyles.button}
          onPress={() => onSelect(period)}
        >
          <Text
            style={[
              filterBarStyles.label,
              active === period && filterBarStyles.labelActive,
            ]}
          >
            {period}
          </Text>
          {active === period && <View style={filterBarStyles.underline} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const filterBarStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 12,
  },
  button: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 40,
  },
  label: {
    fontSize: 14,
    color: '#687076',
    fontWeight: '500',
  },
  labelActive: {
    color: '#0a7ea4',
    fontWeight: '700',
  },
  underline: {
    height: 2,
    width: '100%',
    backgroundColor: '#0a7ea4',
    borderRadius: 1,
    marginTop: 2,
  },
});
```

- [ ] **Step 2: Append `PriceDisplay` to `PriceChart.tsx`**

```tsx
interface PriceDisplayProps {
  priceProps: any;
  dateProps: any;
}

function PriceDisplay({ priceProps, dateProps }: PriceDisplayProps) {
  return (
    <View style={priceDisplayStyles.container}>
      <AnimatedTextInput
        animatedProps={priceProps}
        editable={false}
        style={priceDisplayStyles.price}
      />
      <AnimatedTextInput
        animatedProps={dateProps}
        editable={false}
        style={priceDisplayStyles.date}
      />
    </View>
  );
}

const priceDisplayStyles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#11181C',
    borderWidth: 0,
    padding: 0,
    backgroundColor: 'transparent',
  },
  date: {
    fontSize: 13,
    color: '#687076',
    marginTop: 2,
    borderWidth: 0,
    padding: 0,
    backgroundColor: 'transparent',
  },
});
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

---

### Task 3: Main PriceChart component with static chart + scrub

**Files:**
- Modify: `components/PriceChart.tsx` (append PriceChart component at end of file)

- [ ] **Step 1: Append animated SVG components + `PriceChart` to `PriceChart.tsx`**

```tsx
const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function PriceChart({
  data,
  onFilterChange,
  activeFilter,
  color = '#0a7ea4',
  height = 200,
}: PriceChartProps) {
  const [svgWidth, setSvgWidth] = useState(0);
  const svgWidthSV = useSharedValue(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setSvgWidth(w);
    svgWidthSV.value = w;
  };

  const points = useMemo(
    () => (svgWidth > 0 ? normalizePoints(data, svgWidth, height) : []),
    [data, svgWidth, height],
  );

  const linePath = useMemo(() => buildLinePath(points), [points]);
  const areaPath = useMemo(() => buildAreaPath(points, height), [points, height]);

  // UI-thread arrays — must be SharedValues, not plain JS (gesture callbacks run on UI thread)
  const pointXPositions = useSharedValue<number[]>([]);
  const pointYPositions = useSharedValue<number[]>([]);
  const priceValues = useSharedValue<number[]>([]);
  const dateStrings = useSharedValue<string[]>([]);

  useEffect(() => {
    pointXPositions.value = points.map(p => p.x);
    pointYPositions.value = points.map(p => p.y);
    priceValues.value = data.map(d => d.price);
    dateStrings.value = data.map(d => formatDateForFilter(d.date, activeFilter));
  }, [points, data, activeFilter]);

  const scrubX = useSharedValue(-1);

  const scrubIndex = useDerivedValue(() => {
    const x = scrubX.value;
    if (x < 0) return -1;
    const positions = pointXPositions.value;
    if (positions.length === 0) return -1;
    let nearest = 0;
    let minDist = Math.abs(positions[0] - x);
    for (let i = 1; i < positions.length; i++) {
      const dist = Math.abs(positions[i] - x);
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    }
    return nearest;
  });

  const displayPrice = useDerivedValue(() => {
    const prices = priceValues.value;
    if (prices.length === 0) return '';
    const i = scrubIndex.value < 0 ? prices.length - 1 : scrubIndex.value;
    return prices[i].toFixed(2);
  });

  const displayDate = useDerivedValue(() => {
    const dates = dateStrings.value;
    if (dates.length === 0) return '';
    const i = scrubIndex.value < 0 ? dates.length - 1 : scrubIndex.value;
    return dates[i];
  });

  const scrubDotX = useDerivedValue(() => {
    const idx = scrubIndex.value;
    if (idx < 0) return -100;
    const xs = pointXPositions.value;
    return xs.length > 0 ? xs[idx] : -100;
  });

  const scrubDotY = useDerivedValue(() => {
    const idx = scrubIndex.value;
    if (idx < 0) return -100;
    const ys = pointYPositions.value;
    return ys.length > 0 ? ys[idx] : -100;
  });

  const panGesture = Gesture.Pan()
    .onBegin(e => {
      scrubX.value = Math.max(0, Math.min(e.x, svgWidthSV.value - 1));
    })
    .onUpdate(e => {
      scrubX.value = Math.max(0, Math.min(e.x, svgWidthSV.value - 1));
    })
    .onEnd(() => {
      scrubX.value = -1;
    });

  const priceAnimatedProps = useAnimatedProps(() => ({
    text: displayPrice.value,
    defaultValue: '',
  } as any));

  const dateAnimatedProps = useAnimatedProps(() => ({
    text: displayDate.value,
    defaultValue: '',
  } as any));

  const scrubLineProps = useAnimatedProps(() => ({
    x1: scrubDotX.value,
    x2: scrubDotX.value,
    y1: 0,
    y2: height,
  }));

  const scrubCircleProps = useAnimatedProps(() => ({
    cx: scrubDotX.value,
    cy: scrubDotY.value,
  }));

  return (
    <View style={chartStyles.container}>
      <PriceDisplay priceProps={priceAnimatedProps} dateProps={dateAnimatedProps} />
      <FilterBar active={activeFilter} onSelect={onFilterChange} />
      <View style={[chartStyles.chartArea, { height }]} onLayout={onLayout}>
        {svgWidth > 0 && (
          <GestureDetector gesture={panGesture}>
            <Svg width={svgWidth} height={height}>
              <Defs>
                <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={color} stopOpacity="0.25" />
                  <Stop offset="1" stopColor={color} stopOpacity="0" />
                </LinearGradient>
              </Defs>
              <Path d={areaPath} fill="url(#chartGradient)" />
              <Path d={linePath} stroke={color} strokeWidth={2} fill="none" />
              <AnimatedLine
                animatedProps={scrubLineProps}
                stroke="#11181C"
                strokeWidth={1}
                strokeDasharray="4 3"
                opacity={0.35}
              />
              <AnimatedCircle
                animatedProps={scrubCircleProps}
                r={5}
                fill={color}
                stroke="#fff"
                strokeWidth={2}
              />
            </Svg>
          </GestureDetector>
        )}
      </View>
    </View>
  );
}

const chartStyles = StyleSheet.create({
  container: {
    width: '100%',
  },
  chartArea: {
    width: '100%',
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/PriceChart.tsx
git commit -m "feat: add PriceChart component with scrub interaction"
```

---

### Task 4: Wire PriceChart into asset modal

**Files:**
- Modify: `app/asset.tsx`

- [ ] **Step 1: Replace `app/asset.tsx` contents**

```tsx
import { useLocalSearchParams } from 'expo-router/build/hooks';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PriceChart, { ChartPoint, FilterPeriod } from '../components/PriceChart';

const MOCK_DATA: ChartPoint[] = Array.from({ length: 60 }, (_, i) => ({
  date: new Date(Date.now() - (59 - i) * 24 * 60 * 60 * 1000),
  price: 100 + Math.sin(i / 5) * 10 + i * 0.5 + Math.random() * 3,
}));

const AssetModal = () => {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const [activeFilter, setActiveFilter] = useState<FilterPeriod>('1M');
  const [data] = useState<ChartPoint[]>(MOCK_DATA);

  return (
    <View style={styles.container}>
      <Text style={styles.symbol}>{symbol}</Text>
      <PriceChart
        data={data}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
    </View>
  );
};

export default AssetModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f6f6f6',
  },
  symbol: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#11181C',
  },
});
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Run app and verify manually**

Run: `npx expo start --ios`

Navigate to an asset modal. Verify:
1. Symbol name renders at top
2. Price + date show for last data point (idle state)
3. Filter buttons render — active one is bold + underlined in tint color
4. Smooth curved line with gradient fill below renders
5. Drag finger across chart → dashed vertical line + filled dot track nearest point
6. Price and date update during drag
7. Release finger → indicator disappears, price/date revert to last point
8. Tap different filter button → `activeFilter` changes, button highlights

- [ ] **Step 4: Commit**

```bash
git add app/asset.tsx
git commit -m "feat: wire PriceChart into asset modal with mock data"
```