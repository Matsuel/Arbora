import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Arrow from './icon/Arrow';

interface PortfolioCardProps {
    name: string;
    baseCurrency: string;
    amount?: number;
    onPress?: () => void;
}

const PortfolioCard = ({
    name,
    baseCurrency,
    amount,
    onPress
}: PortfolioCardProps) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.infos}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.amount}>{amount?.toFixed(2)} {baseCurrency}</Text>
            </View>

            <Arrow width={30} height={30} color="#000" />
        </TouchableOpacity>
    )
}

export default PortfolioCard;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: "5%"
    },
    infos: {
        width: "auto",
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#bbc1cb',
    }
});