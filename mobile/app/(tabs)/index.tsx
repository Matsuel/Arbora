import Chevron from '@/components/icon/Chevron';
import PortfolioCard from '@/components/Portfolio';
import Loading from '@/components/ui/Loading';
import { useAuth } from '@/hooks/useAuth';
import { useFetchPortfolio } from '@/query/hook';
import { router } from 'expo-router';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';


export default function HomeScreen() {
    const { token } = useAuth();

    console.log('Token:', token);

    const { data: portfolioData, isLoading: isPortfolioLoading, refetch, isRefetching } = useFetchPortfolio(token!);

    console.log('Portfolio Data:', portfolioData);

    if (isPortfolioLoading || !portfolioData) {
        return <Loading />
    }

    return (
        <View style={styles.container}>
            <FlatList
            refreshControl={
                <RefreshControl
                    refreshing={isRefetching}
                    onRefresh={refetch}
                />
            }
                ListHeaderComponent={
                    <View style={styles.listHeader}>
                        <Text style={styles.listHeaderTitle}>
                            Vos portefeuilles
                        </Text>
                        <Chevron width={30} height={30} color="#bbc1cb" />
                    </View>
                }
                style={{ flex: 1 }}
                data={portfolioData.data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <PortfolioCard
                        name={item.name}
                        baseCurrency={item.baseCurrency}
                        amount={item.amount || 0}
                        onPress={() => router.push(`/portfolio/${item.id}`)}
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    listHeaderTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});