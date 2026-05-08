import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Button from "@/components/ui/Button";

const Welcome = () => {
	const handlePress = (page: "login") => {
		router.push(`/${page}`);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Welcome to Cashy</Text>

			<View style={styles.buttonsContainer}>
				<Button style={{ width: "70%" }} onPress={() => handlePress("login")}>
					Connexion
				</Button>

				{/* <Button
					style={{ width: "70%" }}
					onPress={() => handlePress("register")}
					variant="secondary"
				>
					Inscription
				</Button> */}
			</View>
		</View>
	);
};

export default Welcome;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f6f6f6",
	},
	title: {
		width: "65%",
		color: "#000",
		fontSize: 50,
		fontWeight: "700",
		textAlign: "center",
	},
	buttonsContainer: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		gap: 16,
		marginTop: 32,
	},
});