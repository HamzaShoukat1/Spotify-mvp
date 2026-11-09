import { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import {
  ArrowDownCircle,
  CheckCircle2,
  Play,
  Trash2,
  AlertCircle,
} from "lucide-react-native";
import { useSongDownload } from "../hooks/use-downloads";
import { useAuth } from "../context/Auth.Context";
import Toast from "react-native-toast-message";

interface DownloadButtonProps {
  musicId: string | null | undefined;
  title?: string;
  artist?: string;
  coverPhoto?: string;
  duration?: number;
  size?: number;
  color?: string;
}

export function DownloadButton({
  musicId,
  title = "Unknown Song",
  artist = "Unknown Artist",
  coverPhoto = "",
  duration = 0,
  size = 22,
  color = "#B3B3B3",
}: DownloadButtonProps) {
  const { isPremium } = useAuth();
  const {
    isDownloaded,
    isDownloading,
    isPaused,
    isFailed,
    progress,
    startDownload,
    pauseDownload,
    resumeDownload,
    removeDownload,
    retryDownload,
  } = useSongDownload(musicId);

  const [showOptionsModal, setShowOptionsModal] = useState(false);

  if (!musicId) return null;

  const handlePress = async () => {
    if (!isPremium) {
      Toast.show({
        type: "info",
        position: "top",
        visibilityTime: 2000,
        text1: "Premium Feature",
        text2: "Upgrade your account to download music.",
      });
      return;
    }

    if (isDownloaded) {
      setShowOptionsModal(true);
      return;
    }

    if (isDownloading) {
      await pauseDownload();
      return;
    }
    if (isPaused) {
      await resumeDownload();
      return;
    }

    if (isFailed) {
      await retryDownload();
      return;
    }

    await startDownload({
      title,
      artist,
      coverPhoto,
      duration,
    });
  };

  const handleRemove = async () => {
    setShowOptionsModal(false);
    await removeDownload();
  };

  return (
    <>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        className="items-center justify-center p-1"
        accessibilityLabel={
          isDownloaded
            ? "Downloaded. Tap to manage"
            : isDownloading
              ? `Downloading ${progress?.progressPercentage || 0}%`
              : "Download song"
        }
      >
        {isDownloaded ? (
          <CheckCircle2 size={size} color="#1DB954"  />
        ) : isDownloading ? (
          <View className="relative items-center justify-center">
            <ActivityIndicator size="small" color="#1DB954" />
            {progress && progress.progressPercentage > 0 ? (
              <Text className="text-[9px] font-bold text-[#1DB954] mt-0.5">
                {progress.progressPercentage}%
              </Text>
            ) : null}
          </View>
        ) : isPaused ? (
          <Play size={size} color="#1DB954" />
        ) : isFailed ? (
          <AlertCircle size={size} color="#E91429" />
        ) : (
          <ArrowDownCircle size={size} color={color} />
        )}
      </TouchableOpacity>

      {/* Remove / Options Modal */}
      <Modal
        visible={showOptionsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <Pressable
          className="flex-1 bg-black/60 items-center justify-center px-6"
          onPress={() => setShowOptionsModal(false)}
        >
          <Pressable
            className="w-full max-w-sm rounded-2xl bg-[#282828] p-5 shadow-2xl"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="items-center mb-4">
              <View className="w-12 h-12 rounded-full bg-[#1DB954]/20 items-center justify-center mb-3">
                <CheckCircle2 size={28} color="#1DB954" />
              </View>
              <Text
                className="text-white text-base font-bold text-center"
                numberOfLines={1}
              >
                {title}
              </Text>
              <Text
                className="text-[#a7a7a7] text-xs text-center mt-1"
                numberOfLines={1}
              >
                {artist} • Downloaded
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleRemove}
              className="flex-row items-center justify-center bg-[#E91429]/20 border border-[#E91429]/40 py-3 rounded-full mb-3"
            >
              <Trash2 size={18} color="#E91429" className="mr-2" />
              <Text className="text-[#E91429] font-bold text-sm ml-2">
                Remove Download
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowOptionsModal(false)}
              className="py-3 items-center justify-center"
            >
              <Text className="text-white text-sm font-semibold">Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
