import { Redirect, Stack } from "expo-router";
import { SignupProvider } from "../../context/SignupContext";
import { useAuth } from "@/context/Auth.Context";

export default function AuthLayout() {
  const { userToken, onboarding, isLoading } = useAuth();

  if (!isLoading && userToken && onboarding) {
    return <Redirect href="/(root)/(tabs)/home" />;
  }

  return (
    <SignupProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "simple_push",
          gestureEnabled: true,
        }}
      />
    </SignupProvider>
  );
}