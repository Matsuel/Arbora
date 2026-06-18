import InputPicker from '@/components/ui/InputPicker'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const CURRENCIES = [
    { label: 'Euro (€)', value: 'EUR' },
    { label: 'Dollar US ($)', value: 'USD' },
    { label: 'Livre sterling (£)', value: 'GBP' },
]


const Create = () => {

    const [name, setName] = useState<string>('')
    const [currency, setCurrency] = useState('EUR')


    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Création d&apos;un portefeuille
            </Text>

            <View style={styles.form}>
                <Input
                    label="Nom du portefeuille"
                    value={name}
                    onChangeText={setName}
                />
                <InputPicker
                    label="Devise"
                    value={currency}
                    onChange={setCurrency}
                    options={CURRENCIES}
                />
                <Button disabled={name.length === 0} onPress={() => { }}>
                    Créer le portefeuille
                </Button>
            </View>
        </View>
    )
}

export default Create

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    form: {
        width: '100%',
        marginTop: 20,
        gap: 30,
    },
});