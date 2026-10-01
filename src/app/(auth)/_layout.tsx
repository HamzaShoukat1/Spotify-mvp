import { Stack } from "expo-router";
import { SignupProvider } from "../../context/SignupContext";
import { AuthProvider } from "@/context/Auth.Context";

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