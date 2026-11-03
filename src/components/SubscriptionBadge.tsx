import { Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Crown } from "lucide-react-native";
import { useSubscriptionStatus } from "@/hooks/useSubscription";

export function SubscriptionBadge() {
  const { isPremium, isLoading, planTier } = useSubscriptionStatus();

  if (isLoading) {
    return null;
  }

  const label = isPremium || planTier === "premium" ? "Premium" : "Free";

  return (
    <TouchableOpacity
      onPress={() => router.push("/(root)/(tabs)/premium")}
      activeOpacity={0.8}
      className={`flex-row items-center self-start rounded-full px-3.5 py-1.5 shadow-sm ${label === "Premium" ? "bg-[#1ED760]" : "bg-[#303030]"}`}
    >
      <Crown size={13} color={label === "Premium" ? "#000000" : "#A7A7A7"} fill={label === "Premium" ? "#000000" : "transparent"} />

      <Text className={`ml-1.5 text-xs font-black uppercase tracking-wider ${label === "Premium" ? "text-black" : "text-[#A7A7A7]"}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
