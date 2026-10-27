import { useState } from "react";
import { useRouter } from "expo-router";
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
import { useCreatePlaylist } from "@/hooks/use-playlist";

export default function CreatePlaylistPage() {
  const [name, setName] = useState("");
  const create = useCreatePlaylist();
  const router = useRouter();

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
              className={`rounded-full px-8 py-3.5 ${
                isButtonDisabled ? "bg-[#333333]" : "bg-[#1DB954]"
              }`}
            >
              <Text className="text-sm font-bold tracking-wider text-center">
                {create.isPending ? "Creating…" : "Create"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
