import React, { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MarketRowProps {
    symbol: string;
    name: string;
    exchange: string;
    assetType: string;
    logoUrl?: string;
}

const MarketRow = ({
    symbol,
    name,
    exchange,
    assetType,
    logoUrl
}: MarketRowProps) => {
    const [logoError, setLogoError] = useState<boolean>(false);

    return (
        <TouchableOpacity style={styles.row}>
            <View style={styles.logoContainer}>
                {logoUrl && !logoError ? (
                    <Image
                        source={{ uri: logoUrl }}
                        style={styles.logo}
                        onError={() => setLogoError(true)}
                    />
                ) : (
                    <View style={styles.logoFallback}>
                        <Text style={styles.logoFallbackText}>{symbol[0]}</Text>
                    </View>
                )}
            </View>
            <View style={styles.info}>
                <View style={styles.topLine}>
                    <Text style={styles.name} numberOfLines={1}>{name}</Text>
                    <Text style={styles.symbol}>{symbol}</Text>
                </View>
                <Text style={styles.meta}>{exchange} · {assetType}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default MarketRow

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 4,
    },
    logoContainer: {
        marginRight: 12,
    },
    logo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    logoFallback: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e0e7ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoFallbackText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4f46e5',
    },
    info: {
        flex: 1,
    },
    topLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 15,
        fontWeight: '500',
        color: '#111',
        flex: 1,
        marginRight: 8,
    },
    symbol: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111',
    },
    meta: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
});