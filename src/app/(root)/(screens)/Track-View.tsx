import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Check,
  ChevronDown,
  ListMusic,
  MoreHorizontal,
  Pause,
  Play,
  Repeat,
  Share2,
  Shuffle,
  SkipBack,
  SkipForward,
  Zap,
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";
import { useGetMusicTrack } from "@/hooks/use-music";
import { formatTime, setupPlayer } from "@/services/player";
import { useAddTrackDataToAnalytics } from "@/hooks/use-analytics";
import { completeListening, startListening } from "@/services/analytics.service";
import { LikeButton } from "@/components/LikeButton";
import { FormSheetModal } from "@/components/FormSheetModel";
import { LinearGradient } from "expo-linear-gradient";

export default function TrackView() {
  const { musicId } = useLocalSearchParams<{
    musicId: string;
  }>();

  const { data: musicData, isLoading, isError } = useGetMusicTrack(musicId);

  const { mutateAsync: adduserdetailstodbforstreamtracking } =
    useAddTrackDataToAnalytics();

  const trackedMusicIdRef = useRef<string | null>(null);
  const listeningMusicIdRef = useRef<string | null>(null);
  const listeningSessionIdRef = useRef<string | null>(null);
  const countedListeningSessionRef = useRef<string | null>(null);

  const [showLimitModal, setShowLimitModal] = useState(false);
  const activeTrack = useActiveTrack();
  const playbackState = usePlaybackState();
  const { duration, position } = useProgress(300);

  const isPlaying = playbackState.state === State.Playing;
  const musicCover = musicData?.coverPhoto?.url || activeTrack?.artwork;
  const musicTitle =
    musicData?.musicTitle || activeTrack?.title || "Unknown title";
  const artistName =
    musicData?.primaryArtistName || activeTrack?.artist || "Unknown artist";
  const musicUrl = musicData?.music?.url || activeTrack?.url;
  const artist = musicData?.artist;
  const artistImage = artist?.profileImage?.url;

  useEffect(() => {
    let cancelled = false;

    async function startTrack() {
      if (!musicUrl || !musicId) return;

      if (activeTrack?.id === musicId) return;

      try {
        if (listeningMusicIdRef.current === musicId) return;

        await setupPlayer();

        if (cancelled) return;

        await TrackPlayer.reset();

        await TrackPlayer.add({
          id: musicId,
          url: musicUrl,
          title: musicTitle,
          artist: artistName,
          artwork: musicCover,
        });

        if (cancelled) return;

        const listeningAccess = await startListening(musicId);
        listeningMusicIdRef.current = musicId;
        listeningSessionIdRef.current = listeningAccess.sessionId;

        await TrackPlayer.play();
      } catch (error) {
        setShowLimitModal(true);
      }
    }

    startTrack();

    return () => {
      cancelled = true;
    };
  }, [musicId, musicUrl, musicTitle, artistName, musicCover]);

  useEffect(() => {
    listeningMusicIdRef.current = null;
    trackedMusicIdRef.current = null;
  }, [musicId]);

  useEffect(() => {
    if (playbackState.state === State.Ended) {
      const listeningSessionId = listeningSessionIdRef.current;
      if (
        listeningSessionId &&
        countedListeningSessionRef.current !== listeningSessionId
      ) {
        countedListeningSessionRef.current = listeningSessionId;

        completeListening(listeningSessionId, true)
          .then((completion) => {
            if (completion?.thresholdReached || completion?.remaining === 0) {
              TrackPlayer.pause().catch(() => null);
              setShowLimitModal(true);
            }
          })
          .catch((error) => {
            console.error("Listening session completion failed:", error);
          });
      }
      trackedMusicIdRef.current = null;
      listeningMusicIdRef.current = null;
      return;
    }

    if (playbackState.state === State.Stopped) {
      trackedMusicIdRef.current = null;
      listeningMusicIdRef.current = null;
      listeningSessionIdRef.current = null;
      countedListeningSessionRef.current = null;
      return;
    }

    const listeningSessionId = listeningSessionIdRef.current;
    if (
      listeningSessionId &&
      countedListeningSessionRef.current !== listeningSessionId &&
      position >= 120
    ) {
      countedListeningSessionRef.current = listeningSessionId;

      completeListening(listeningSessionId, false)

        .catch((error) => {
          countedListeningSessionRef.current = null;
          console.error("Listening session completion failed:", error);
        });
    }

    if (
      !musicId ||
      activeTrack?.id !== musicId ||
      playbackState.state !== State.Playing ||
      position < 20 ||
      trackedMusicIdRef.current === musicId
    ) {
      return;
    }

    trackedMusicIdRef.current = musicId;

    adduserdetailstodbforstreamtracking({ musicId }).catch((error) => {
      trackedMusicIdRef.current = null;
      console.error("Analytics tracking failed:", error);
    });
  }, [
    activeTrack?.id,
    adduserdetailstodbforstreamtracking,
    musicId,
    playbackState.state,
    position,
  ]);

  const togglePlayback = async () => {
    if (isPlaying) await TrackPlayer.pause();
    else await TrackPlayer.play();
  };

  const handleNext = async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      console.error("Failed to skip to next track:", error);
    }
  };

  const handlePrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (error) {
      console.error("Failed to skip to previous track:", error);
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#121212] px-6">
        <Text className="text-center text-white">
          Song data could not be loaded.
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-5 rounded-full bg-white px-5 py-3"
        >
          <Text className="font-semibold text-black">Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#121212]" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <LinearGradient
          colors={["#10301C", "#0B1D12", "#121212"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          className="px-5 -mt-12 pt-12 pb-7 rounded-b-[28px]"
        >
          <View className="pt-2 mt-6 p-5">
            <View className="flex-row items-center justify-between py-2">
              <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
                <ChevronDown color="white" size={26} />
              </TouchableOpacity>
              <Text className="text-[11px] font-bold uppercase tracking-[2px] text-[white]">
                Now playing
              </Text>
              <TouchableOpacity hitSlop={12}>
                <MoreHorizontal color="white" size={25} />
              </TouchableOpacity>
            </View>

            <View className="mt-7 items-center w-full">
              {musicCover ? (
                <Image
                  source={{ uri: String(musicCover) }}
                  className="aspect-square w-full max-w-[390px] rounded-md"
                />
              ) : (
                <View className="aspect-square w-full max-w-[390px] rounded-md bg-[#282828]" />
              )}
            </View>

            <View className="mt-8 flex-row items-center justify-between">
              <View className="flex-1 pr-5">
                <Text
                  numberOfLines={1}
                  className="text-[24px] font-bold text-white"
                >
                  {musicTitle}
                </Text>
                <Text
                  numberOfLines={1}
                  className="mt-1 text-[15px] text-[#b3b3b3]"
                >
                  {artistName}
                </Text>
              </View>
              <LikeButton musicId={musicId} />
            </View>

            <View className="mt-5">
              <Slider
                minimumValue={0}
                maximumValue={Math.max(duration, 1)}
                value={Math.min(position, duration || 0)}
                minimumTrackTintColor="#ffffff"
                maximumTrackTintColor="#5e5e5e"
                thumbTintColor="#ffffff"
                onSlidingComplete={(value) => TrackPlayer.seekTo(value)}
              />
              <View className="-mt-1 ml-3 mr-3 flex-row items-center justify-between">
                <Text className="text-[11px] text-[#a7a7a7]">
                  {formatTime(position)}
                </Text>
                <Text className="text-[11px] text-[#a7a7a7]">
                  -{formatTime(Math.max(duration - position, 0))}
                </Text>
              </View>
            </View>

            <View className="mt-5 mb-4 flex-row items-center justify-between px-2">
              <Shuffle color="#b3b3b3" size={20} />

              <TouchableOpacity onPress={handlePrevious} hitSlop={12}>
                <SkipBack color="white" fill="white" size={26} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={togglePlayback}
                className="h-[64px] w-[64px] items-center justify-center rounded-full bg-white"
              >
                {isPlaying ? (
                  <Pause color="#121212" fill="#121212" size={29} />
                ) : (
                  <Play color="#121212" fill="#121212" size={29} />
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={handleNext} hitSlop={12}>
                <SkipForward color="white" fill="white" size={26} />
              </TouchableOpacity>

              <Repeat color="#1ed760" size={20} />
            </View>
          </View>
        </LinearGradient>

        {artist && (
          <View className="mt-8 px-5 pb-8">
            <View className="overflow-hidden rounded-2xl bg-[#10301C] relative active:opacity-95">
              {artistImage ? (
                <Image
                  source={{ uri: artistImage }}
                  className="h-[260px] w-full object-cover"
                />
              ) : (
                <View className="h-[260px] w-full items-center justify-center bg-[#0B1D12]">
                  <Text className="text-neutral-500 font-medium">No Artist Image</Text>
                </View>
              )}

              <View className="absolute inset-0 bg-[#10301C]/40" />

              <View className="absolute top-5 left-5">
                <Text className="text-[11px] font-extrabold uppercase tracking-[1.5px] text-white bg-black/40 px-2.5 py-1 rounded-full overflow-hidden backdrop-blur-md">
                  About the artist
                </Text>
              </View>

              <View className="absolute bottom-5 left-5 right-5">
                <Text className="text-[20px] font-black tracking-tight text-white mb-1" numberOfLines={1}>
                  {artistName}
                </Text>
              </View>
            </View>
          </View>
        )}
       <FormSheetModal
  visible={showLimitModal}
  title="You've Reached Your Limit"
  onClose={() => setShowLimitModal(false)}
>
  <View className="items-center mb-5">
    {/* Glowing Spotify Green Badge */}
    <View className="w-16 h-16 rounded-full bg-[#1DB954]/20 items-center justify-center border border-[#1DB954]/40 shadow-lg shadow-[#1DB954]/20">
      <Zap size={32} color="#1DB954" fill="#1DB954" />
    </View>
  </View>

  <Text className="text-neutral-300 text-sm leading-6 text-center mb-5 px-1 font-medium">
    You’ve listened to your <Text className="text-white font-bold">3 free songs</Text> for today. Upgrade to Premium to keep the music playing without interruption.
  </Text>

  {/* Quick Feature Perks */}
  <View className="bg-[#242424] rounded-2xl p-3.5 mb-6 gap-2 border border-white/5">
    <View className="flex-row items-center gap-2.5">
      <Check size={15} color="#1DB954" strokeWidth={3} />
      <Text className="text-neutral-200 text-xs font-semibold">Unlimited song plays</Text>
    </View>
    <View className="flex-row items-center gap-2.5">
      {/* <Check size={15} color="#1DB954" strokeWidth={3} /> */}
      {/* <Text className="text-neutral-200 text-xs font-semibold">Ad-free high definition audio</Text> */}
    </View>
  </View>

  {/* Spotify Primary Green Action Button */}
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={() => {
      setShowLimitModal(false);
      router.push("/(root)/(tabs)/premium");
    }}
    className="w-full bg-[#1DB954] py-4 rounded-full items-center justify-center shadow-xl shadow-[#1DB954]/40 active:scale-[0.98]"
  >
    <Text className="text-black text-sm font-black tracking-widest uppercase">
      GET PREMIUM NOW
    </Text>
  </TouchableOpacity>
</FormSheetModal>
      </ScrollView>
    </SafeAreaView>


  );
}
