import { authController, extractTokensFromUrl, getRedirectUrl } from "@/controllers/auth.controller";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

interface GoogleController {
    handlePress: (onError?: (message?: string) => void) => Promise<void>;
}

export const googleController : GoogleController = {
    handlePress: async (onError) => {
        onError?.(undefined);
        try {
            const redirectUrl = getRedirectUrl();
            const { data, error } = await authController.signInWithOAuth("google", redirectUrl);
            if (error) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                onError?.(error.message);
                return;
            }
            if (Platform.OS === "web") return;

            const googleOAuthUrl = data.url;
            if (!googleOAuthUrl) {
                onError?.("Google sign-in failed");
                return;
            }

            const result = await WebBrowser.openAuthSessionAsync(googleOAuthUrl, redirectUrl, {
                showInRecents: true,
            });

            if (result?.type === "success") {
                // PKCE flow: Supabase redirects with ?code=xxx
                const code = new URL(result.url).searchParams.get("code");
                if (code) {
                    const { error: codeError } = await authController.exchangeCodeForSession(code);
                    if (codeError) {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                        onError?.(codeError.message);
                        return;
                    }
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    router.replace("/(tabs)");
                    return;
                }
                // Implicit flow: tokens in URL hash
                const { access_token, refresh_token } = extractTokensFromUrl(result.url);
                if (access_token && refresh_token) {
                    const { error: sessionError } = await authController.setSession(
                        access_token,
                        refresh_token
                    );
                    if (sessionError) {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                        onError?.(sessionError.message);
                        return;
                    }
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    router.replace("/(tabs)");
                } else {
                    onError?.("Google sign-in cancelled");
                }
            }
        } catch (err) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            onError?.(err instanceof Error ? err.message : "Google sign-in failed");
        }
    }
};