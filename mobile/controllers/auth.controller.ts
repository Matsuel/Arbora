import { supabase } from "@/lib/supabase";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

WebBrowser.maybeCompleteAuthSession();

const authController = {
	getSession: () => supabase.auth.getSession(),

	signInWithEmail: (email: string, password: string) =>
		supabase.auth.signInWithPassword({ email, password }),

	signInWithGoogle: async () => {
		const redirectTo = window.location.origin + "/auth/callback"; // Ensure this matches the redirect URI configured in Supabase

		console.log(window.location.origin);

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo,
			},
		});

		console.log("OAuth response", { data, error });

		if (error) {
			console.log("OAuth error", error);
			return;
		}

		if (data?.url) {
			const result = await WebBrowser.openAuthSessionAsync(
				data.url,
				redirectTo
			);

			console.log(result);
		}
	},

	signOut: () => supabase.auth.signOut(),
};

export default authController;