import { router } from 'expo-router';
import React, { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// TODO:
// - Faire page /asset avec details de l'actif, graphiques, infos, etc
// - Ajouter un bouton "Ajouter au portefeuille" qui ouvre un modal pour choisir le portefeuille et la quantité avec la strategie
// - Trouver un moyen de stocker les logos des actifs via Supabase Storage pour éviter de faire des requetes à chaque fois
// - Créer script qui actualise les actifs tous les jours à 0h en récupérant les données de l'API
// - Créer structure de données pour les prix des actifs pour les afficher dans le graphique et calculer les performances
// - Filtre sur la période (1j, 1s, 1m, 3m, 6m, 1a, max) pour afficher les performances sur la période choisie

// Page Home
// - Afficher les performances globales du/des portefeuille(s) de l'utilisateur
// - Utiliser le composant graphique avec les filtres de période pour afficher les performances du/des portefeuille(s)
// - Afficher les dernières transactions
// - Bouton qui redirige vers chaque portefeuille pour avoir les détails des actifs détenus, les performances, etc

// Page Portefeuille
// - Afficher la liste des actifs détenus avec leur quantité, valeur actuelle, performance, etc
// - Utiliser le composant graphique pour afficher les performances du portefeuille avec les filtres de période
// - Bouton pour gérer le portefeuille (ajouter/supprimer des actifs, modifier les quantités, etc)

interface MarketRowProps {
    symbol: string;
    name: string;
    exchange: string;
    assetType: string;
    logoUrl?: string;
}

const MarketRow = ({
    symbol,
    name,
    exchange,
    assetType,
    logoUrl
}: MarketRowProps) => {
    
    const [logoError, setLogoError] = useState<boolean>(false);

    const onPress = () => {
        router.push({ pathname: '/asset', params: { symbol } });
    };

    return (
        <TouchableOpacity style={styles.row} onPress={onPress}>
            <View style={styles.logoContainer}>
                {logoUrl && !logoError ? (
                    <Image
                        source={{ uri: logoUrl }}
                        style={styles.logo}
                        onError={() => setLogoError(true)}
                    />
                ) : (
                    <View style={styles.logoFallback}>
                        <Text style={styles.logoFallbackText}>{symbol[0]}</Text>
                    </View>
                )}
            </View>
            <View style={styles.info}>
                <View style={styles.topLine}>
                    <Text style={styles.name} numberOfLines={1}>{name}</Text>
                    <Text style={styles.symbol}>{symbol}</Text>
                </View>
                <Text style={styles.meta}>{exchange} · {assetType}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default MarketRow

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 4,
    },
    logoContainer: {
        marginRight: 12,
    },
    logo: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    logoFallback: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e0e7ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoFallbackText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4f46e5',
    },
    info: {
        flex: 1,
    },
    topLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 15,
        fontWeight: '500',
        color: '#111',
        flex: 1,
        marginRight: 8,
    },
    symbol: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111',
    },
    meta: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
});