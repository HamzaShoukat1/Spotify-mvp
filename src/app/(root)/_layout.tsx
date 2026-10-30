import { useEffect } from "react";
import { Platform } from "react-native";
import { Drawer } from "expo-router/drawer";
import SpotifyProfileMenu from "./(screens)/CustomDrawerContent.jsx";
import { router } from "expo-router";
import { useAuth } from "@/context/Auth.Context";

export default function RootGroupLayout() {
  const { userToken, user, onboarding, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!userToken) {
      router.replace("/(auth)/login");
    } else if (user && !onboarding) {
      router.replace("/(onboarding)/Choose-Artist");
    }
  }, [userToken, user, onboarding, isLoading]);

  return (
    <Drawer
      drawerContent={() => <SpotifyProfileMenu />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: "90%",
          backgroundColor: "#121212",
        },
        overlayColor: "rgba(0, 0, 0, 0.72)",
        swipeEnabled: true,
        drawerType: "slide",
        sceneStyle: {
          backgroundColor: "#121212",
        },
      }}
    />
  );
}
