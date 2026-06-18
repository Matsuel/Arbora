import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface TotalBalanceProps {
    total: number
    currency?: string
    label?: string
}

const CURRENCY_SYMBOLS: Record<string, string> = {
    EUR: '€',
    USD: '$',
    GBP: '£',
    CHF: 'CHF',
    JPY: '¥',
}

function formatTotal(amount: number, currency: string): string {
    const symbol = CURRENCY_SYMBOLS[currency] ?? currency
    return (
        new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount) +
        ' ' +
        symbol
    )
}

const TotalBalance = ({
    total,
    currency = 'EUR',
    label = 'Total',
}: TotalBalanceProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.amount}>{formatTotal(total, currency)}</Text>
        </View>
    )
}

export default TotalBalance

const styles = StyleSheet.create({
    container: {
        marginBottom: 28,
    },
    label: {
        fontSize: 16,
        color: '#9BA1A6',
        fontWeight: '400',
        marginBottom: 4,
    },
    amount: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#11181C',
        letterSpacing: -1,
    },
})