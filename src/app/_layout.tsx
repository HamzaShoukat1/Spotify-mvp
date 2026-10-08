import "../../global.css";

import { View, ActivityIndicator } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";

import {
  AuthProvider,
  useAuth,
} from "@/context/Auth.Context";

import QueryProvider from "@/providers/QueryProvider";
import { ArtistProvider } from "@/context/ArtistContext";
import { MusicProvider } from "@/context/MusicContext";
import { ProfileProvider } from "@/context/ProfileContext";




function AuthNavigation() {
  const { userToken, onboarding, isLoading } = useAuth();

  console.log(userToken, onboarding, isLoading);

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    const inRootGroup = segments[0] === "(root)";
    const inOnboardingGroup = segments[0] === "(onboarding)";

    if (!userToken && !inAuthGroup) {
      router.replace("/(auth)/login");
      return;
    }

    if (userToken && !onboarding && !inOnboardingGroup) {
      router.replace("/(onboarding)/Choose-Artist");
      return;
    }

    if (userToken && onboarding && !inRootGroup) {
      router.replace("/(root)/(tabs)/home");
      return;
    }


  }, [userToken, onboarding, isLoading, segments, router]);


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
            <ProfileProvider>
              <AuthNavigation />
            </ProfileProvider>
          </MusicProvider>
        </ArtistProvider>
      </QueryProvider>
    </AuthProvider>
  );
}