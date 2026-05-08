import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

interface ProviderButtonProps extends React.ComponentProps<typeof TouchableOpacity> {
    children: React.ReactNode
    label: string
}

const ProviderButton = ({
    children,
    label,
    ...props
}: ProviderButtonProps) => {
    return (
        <TouchableOpacity style={styles.container} {...props}>
            {children}
            <Text style={styles.text}>
                {label}
            </Text>
        </TouchableOpacity>
    )
}

export default ProviderButton

const styles = StyleSheet.create({
    container: {
        width: "49%",
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: 50,
        backgroundColor: '#fff'
    },
    text: {
        color: '#000',
        fontWeight: 'bold',
    }
})