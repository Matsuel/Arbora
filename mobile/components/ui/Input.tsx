import {
    StyleSheet,
    Text,
    TextInput,
    type TextInputProps,
    View,
} from "react-native";

interface InputProps extends TextInputProps {
	label: string;
}

const Input = ({ label, style, ...props }: InputProps) => {
	return (
		<View style={styles.container}>
			<Text style={styles.label}>{label}</Text>
			<TextInput style={[style, styles.input]} {...props} />
		</View>
	);
};

export default Input;

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
		width: "100%",
		fontSize: 16,
	},
});
