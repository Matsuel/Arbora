import React from 'react'
import { StyleSheet, Switch, Text, View } from 'react-native'

interface SwitchToggleProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    label: string;
}

const SwitchToggle = ({
    value,
    onValueChange,
    label
}: SwitchToggleProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label}
            </Text>
            <Switch
                value={value}
                onValueChange={onValueChange}
            />
        </View>
    )
}

export default SwitchToggle

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginVertical: 20,
    },
    label: {
        position: 'absolute',
        left: 20,
        fontSize: 16,
        color: '#333',
    },
})  