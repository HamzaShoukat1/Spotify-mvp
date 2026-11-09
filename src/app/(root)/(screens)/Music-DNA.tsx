import { router } from "expo-router";
import { Brain, RefreshCw, Sparkles } from "lucide-react-native";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMusicDNA, useRefreshMusicDNA } from "@/hooks/use-music-dna";
import Toast from "react-native-toast-message";

function ListSection({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <View className="mt-6">
      <Text className="mb-3 text-xs font-bold uppercase tracking-[2px] text-[#1DB954]">{title}</Text>
      {items.map((item, index) => (
        <View key={`${item}-${index}`} className="mb-2 flex-row rounded-xl bg-[#1B1B1B] px-4 py-3">
          <Text className="mr-3 text-[#1DB954]">•</Text>
          <Text className="flex-1 text-[15px] leading-5 text-[#E5E5E5]">{item}</Text>
        </View>
      ))}
    </View>
  );
}

export default function MusicDNAPage() {
  const { data, isLoading, isError, refetch } = useMusicDNA();
  const refresh = useRefreshMusicDNA();

  const handleRefresh = () => {
    refresh.mutate(undefined, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Music DNA refreshed",
          text2: "Your Music DNA has been updated with your latest listening history.",
          position: "top",
        });
      },
      onError: (err) => {
        Toast.show({
          type: "error",
          text1: "Refresh failed",
          text2: err?.message || "Could not regenerate profile.",
          position: "top",
        });
      }
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#121212]">
        <ActivityIndicator color="#1DB954" size="large" />
        <Text className="mt-4 text-[#A7A7A7]">Reading your listening history...</Text>
      </SafeAreaView>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#121212] px-8">
        <Text className="text-center text-base text-white">We could not load your Music DNA.</Text>
        <TouchableOpacity onPress={() => refetch()} className="mt-5 rounded-full bg-[#1DB954] px-6 py-3">
          <Text className="font-bold text-black">Try again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const { profile } = data;
  return (
    <SafeAreaView className="flex-1 bg-[#121212]" edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View className="mb-8 flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-base text-[#A7A7A7]">Close</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Refresh Music DNA"
            onPress={handleRefresh}
            disabled={refresh.isPending}
            className="h-10 w-10 items-center justify-center rounded-full bg-[#1B1B1B]"
          >
            {refresh.isPending ? <ActivityIndicator color="#1DB954" /> : <RefreshCw color="#1DB954" size={19} />}
          </TouchableOpacity>
        </View>

        <View className="items-center">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-[#1DB954]">
            <Brain color="#000" size={30} />
          </View>
          <Text className="text-center text-3xl font-bold text-white">Your Music DNA</Text>
          <Text className="mt-3 text-center text-base leading-6 text-[#A7A7A7]">{profile.headline}</Text>
        </View>

        {data.isLimitedData && (
          <View className="mt-7 rounded-2xl border border-[#2D6A43] bg-[#16261C] p-4">
            <Text className="text-sm leading-5 text-[#B9E6C6]">Your profile is limited until you build more listening history.</Text>
          </View>
        )}

        <View className="mt-7 rounded-2xl bg-[#1B1B1B] p-5">
          <View className="mb-3 flex-row items-center">
            <Sparkles color="#1DB954" size={17} />
            <Text className="ml-2 text-xs font-bold uppercase tracking-[2px] text-[#1DB954]">Personality</Text>
          </View>
          <Text className="text-base leading-6 text-white">{profile.personality}</Text>
        </View>

        <ListSection title="Top genres" items={profile.topGenres} />
        <ListSection title="Top artists" items={profile.topArtists} />
        <ListSection title="Listening habits" items={profile.listeningHabits} />

        <View className="mt-6 rounded-2xl bg-[#1B1B1B] p-5">
          <Text className="mb-3 text-xs font-bold uppercase tracking-[2px] text-[#1DB954]">A surprising insight</Text>
          <Text className="text-base leading-6 text-white">{profile.surprisingInsight}</Text>
        </View>

        <ListSection title="Try next" items={profile.recommendationDirections} />
        {refresh.error && <Text className="mt-5 text-center text-[#E22134]">{refresh.error.message}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}
