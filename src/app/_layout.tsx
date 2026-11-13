import "../../global.css";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StripeProvider } from "@stripe/stripe-react-native";
import { AuthProvider } from "@/context/Auth.Context";
import QueryProvider from "@/providers/QueryProvider";
import { ArtistProvider } from "@/context/ArtistContext";
import { MusicProvider } from "@/context/MusicContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { ListeningLimitProvider } from "@/context/ListeningLimitContext";
import { AlbumProvider } from "@/context/AlbumContext";
import { NetworkProvider } from "@/context/NetworkContext";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/utils";

const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51UTL1QBNHEQBwf0e5WeCdA95lbaQ2UG3iqapkBnTe5OBPpKRqsjN8aLWl1YfGbbh6IEu1qn2YDdEopx4PTfkZy4W007kUHSwSz";

export const unstable_settings = { anchor: "(root)" };

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StripeProvider
        publishableKey={STRIPE_PUBLISHABLE_KEY}
        merchantIdentifier="merchant.com.spotify.mvp"
        urlScheme="spotifymvp"
      >
        <NetworkProvider>
          <AuthProvider>
            <QueryProvider>
              <ArtistProvider>
                <MusicProvider>
                  <AlbumProvider>
                    <ProfileProvider>
                      <ListeningLimitProvider>
                        <Stack
                          screenOptions={{
                            headerShown: false,
                            contentStyle: {
                              backgroundColor: "#121212",
                            },
                          }}
                        >
                          <Stack.Screen name="(root)" />

                          <Stack.Screen
                            name="Track-View"
                            options={{
                              presentation: "card",
                              animation: "slide_from_bottom",
                              headerShown: false,
                              contentStyle: {
                                backgroundColor: "#000000",
                              },
                              gestureEnabled: false,
                            }}
                          />
                        </Stack>
                      </ListeningLimitProvider>
                    </ProfileProvider>
                  </AlbumProvider>
                </MusicProvider>
              </ArtistProvider>
            </QueryProvider>
          </AuthProvider>
          <Toast
            config={toastConfig}
            visibilityTime={2000}
            autoHide={true}
          />
        </NetworkProvider>
      </StripeProvider>
    </GestureHandlerRootView>
  );
}