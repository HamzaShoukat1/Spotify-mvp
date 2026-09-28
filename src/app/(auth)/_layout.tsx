import { Stack } from "expo-router";
import { SignupProvider } from "../../context/SignupContext";

export default function AuthLayout() {
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