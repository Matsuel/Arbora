import { useLocalSearchParams } from 'expo-router/build/hooks';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PriceChart, { FilterPeriod } from '../components/PriceChart';
import { useFetchMarketDetails } from '@/query/hook';
import Loading from '@/components/ui/Loading';
import Add from '@/components/icon/Add';

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
      <View style={styles.header}>
        <Text style={styles.symbol}>{symbol}</Text>
        <TouchableOpacity>
          <Add width={30} height={30} color="#d2d9df" />
        </TouchableOpacity>
      </View>
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
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  symbol: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#11181C',
  },
});