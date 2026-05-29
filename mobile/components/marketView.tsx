import { useFetchMarketAssets } from '@/query/hook';
import React from 'react'
import { StyleSheet, Text, View } from 'react-native';

interface MarketViewProps {
    query: string;
}

const MarketView = ({
    query
}: MarketViewProps) => {

    const { data, isLoading, error } = useFetchMarketAssets(query);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        )
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>Error: {error.message}</Text>
            </View>
        )
    }

    console.log(data);

    return (
        <View style={styles.container}>
            <Text>Data: {JSON.stringify(data)}</Text>
        </View>
    )
}

export default MarketView

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

})