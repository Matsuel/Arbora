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

export interface MarketDetails {
  date: string;
  price: number;
}

export type FilterPeriod = '1D' | '1W' | '1M' | '1Y' | 'Max';

export interface PriceChartProps {
  data: MarketDetails[];
  onFilterChange: (period: FilterPeriod) => void;
  activeFilter: FilterPeriod;
  color?: string;
  height?: number;
}

const FILTER_PERIODS: FilterPeriod[] = ['1D', '1W', '1M', '1Y', 'Max'];

function normalizePoints(
  data: MarketDetails[],
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
    paddingVertical: 8,
    paddingHorizontal: 8,
    minWidth: 40,
  },
  label: {
    fontSize: 14,
    color: '#687076',
    fontWeight: '500',
  },
  labelActive: {
    color: '#000',
    fontWeight: '700',
  },
  underline: {
    height: 2,
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 1,
    marginTop: 2,
  },
});

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
        pointerEvents="none"
        style={priceDisplayStyles.price}
      />
      <AnimatedTextInput
        animatedProps={dateProps}
        editable={false}
        pointerEvents="none"
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

const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function PriceChart({
  data,
  onFilterChange,
  activeFilter,
  color = '#000',
  height = 200,
}: PriceChartProps) {
  const [svgWidth, setSvgWidth] = useState(0);
  const gradientId = React.useRef(`chartGradient_${Math.random().toString(36).slice(2)}`).current;
  const svgWidthSV = useSharedValue(0);
  const heightSV = useSharedValue(height);

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

  const scrubX = useSharedValue(-1);

  useEffect(() => {
    scrubX.value = -1;
    pointXPositions.value = points.map(p => p.x);
    pointYPositions.value = points.map(p => p.y);
    priceValues.value = data.map(d => d.price);
    dateStrings.value = data.map(d => formatDateForFilter(new Date(d.date), activeFilter));
  }, [points, data, activeFilter, scrubX, pointXPositions, pointYPositions, priceValues, dateStrings]);

  useEffect(() => {
    heightSV.value = height;
  }, [height, heightSV]);

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
    })
    .onFinalize(() => {
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
    y2: heightSV.value,
    opacity: scrubIndex.value >= 0 ? 0.35 : 0,
  }));

  const scrubCircleProps = useAnimatedProps(() => ({
    cx: scrubDotX.value,
    cy: scrubDotY.value,
    opacity: scrubIndex.value >= 0 ? 1 : 0,
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
                <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={color} stopOpacity="0.25" />
                  <Stop offset="1" stopColor={color} stopOpacity="0" />
                </LinearGradient>
              </Defs>
              <Path d={areaPath} fill={`url(#${gradientId})`} />
              <Path d={linePath} stroke={color} strokeWidth={2} fill="none" />
              <AnimatedLine
                animatedProps={scrubLineProps}
                stroke="#11181C"
                strokeWidth={1}
                strokeDasharray="4 3"
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
