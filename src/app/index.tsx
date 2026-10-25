import { Redirect } from "expo-router";
import { useAuth } from "@/context/Auth.Context";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { userToken, onboarding, isLoading } = useAuth();

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

  if (!userToken) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!onboarding) {
    return <Redirect href="/(onboarding)/Choose-Artist" />;
  }

  return <Redirect href="/(root)/(tabs)/home" />;
}