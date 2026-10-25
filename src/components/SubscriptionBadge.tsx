import { Text, TouchableOpacity } from "react-native";
import { Crown } from "lucide-react-native";
import { useSubscriptionStatus } from "@/hooks/useSubscription";

export function SubscriptionBadge() {
  const { isPremium, isLoading, isError } = useSubscriptionStatus();

  if (isLoading || isError || !isPremium) {
    return null;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="flex-row items-center self-start rounded-full bg-[#1ED760] px-3.5 py-1.5 shadow-sm"
    >
      <Crown size={13} color="#000000" fill="#000000" />

      <Text className="ml-1.5 text-xs font-black uppercase tracking-wider text-black">
        Premium
      </Text>
    </TouchableOpacity>
  );
}
