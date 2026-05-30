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

  return (
    <View style={styles.container}>
      <Text style={styles.symbol}>{symbol}</Text>
      <PriceChart
        data={MOCK_DATA}
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