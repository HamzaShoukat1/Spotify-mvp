import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { WifiOff, ArrowRight, DownloadCloud, RefreshCw } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDownloadedSongs } from "@/hooks/use-downloads";
import { useNetwork } from "@/context/NetworkContext";

interface OfflineStateViewProps {
  title?: string;
  description?: string;
  allowRetry?: boolean;
}

export function OfflineStateView({
  title = "You're offline",
  description = "Turn on Wi-Fi or cellular data to connect. Or listen to music you've downloaded.",
  allowRetry = true,
}: OfflineStateViewProps) {
  const { count } = useDownloadedSongs();
  const { refreshNetwork } = useNetwork();

  return (
    <SafeAreaView className="flex-1 bg-black items-center justify-center px-6" edges={["top", "bottom"]}>
      <View className="w-20 h-20 rounded-full bg-[#181818] border border-white/10 items-center justify-center mb-6">
        <WifiOff size={36} color="#B3B3B3" strokeWidth={2} />
      </View>

      <Text className="text-white text-2xl font-extrabold tracking-tight text-center mb-3">
        {title}
      </Text>

      <Text className="text-[#A7A7A7] text-sm text-center leading-5 max-w-[300px] mb-8 font-medium">
        {description}
      </Text>

      {/* Primary Action: Go to Downloaded Songs */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push("/(root)/(screens)/Downloaded-Songs")}
        className="w-full max-w-[320px] bg-[#1DB954] py-4 px-6 rounded-full flex-row items-center justify-center shadow-lg shadow-[#1DB954]/20 active:scale-[0.98] mb-4"
      >
        <DownloadCloud size={20} color="#000000" strokeWidth={2.4} />
        <Text className="text-black font-extrabold text-sm uppercase tracking-wider ml-2.5">
          Go to Downloaded Songs {count > 0 ? `(${count})` : ""}
        </Text>
        <ArrowRight size={18} color="#000000" strokeWidth={2.4} className="ml-2" />
      </TouchableOpacity>

      {/* Secondary Action: Try Again */}
      {allowRetry && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={refreshNetwork}
          className="flex-row items-center py-3 px-5 rounded-full border border-white/20 bg-white/5 active:bg-white/10"
        >
          <RefreshCw size={14} color="#FFFFFF" className="mr-2" />
          <Text className="text-white text-xs font-semibold tracking-wide ml-2">
            Try again
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
