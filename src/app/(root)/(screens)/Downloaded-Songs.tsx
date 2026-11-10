import { useState, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { router } from "expo-router";
import {
  ArrowLeft,
  ArrowDownCircle,
  CheckCircle2,
  Trash2,
  WifiOff,
  Search,
  X,
  HardDrive,
  Music2,
  FolderX,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import TrackPlayer, { State, useActiveTrack, usePlaybackState } from "react-native-track-player";
import {
  useDownloadedSongs,
  useOfflineEntitlement,
  useRemoveAllDownloads,
  useSongDownload,
} from "@/hooks/use-downloads";
import type { LocalDownloadRecord } from "@/storage/download-storage";
import { useNetwork } from "@/context/NetworkContext";
import { PlayingIndicator } from "@/components/PlayingIndicator";
import { FormSheetModal } from "@/components/FormSheetModel";

function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

function formatDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) return "";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

export default function DownloadedSongs() {
  const { downloadedSongs, isLoading, count } = useDownloadedSongs();
  const { removeAllAsync, isDeleting: isDeletingAll } = useRemoveAllDownloads();
  const { isOffline } = useNetwork();
  useOfflineEntitlement();

  const activeTrack = useActiveTrack();
  const playbackState = usePlaybackState();
  const isPlaying = playbackState.state === State.Playing;
  const activeTrackId = String(activeTrack?.id ?? "");

  const [searchQuery, setSearchQuery] = useState("");
  const [songToRemove, setSongToRemove] = useState<LocalDownloadRecord | null>(null);
  const [showRemoveAllModal, setShowRemoveAllModal] = useState(false);

  const { removeDownload } = useSongDownload(songToRemove?.musicId ?? "");

  const totalBytes = useMemo(
    () => downloadedSongs.reduce((acc, item) => acc + (item.fileSize || 0), 0),
    [downloadedSongs]
  );

  const filteredSongs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return downloadedSongs;
    return downloadedSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(q) || song.artist.toLowerCase().includes(q)
    );
  }, [downloadedSongs, searchQuery]);

  const handlePlaySong = (musicId: string) => {
    router.push({
      pathname: "/Track-View",
      params: { musicId },
    });
  };

  const confirmRemoveSong = async () => {
    if (!songToRemove) return;
    try {
      await removeDownload();
      setSongToRemove(null);
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Could not delete download");
    }
  };

  const confirmRemoveAllSongs = async () => {
    try {
      await removeAllAsync();
      setShowRemoveAllModal(false);
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Could not remove all downloads");
    }
  };

  const renderItem = ({ item, index }: { item: LocalDownloadRecord; index: number }) => {
    const isActive = activeTrackId === item.musicId;

    return (
      <Pressable
        accessibilityLabel={`${item.title} by ${item.artist}`}
        onPress={() => handlePlaySong(item.musicId)}
        className="flex-row items-center px-4 py-2.5 active:bg-white/5 rounded-xl mx-2"
      >
        {/* Track Index or Playing Animation */}
        <View className="w-7 items-center justify-center mr-2">
          {isActive && isPlaying ? (
            <PlayingIndicator />
          ) : (
            <Text
              className={
                isActive
                  ? "text-xs font-bold text-[#1DB954]"
                  : "text-xs font-semibold text-[#666666]"
              }
            >
              {index + 1}
            </Text>
          )}
        </View>

        {/* Cover Photo */}
        {item.coverPhoto ? (
          <Image
            source={{ uri: item.coverPhoto }}
            className="h-12 w-12 rounded-md bg-[#242424]"
            resizeMode="cover"
          />
        ) : (
          <View className="h-12 w-12 items-center justify-center rounded-md bg-[#242424]">
            <Music2 size={20} color="#777" />
          </View>
        )}

        {/* Title, Artist, and File Size */}
        <View className="ml-3 flex-1 justify-center pr-2">
          <Text
            numberOfLines={1}
            className={
              isActive
                ? "text-[15px] font-bold text-[#1DB954]"
                : "text-[15px] font-semibold text-white"
            }
          >
            {item.title}
          </Text>

          <View className="flex-row items-center mt-1">
            <CheckCircle2 size={12} color="#1DB954" />
            <Text numberOfLines={1} className="ml-1.5 text-xs text-[#A7A7A7]">
              {item.artist}
              {item.fileSize ? ` • ${formatFileSize(item.fileSize)}` : ""}
              {item.duration ? ` • ${formatDuration(item.duration)}` : ""}
            </Text>
          </View>
        </View>

        {/* Remove Button */}
        <TouchableOpacity
          onPress={() => setSongToRemove(item)}
          className="p-2.5 -mr-1 rounded-full active:bg-white/10"
          hitSlop={8}
          accessibilityLabel={`Remove ${item.title}`}
        >
          <Trash2 size={17} color="#FF0000" />
        </TouchableOpacity>
      </Pressable>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#121212] justify-center items-center">
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#121212] relative">
      {/* Top Background Linear Gradient */}
      <LinearGradient
        colors={["#0F4A24", "#0D2E18", "#121212"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        className="absolute top-0 left-0 right-0 h-96 z-0"
      />

      {/* Top Navbar */}
      <SafeAreaView edges={["top"]} className="bg-transparent z-20">
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 -ml-2 rounded-full active:bg-white/10"
            hitSlop={10}
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View className="flex-1 ml-2">
            <Text numberOfLines={1} className="text-base font-bold text-white">
              Downloaded Songs
            </Text>
            <Text className="text-[11px] text-[#A7A7A7]">
              {count} {count === 1 ? "song" : "songs"}
              {totalBytes > 0 ? ` • ${formatFileSize(totalBytes)}` : ""}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            {isOffline && (
              <View className="flex-row items-center bg-[#1B2B1F]/80 border border-[#1DB954]/40 px-2.5 py-1 rounded-full">
                <WifiOff size={11} color="#1DB954" />
                <Text className="text-[#1DB954] text-[10px] font-extrabold ml-1.5 uppercase tracking-wider">
                  Offline
                </Text>
              </View>
            )}

            {count > 0 && (
              <TouchableOpacity
                onPress={() => setShowRemoveAllModal(true)}
                className="p-2 rounded-full active:bg-white/10"
                hitSlop={8}
                accessibilityLabel="Remove all downloads"
              >
                <FolderX size={20} color="#FF0000" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>

      {/* Main Content */}
      {count === 0 ? (
        <View className="flex-1 items-center justify-center px-8 z-10">
          <View className="w-20 h-20 rounded-full bg-[#181818] border border-white/10 items-center justify-center mb-5">
            <ArrowDownCircle size={38} color="#1DB954" />
          </View>
          <Text className="text-white text-xl font-extrabold text-center mb-2">
            No downloaded songs yet
          </Text>
          <Text className="text-[#A7A7A7] text-sm text-center leading-5 max-w-[280px]">
            Tap the download button on any track to listen offline without Wi-Fi or data.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredSongs}
          keyExtractor={(item) => item.musicId}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 110 }}
          className="z-10"
          ListHeaderComponent={
            <View>
              {/* Search Filter Bar */}
              <View className="px-5 pt-2 pb-3">
                <View className="flex-row items-center bg-[#242424]/90 rounded-xl px-3.5 py-2.5 border border-white/10 shadow-sm">
                  <Search size={16} color="#888888" />
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Find in downloaded songs"
                    placeholderTextColor="#777777"
                    className="flex-1 text-white text-xs ml-2 py-0 m-0"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")} className="p-1">
                      <X size={14} color="#AAAAAA" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Spotify Hero Banner */}
              <View className="px-5 pt-2 pb-5">
                <View className="flex-row items-center mb-4">
                  <View className="w-9 h-9 rounded-full bg-[#1DB954]/20 border border-[#1DB954]/30 items-center justify-center mr-3">
                    <HardDrive size={18} color="#1DB954" />
                  </View>
                  <View className="flex-1 justify-center">
                    <Text className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-[#85e1a3]">
                      Offline Storage
                    </Text>
                    <Text className="text-white font-semibold text-xs mt-0.5">
                      {formatFileSize(totalBytes)} used on device
                    </Text>
                  </View>
                </View>

                {/* Header Title */}
                <Text className="text-3xl font-black text-white tracking-tight mb-1">
                  Downloaded
                </Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            searchQuery.trim().length > 0 ? (
              <View className="py-12 items-center px-6">
                <Text className="text-white text-base font-bold mb-1">
                  No matching downloads
                </Text>
                <Text className="text-[#888] text-xs text-center">
                  Couldn't find any downloaded song matching "{searchQuery}".
                </Text>
              </View>
            ) : null
          }
        />
      )}

      {/* Remove Single Song Confirmation Sheet */}
      <FormSheetModal
        visible={!!songToRemove}
        title="Remove Download"
        onClose={() => setSongToRemove(null)}
      >
        <View className="items-center mb-4">
          <View className="w-14 h-14 rounded-full bg-red-500/15 border border-red-500/30 items-center justify-center mb-3">
            <Trash2 size={24} color="#EF4444" />
          </View>
          <Text className="text-white text-base font-bold text-center" numberOfLines={1}>
            {songToRemove?.title}
          </Text>
          <Text className="text-[#999999] text-xs text-center mt-1" numberOfLines={1}>
            {songToRemove?.artist}
          </Text>
        </View>

        <Text className="text-[#A7A7A7] text-xs text-center mb-5 leading-5 px-3">
          This song will be removed from your device storage and will no longer be available for offline listening.
        </Text>

        <TouchableOpacity
          onPress={confirmRemoveSong}
          activeOpacity={0.85}
          className="w-full bg-[#EF4444] py-3.5 rounded-full items-center justify-center mb-2.5"
        >
          <Text className="text-white font-extrabold text-xs uppercase tracking-wider">
            Remove from Downloads
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSongToRemove(null)}
          activeOpacity={0.7}
          className="w-full py-3 items-center justify-center rounded-full"
        >
        </TouchableOpacity>
      </FormSheetModal>

      {/* Remove All Downloads Confirmation Sheet */}
      <FormSheetModal
        visible={showRemoveAllModal}
        title="Remove All Downloads"
        onClose={() => setShowRemoveAllModal(false)}
      >
        <View className="items-center mb-4">
          <View className="w-14 h-14 rounded-full bg-red-500/15 border border-red-500/30 items-center justify-center mb-3">
            <Trash2 size={24} color="#EF4444" />
          </View>
          <Text className="text-white text-base font-bold text-center">
            Remove All Downloads?
          </Text>
        </View>

        <Text className="text-[#A7A7A7] text-xs text-center mb-5 leading-5 px-3">
          This will remove all {count} downloaded {count === 1 ? "song" : "songs"} from your device storage. They will no longer be available for offline listening.
        </Text>

        <TouchableOpacity
          onPress={confirmRemoveAllSongs}
          disabled={isDeletingAll}
          activeOpacity={0.85}
          className="w-full bg-[#EF4444] py-3.5 rounded-full items-center justify-center mb-2.5"
        >
          {isDeletingAll ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className="text-white font-extrabold text-xs uppercase tracking-wider">
              Remove All Downloads
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowRemoveAllModal(false)}
          activeOpacity={0.7}
          className="w-full py-3 items-center justify-center rounded-full"
        >
        </TouchableOpacity>
      </FormSheetModal>
    </View>
  );
}