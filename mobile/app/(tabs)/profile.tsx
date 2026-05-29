import PageLayout from '@/components/PageLayout';
import Button from '@/components/ui/Button';
import SwitchToggle from '@/components/ui/SwitchToggle';
import { useAuth } from '@/contexts/auth-context';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const Profile = () => {

    const { user, isLoading, signOut } = useAuth();
    const [isDarkMode, setIsDarkMode] = useState(false);


    if (isLoading || !user) {
        return null; // or a loading spinner
    }

    const userName = user.user_metadata?.name;

    const abbreviatedName = userName.split(' ').map((word: string) => word[0]).join('');

    const memberSince = new Date(user.created_at).toLocaleDateString();


    return (
        <PageLayout title="Profil">
            <View style={styles.header}>
                <View style={styles.avatar}>
                    {user.user_metadata?.avatar_url ? (
                        <Image source={{ uri: user.user_metadata.avatar_url }} style={{ width: 60, height: 60, borderRadius: 30 }} />
                    ) : (
                        <Text>{abbreviatedName}</Text>
                    )}
                </View>
                <View style={styles.userInfo}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                        {user.user_metadata?.name}
                    </Text>
                    <Text style={styles.memberSince}>
                        Membre depuis le {memberSince}
                    </Text>
                </View>
            </View>
            <SwitchToggle 
                value={isDarkMode}
                onValueChange={setIsDarkMode}
                label="Mode sombre"
            />
            <Button onPress={signOut} variant='secondary'>
                Se déconnecter
            </Button>
        </PageLayout>
    );
}

export default Profile

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
        width: '90%',
        paddingVertical: 20,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 20,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    userInfo: {
        flex: 1,
        gap: 4,
    },
    memberSince: {
        fontSize: 14,
        color: '#666',
    },
});