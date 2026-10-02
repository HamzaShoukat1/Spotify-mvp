import { useState } from "react";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { ImagePlus, Pencil } from "lucide-react-native";
import { useArtistContext } from "@/context/ArtistContext";
import { ArtistStepLayout } from "@/components/ArtistStepLayout";

async function chooseImage(onSelected: (uri: string) => void) {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    quality: 0.8,
  });
  if (!result.canceled) onSelected(result.assets[0].uri);
}

export default function ArtistImages() {
  const { artistData, updateArtist } = useArtistContext();
  const [profileImage, setProfileImage] = useState(artistData.profileImage);
  const [coverImage, setCoverImage] = useState(artistData.coverImage);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!profileImage || !coverImage) {
      setError("Choose both a profile image and a cover image.");
      return;
    }
    updateArtist({ profileImage, coverImage });
    router.push("/(root)/(artist)/artist-ready");
  };

  const pick = (kind: "profile" | "cover") =>
    chooseImage((uri) => {
      setError("");
      kind === "profile" ? setProfileImage(uri) : setCoverImage(uri);
    });

  return (
    <ArtistStepLayout
      step={3}
      title="Make it yours"
      description="Choose images that make your artist profile unmistakably you."
      onBack={() => router.back()}
      onNext={handleNext}
    >
      <Text className="mb-3 text-xs font-bold uppercase tracking-[1px] text-[#B3B3B3]">
        Profile image
      </Text>
      <TouchableOpacity
        onPress={() => pick("profile")}
        className="h-44 overflow-hidden rounded-2xl border border-[#303030] bg-[#1B1B1B]"
      >
        {profileImage ? (
          <View className="flex-1">
            <Image
              source={{ uri: profileImage }}
              className="h-full w-full"
              resizeMode="cover"
            />
            <View className="absolute bottom-3 right-3 rounded-full bg-black/75 p-2">
              <Pencil size={16} color="#FFFFFF" />
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center">
            <View className="rounded-full bg-[#263B2D] p-4">
              <ImagePlus size={26} color="#1ED760" />
            </View>
            <Text className="mt-3 font-bold text-white">Add profile image</Text>
            <Text className="mt-1 text-xs text-[#777777]">
              Square works best
            </Text>
          </View>
        )}
      </TouchableOpacity>
      <Text className="mb-3 mt-7 text-xs font-bold uppercase tracking-[1px] text-[#B3B3B3]">
        Cover image
      </Text>
      <TouchableOpacity
        onPress={() => pick("cover")}
        className="h-36 overflow-hidden rounded-2xl border border-[#303030] bg-[#1B1B1B]"
      >
        {coverImage ? (
          <View className="flex-1">
            <Image
              source={{ uri: coverImage }}
              className="h-full w-full"
              resizeMode="cover"
            />
            <View className="absolute bottom-3 right-3 rounded-full bg-black/75 p-2">
              <Pencil size={16} color="#FFFFFF" />
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center">
            <ImagePlus size={26} color="#1ED760" />
            <Text className="mt-3 font-bold text-white">Add cover image</Text>
            <Text className="mt-1 text-xs text-[#777777]">
              Wide images look best
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
