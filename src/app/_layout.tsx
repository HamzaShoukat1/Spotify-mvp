// src/app/_layout.tsx
import "../../global.css";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StripeProvider } from "@stripe/stripe-react-native";
import { AuthProvider } from "@/context/Auth.Context";
import QueryProvider from "@/providers/QueryProvider";
import { ArtistProvider } from "@/context/ArtistContext";
import { MusicProvider } from "@/context/MusicContext";
import { ProfileProvider } from "@/context/ProfileContext";
import Toast from 'react-native-toast-message';
import { toastConfig } from "@/utils";

const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

export const unstable_settings = { anchor: "(root)" };

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      // Leave the stack canvas transparent so a transparent modal
                      // can reveal the still-mounted route underneath it.
                      contentStyle: { backgroundColor: "transparent" },
                    }}
                  >
                    <Stack.Screen
                      name="Track-View"
                      options={{
                        presentation: "transparentModal",
                        animation: "slide_from_bottom",
                        headerShown: false,
                        contentStyle: { backgroundColor: "transparent" },
                        gestureEnabled: false,
                      }}
                    />
                  </Stack>
                </ProfileProvider>
              </MusicProvider>
            </ArtistProvider>
          </QueryProvider>
        </AuthProvider>
        <Toast config={toastConfig} visibilityTime={2000} autoHide={true} />
      </StripeProvider>
    </GestureHandlerRootView>

  );
}
