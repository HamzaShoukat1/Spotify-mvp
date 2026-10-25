// src/app/_layout.tsx
import "../../global.css";
import { Stack } from "expo-router";
import { StripeProvider } from "@stripe/stripe-react-native";
import { AuthProvider } from "@/context/Auth.Context";
import QueryProvider from "@/providers/QueryProvider";
import { ArtistProvider } from "@/context/ArtistContext";
import { MusicProvider } from "@/context/MusicContext";
import { ProfileProvider } from "@/context/ProfileContext";
import Toast from 'react-native-toast-message';
import { toastConfig } from "@/utils";

const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

export default function RootLayout() {
  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="merchant.com.spotify.mvp"
      urlScheme="spotifymvp"
    >
      <AuthProvider>
        <QueryProvider>
          <ArtistProvider>
            <MusicProvider>
              <ProfileProvider>
                <Stack screenOptions={{ headerShown: false }} />
              </ProfileProvider>
            </MusicProvider>
          </ArtistProvider>
        </QueryProvider>
      </AuthProvider>
      <Toast config={toastConfig} visibilityTime={2000} autoHide={true} />
    </StripeProvider>
  );
}