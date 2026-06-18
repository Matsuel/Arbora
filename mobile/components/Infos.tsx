import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

interface InfosProps {
    title: string
    icon: React.ReactNode
    value?: string | number
    onPress?: () => void
}

const Infos = ({
    title,
    icon,
    onPress
}: InfosProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            style={styles.container}
            activeOpacity={0.7}
        >
            <Text
                style={styles.title}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {title}
            </Text>

            {icon}
        </TouchableOpacity>
    )
}

export default Infos

const styles = StyleSheet.create({
    container: {
        width: '38%',
        height: 100,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#bbc1cb',
        flexShrink: 1
    }
})