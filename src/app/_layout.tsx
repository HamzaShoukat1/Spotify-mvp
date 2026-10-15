import "../../global.css";

import { View, ActivityIndicator } from "react-native";
import { Stack, Redirect, useSegments } from "expo-router";

import {
  AuthProvider,
  useAuth,
} from "@/context/Auth.Context";

import QueryProvider from "@/providers/QueryProvider";
import { ArtistProvider } from "@/context/ArtistContext";
import { MusicProvider } from "@/context/MusicContext";
import { ProfileProvider } from "@/context/ProfileContext";
import Toast from 'react-native-toast-message';
import { toastConfig } from "@/utils";

function AuthNavigation() {
  const { userToken, onboarding, isLoading } = useAuth();
  const segments = useSegments();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  const inAuthGroup = segments[0] === "(auth)";
  const inRootGroup = segments[0] === "(root)";
  const inOnboardingGroup = segments[0] === "(onboarding)";

  if (!userToken && !inAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  }

  if (userToken && !onboarding && !inOnboardingGroup) {
    return <Redirect href="/(onboarding)/Choose-Artist" />;
  }

  if (userToken && onboarding && !inRootGroup) {
    return <Redirect href="/(root)/(tabs)/home" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <>
      <AuthProvider>
        <QueryProvider>
          <ArtistProvider>
            <MusicProvider>
              <ProfileProvider>
                <AuthNavigation />
              </ProfileProvider>
            </MusicProvider>
          </ArtistProvider>
        </QueryProvider>
      </AuthProvider>
      <Toast
        config={toastConfig}
        visibilityTime={1000}
        autoHide={true}
      />

    </>
  );
}