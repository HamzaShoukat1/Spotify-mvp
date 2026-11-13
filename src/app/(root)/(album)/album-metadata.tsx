import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { ImagePlus, Pencil } from "lucide-react-native";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ArtistStepLayout } from "@/components/ArtistStepLayout";
import { useAlbumContext } from "@/context/AlbumContext";

export default function AlbumMetadata() {
  const { albumDraft, updateAlbum } = useAlbumContext();
  const [error, setError] = useState("");

  const chooseCover = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0])
      updateAlbum({ coverPhoto: result.assets[0].uri });
  };

  const handleNext = () => {
    if (!albumDraft.albumTitle.trim() || !albumDraft.artistName.trim() || !albumDraft.coverPhoto) {
      setError("Add an album title, artist name, and cover art to continue.");
      return;
    }
    router.push("/(root)/(album)/album-tracks");
  };

  return (
    <ArtistStepLayout
      step={1}
      totalSteps={3}
      title="Create your album"
      description="Set the identity of your release before adding its tracks."
      onBack={() => router.back()}
      onNext={handleNext}
    >
      <Text className="mb-2 text-xs font-bold uppercase tracking-[1px] text-[#A7A7A7]">
        Album title
      </Text>
      <TextInput
        value={albumDraft.albumTitle}
        onChangeText={(albumTitle) => updateAlbum({ albumTitle: albumTitle.replace(/[^a-zA-Z0-9 _.-]/g, "") })}
        placeholder="e.g. Midnight Signals"
        placeholderTextColor="#777"
        className="mb-5 h-14 rounded-xl border border-[#303030] bg-[#1B1B1B] px-4 text-base text-white"
      />
      <Text className="mb-2 text-xs font-bold uppercase tracking-[1px] text-[#A7A7A7]">
        Artist name
      </Text>
      <TextInput
        value={albumDraft.artistName}
        onChangeText={(artistName) => updateAlbum({ artistName })}
        placeholder="Your artist name"
        placeholderTextColor="#777"
        className="mb-5 h-14 rounded-xl border border-[#303030] bg-[#1B1B1B] px-4 text-base text-white"
      />
      <TouchableOpacity
        onPress={chooseCover}
        className="h-56 overflow-hidden rounded-2xl border border-[#3D5C45] bg-[#142719]"
      >
        {albumDraft.coverPhoto ? (
          <View className="flex-1">
            <Image
              source={{ uri: albumDraft.coverPhoto }}
              className="h-full w-full"
              resizeMode="cover"
            />
            <View className="absolute bottom-3 right-3 rounded-full bg-black/75 p-2">
              <Pencil size={16} color="#FFFFFF" />
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center">
            <ImagePlus size={30} color="#1ED760" />
            <Text className="mt-3 text-base font-black text-white">
              Choose cover art
            </Text>
            <Text className="mt-1 text-sm text-[#A7A7A7]">
              JPG, PNG, or WEBP
            </Text>
          </View>
        )}
      </TouchableOpacity>
      {error ? (
        <Text className="mt-4 text-sm text-[#FF6B6B]">{error}</Text>
      ) : null}
    </ArtistStepLayout>
  );
}
