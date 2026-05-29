import { useLocalSearchParams } from 'expo-router/build/hooks';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const AssetModal = () => {

    const { symbol } = useLocalSearchParams<{ symbol: string }>();

    console.log('AssetModal received symbol:', symbol);

    return (
        <View style={styles.container}>
        </View>
    )
}

export default AssetModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
});