import "../../global.css";

import { View, ActivityIndicator } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

import {
  AuthProvider,
  useAuth,
} from "@/context/Auth.Context";

import QueryProvider from "@/providers/QueryProvider";
import { ArtistProvider } from "@/context/ArtistContext";
import { MusicProvider } from "@/context/MusicContext";

function AuthNavigation() {
  const { userToken, isLoading } = useAuth();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    const inRootGroup = segments[0] === "(root)";
    if (!userToken && !inAuthGroup) {
      router.replace("/(auth)/login");
      return;
    }

    if (userToken && !inRootGroup) {
      router.replace("/(root)/(tabs)/home");
      return;
    }
  }, [userToken, isLoading, segments, router]);

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
    <AuthProvider>
      <QueryProvider>
        <ArtistProvider>
          <MusicProvider>
            <AuthNavigation />
          </MusicProvider>
        </ArtistProvider>
      </QueryProvider>
    </AuthProvider>
  );
}