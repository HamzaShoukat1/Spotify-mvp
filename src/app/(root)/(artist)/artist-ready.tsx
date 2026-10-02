import { router } from "expo-router";
import { Alert, Text, View } from "react-native";
import { Check, Mic2, UserRound } from "lucide-react-native";
import { useArtistContext } from "@/context/ArtistContext";
import { usebecameArtist } from "@/hooks/useArtist";
import { ArtistStepLayout } from "@/components/ArtistStepLayout";

export default function ArtistReady() {
  const { artistData, resetArtist } = useArtistContext();
  const { mutateAsync, isPending, error } = usebecameArtist();

  const createArtist = async () => {
    try {
      await mutateAsync(artistData);
      resetArtist();
      router.replace("/(root)/(screens)/Artist-hub");
    } catch (requestError) {
      Alert.alert(
        "Unable to create artist",
        requestError instanceof Error
          ? requestError.message
          : "Please check your connection and try again.",
      );
    }
  };

  return (
    <ArtistStepLayout
      step={4}
      title="You're ready"
      description="Everything looks good. Create your artist profile and start building your hub."
      onBack={() => router.back()}
      onNext={createArtist}
      nextLabel="Create artist"
      isPending={isPending}
    >
      <View className="mb-7 items-center rounded-2xl border border-[#285B38] bg-[#142719] px-5 py-7">
        <View className="mb-4 rounded-full bg-[#1ED760] p-4">
          <Check size={30} color="#000000" strokeWidth={3} />
        </View>
        <Text className="text-center text-lg font-black text-white">
          Your artist profile is ready
        </Text>
        <Text className="mt-2 text-center text-sm leading-5 text-[#A7A7A7]">
          One last tap and you’ll be taken to your Artist Hub.
        </Text>
      </View>
      <View className="overflow-hidden rounded-2xl border border-[#303030] bg-[#1B1B1B]">
        <View className="flex-row items-center border-b border-[#303030] px-4 py-4">
          <View className="mr-3 rounded-full bg-[#303030] p-2">
            <UserRound size={18} color="#1ED760" />
          </View>
          <View className="flex-1">
            <Text className="text-xs uppercase tracking-[1px] text-[#777777]">
              Artist name
            </Text>
            <Text className="mt-1 text-base font-bold text-white">
              {artistData.name}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center px-4 py-4">
          <View className="mr-3 rounded-full bg-[#303030] p-2">
            <Mic2 size={18} color="#1ED760" />
          </View>
          <View className="flex-1">
            <Text className="text-xs uppercase tracking-[1px] text-[#777777]">
              Sound
            </Text>
            <Text className="mt-1 text-base font-bold text-white">
              {artistData.artistType} · {artistData.genres}
            </Text>
          </View>
        </View>
      </View>
      {error ? (
        <Text className="mt-4 text-center text-sm text-[#FF6B6B]">
          {error instanceof Error ? error.message : "Unable to create artist."}
        </Text>
      ) : null}
    </ArtistStepLayout>
  );
}
