import {
    StyleSheet,
    Text,
    TouchableOpacity,
    type TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
	variant?: "primary" | "secondary" | "border";
}

const Button = ({
	children,
	variant = "primary",
	style,
	...props
}: ButtonProps) => {
	const containerStyle = [styles.container, styles[variant]];

	return (
		<TouchableOpacity style={[containerStyle, style]} {...props}>
			<Text style={[styles[variant], styles.text]}>{children}</Text>
		</TouchableOpacity>
	);
};

export default Button;

const styles = StyleSheet.create({
	container: {
		width: "100%",
		alignItems: "center",
		paddingVertical: 16,
		borderRadius: 50,
		borderWidth: 1,
		borderColor: "transparent",
	},
	text: {
		fontWeight: "bold",
	},
	primary: {
		backgroundColor: "#1f1f1f",
		color: "#fff",
	},
	secondary: {
		backgroundColor: "#fff",
		color: "#000",
	},
	border: {
		borderColor: "#000",
		backgroundColor: "transparent",
		color: "#000",
	},
});
