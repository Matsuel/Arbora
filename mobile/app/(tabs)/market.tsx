import MarketView from '@/components/marketView';
import Input from '@/components/ui/Input';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const Market = () => {

    const [query, setQuery] = useState<string>('');
    const [queryToSearch, setQueryToSearch] = useState<string>('');

    useEffect(() => {
        if (!query) {
            setQueryToSearch('');
            return;
        }
        const timer = setTimeout(() => {
            setQueryToSearch(query);
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <View style={styles.container}>
            <Input
                label="Search"
                placeholder="Search"
                value={query}
                onChangeText={setQuery}
            />
            {queryToSearch && (
                <MarketView
                    query={queryToSearch}
                />
            )}
        </View>
    );
}

export default Market

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: "#f6f6f6",
        paddingTop: 70,
        paddingHorizontal: "5%",
    },
});