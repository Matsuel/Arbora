import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import Apple from "@/components/icon/Apple";
import Google from "@/components/icon/Google";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ProviderButton from "@/components/ui/ProviderButton";

const Login = () => {

	const providers = [
		{
			label: "Google",
			icon: <Google width={16} height={16} />,
		},
		{
			label: "Apple",
			icon: <Apple width={16} height={16} />,
		},
	];

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
		>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
			>
				<Input
					placeholder="Email"
					keyboardType="email-address"
					autoCapitalize="none"
					label="Email"
					autoFocus
				/>
				<Input
					placeholder="Mot de passe"
					label="Mot de passe"
					secureTextEntry
				/>
				<Button>Se connecter</Button>

				<Button variant="secondary">
					S&apos;inscrire
				</Button>

				<View style={styles.providers}>
					{providers.map((provider) => (
						<ProviderButton
							key={provider.label}
							label={provider.label}
							// onPress={provider.onPress}
						>
							{provider.icon}
						</ProviderButton>
					))}
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default Login;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f6f6f6",
	},
	scrollContent: {
		flexGrow: 1,
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		padding: 16,
		gap: 16,
	},
	providers: {
		width: "100%",
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
});