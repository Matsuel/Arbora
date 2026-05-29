import MarketView from '@/components/marketView';
import PageLayout from '@/components/PageLayout';
import Input from '@/components/ui/Input';
import React, { useEffect, useState } from 'react';

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
        <PageLayout title="Marché">
            <Input
                label="Rechercher un actif"
                placeholder="Ex: Apple, Google, Bitcoin..."
                value={query}
                onChangeText={setQuery}
            />
            {queryToSearch && (
                <MarketView
                    query={queryToSearch}
                />
            )}
        </PageLayout>
    );
}

export default Market