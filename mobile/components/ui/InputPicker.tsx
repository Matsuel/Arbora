import { Picker } from '@react-native-picker/picker'
import React, { useState } from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export interface PickerOption {
    label: string
    value: string
}

interface InputPickerProps {
    label: string
    value: string
    onChange: (value: string) => void
    options: PickerOption[]
}

const InputPicker = ({ label, value, onChange, options }: InputPickerProps) => {
    const [open, setOpen] = useState(false)
    const selectedLabel = options.find(o => o.value === value)?.label ?? value

    return (
        <>
            <TouchableOpacity onPress={() => setOpen(true)} style={styles.container}>
                <Text style={styles.label}>
                    {label}
                </Text>
                <Text style={styles.input}>
                    {selectedLabel}
                </Text>
            </TouchableOpacity>

            <Modal visible={open} transparent animationType="slide">
                <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setOpen(false)} />
                <View>
                    <Picker selectedValue={value} onValueChange={(v) => onChange(v as string)}>
                        {options.map(o => (
                            <Picker.Item key={o.value} label={o.label} value={o.value} />
                        ))}
                    </Picker>
                </View>
            </Modal>
        </>
    )
}

export default InputPicker

const styles = StyleSheet.create({
    container: {
        width: "100%",
        borderRadius: 12,
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    label: {
        fontSize: 14,
        color: "#a1a7ac",
        marginBottom: 4,
    },
    input: {
        fontSize: 16,
        color: "#333",
    }
});