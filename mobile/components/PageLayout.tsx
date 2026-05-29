import React from 'react'
import { StyleSheet, Text, View } from 'react-native';

interface PageLayoutProps {
    title: string;
    children: React.ReactNode;
}

const PageLayout = ({
    title,
    children
}: PageLayoutProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
            </View>
            
            {children}
        </View>
    )
}

export default PageLayout

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: "#f6f6f6",
        paddingTop: 70,
        paddingHorizontal: "5%",
    },
    header: {
        width: '100%',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});