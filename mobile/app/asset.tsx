import { useLocalSearchParams } from 'expo-router/build/hooks';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PriceChart, { FilterPeriod } from '../components/PriceChart';
import { useFetchMarketDetails } from '@/query/hook';
import Loading from '@/components/ui/Loading';

const AssetModal = () => {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const [activeFilter, setActiveFilter] = useState<FilterPeriod>('1M');
  const { data: marketDetails, isLoading } = useFetchMarketDetails(symbol, activeFilter.toLowerCase());

  if (isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.symbol}>{symbol}</Text>
      <PriceChart
        data={marketDetails || []}
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