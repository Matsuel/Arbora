import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useDeletePortfolio } from '@/query/hook';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react'
import { Alert, Text, View } from 'react-native'

const Portfolio = () => {
    const { id } = useLocalSearchParams();

    console.log('Portfolio ID:', id);

    const { token } = useAuth()
    const { mutate: deletePortfolio, isPending } = useDeletePortfolio(token!)

    const handleDelete = () => {
        Alert.alert(
            "Supprimer le portefeuille",
            "Êtes-vous sûr de vouloir supprimer ce portefeuille ?",
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: () => deletePortfolio({ portfolioId: id as string }, { onSuccess: () => router.back() })
                }
            ]
        )
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Portfolio Screen</Text>

            <Button disabled={isPending} onPress={handleDelete}>
                Supprimer le portefeuille
            </Button>
        </View>
    )   
}

export default Portfolio