import Add from '@/components/icon/Add';
import Chevron from '@/components/icon/Chevron';
import Infos from '@/components/Infos';
import PortfolioCard from '@/components/Portfolio';
import TotalBalance from '@/components/TotalBalance';
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
            <TotalBalance total={0} currency="EUR" />
            <View style={styles.infosContainer}>
                <Infos
                    title="Créer un portefeuille"
                    icon={<Add width={30} height={30} color="#bbc1cb" />}
                    onPress={() => router.push('/portfolio/create')}
                />
            </View>
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
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5',
    },
    infosContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 20,
        marginBottom: 20
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