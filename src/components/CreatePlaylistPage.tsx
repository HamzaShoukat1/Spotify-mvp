import { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Mic } from "lucide-react-native";
import { useCreatePlaylist } from "@/hooks/use-playlist";
import { useAuth } from "@/context/Auth.Context";
import Toast from "react-native-toast-message";

export default function CreatePlaylistPage() {
  const [name, setName] = useState("");
  const create = useCreatePlaylist();
  const router = useRouter();
  const { isPremium } = useAuth();

  useFocusEffect(
    useCallback(() => {
      setName("");
    }, []),
  );
  const isButtonDisabled = !name.trim() || create.isPending;

  const submit = () => {
    const cleanName = name.trim();
    if (!cleanName || create.isPending) return;
    create.mutate(cleanName, {
      onSuccess: (playlist) =>
        router.replace({
          pathname: "/(root)/(screens)/Playlist-Detail",
          params: { id: playlist._id },



        }),
      onError: (error) =>
        Alert.alert("Could not create playlist", error.message),
    });
  };
  const handlePress = () => {
    if (!isPremium) {
      Toast.show({
        type: "error",
        position: "top",
        visibilityTime: 2000,
        text1: "Premium Feature",
        text2: "Upgrade your account to access this feature.",
      });
      return;
    }

    router.push('/(root)/(screens)/Voice-Agent');
  };


  return (
    <SafeAreaView className="flex-1 bg-[#121212]" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1 px-8"
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 80}
      >
        <View className="flex-1 justify-center items-center">
          <Text className="text-2xl font-bold tracking-tight text-white text-center mb-10">
            Give your playlist a name
          </Text>

          <TextInput
            accessibilityLabel="Playlist name"
            value={name}
            onChangeText={setName}
            autoFocus
            maxLength={20}
            placeholder="My Playlist"
            placeholderTextColor="#777777"
            onSubmitEditing={submit}
            textAlign="center"
            className="min-w-[200px] text-3xl font-bold text-white border-b border-[#282828] pb-4 tracking-wide text-center"
          />

          <View className="mt-8 flex-row items-center justify-center gap-6">
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => router.back()}
              disabled={create.isPending}
              className="px-6 py-3"
            >
              <Text className="text-sm font-bold text-white tracking-wider">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityRole="button"
              onPress={submit}
              disabled={isButtonDisabled}
              className={`rounded-full px-8 py-3.5 ${isButtonDisabled ? "bg-[#333333]" : "bg-[#1DB954]"
                }`}
            >
              <Text className="text-sm font-bold tracking-wider text-center">
                {create.isPending ? "Creating…" : "Create"}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Create a playlist with your voice"
            // onPress={() => router.push("/(root)/(screens)/Voice-Agent")}
            onPress={handlePress}
            className="mt-10 w-full flex-row items-center rounded-2xl border border-[#1DB954] bg-[#1B1B1B] px-5 py-4"
          >
            <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-[#1DB954]">
              <Mic color="#000000" size={20} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-white">Create with your voice</Text>
              <Text className="mt-1 text-xs text-[#A7A7A7]">Describe the mood, genre, or language</Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
