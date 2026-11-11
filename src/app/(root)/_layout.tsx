import { useEffect } from "react";
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

  const hiddenScreen = { drawerItemStyle: { display: 'none' as const } };

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
    >
      <Drawer.Screen name="(tabs)" options={{ drawerLabel: "Home" }} />

      <Drawer.Screen name="(album)" options={hiddenScreen} />
      <Drawer.Screen name="(artist)" options={hiddenScreen} />
      <Drawer.Screen name="(music)" options={hiddenScreen} />

      <Drawer.Screen  name="(screens)/Album-Control" options={hiddenScreen} />
      <Drawer.Screen name="(screens)/Album-View" options={hiddenScreen} />
      <Drawer.Screen name="(screens)/Analytics" options={hiddenScreen} />
      <Drawer.Screen name="(screens)/Artist-detail" options={hiddenScreen} />
      <Drawer.Screen name="(screens)/Artist-hub" options={hiddenScreen} />
      <Drawer.Screen name="(screens)/Create-Playlist" options={hiddenScreen} />
      <Drawer.Screen name="(screens)/Downloaded-Songs" options={hiddenScreen} />
      <Drawer.Screen name="(screens)/Edit-Profile" options={hiddenScreen} />
      <Drawer.Screen name="(screens)/Music-DNA" options={hiddenScreen} />
      <Drawer.Screen name="(screens)/Playlist-Detail" options={hiddenScreen} />
      <Drawer.Screen name="(screens)/Select-Playlist-Songs" options={hiddenScreen} />
      <Drawer.Screen name="(screens)/Setting-And-Privacy" options={hiddenScreen} />
      <Drawer.Screen name="(screens)/Song-Share" options={hiddenScreen} />
      <Drawer.Screen name="(screens)/Subscription-detail" options={hiddenScreen} />
      <Drawer.Screen name="(screens)/Track-detail" options={hiddenScreen} />
      <Drawer.Screen name="(screens)/UserlikedArtistdetails" options={hiddenScreen} />
      <Drawer.Screen name="(screens)/Voice-Agent" options={hiddenScreen} />
      <Drawer.Screen name="(screens)/search-bar" options={hiddenScreen} />
    </Drawer>
  );
}
