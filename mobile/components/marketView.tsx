import { useFetchMarketAssets } from '@/query/hook';
import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import MarketRow from './marketRow';
import Loading from './ui/Loading';

interface MarketViewProps {
    query: string;
}

const MarketView = ({ query }: MarketViewProps) => {
    const { data, isLoading, error, refetch, isRefetching } = useFetchMarketAssets(query);

    if (isLoading) {
        return (
            <Loading />
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.hint}>Error: {error.message}</Text>
            </View>
        );
    }

    if (!data || data.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={styles.hint}>{'No results for "' + query + '"'}</Text>
            </View>
        );
    }

    return (
        <FlatList
            refreshing={isLoading}
            onRefresh={refetch}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
            data={data}
            keyExtractor={(item) => item.symbol}
            renderItem={({ item }) => <MarketRow {...item} />}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            style={styles.list}
        />
    );
};

export default MarketView;

const styles = StyleSheet.create({
    list: {
        width: '100%',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    hint: {
        color: '#888',
        fontSize: 14,
    },
    separator: {
        height: 1,
        backgroundColor: '#f0f0f0',
    },
});
