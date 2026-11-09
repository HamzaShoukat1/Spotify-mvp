import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Check,
  ChevronDown,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Zap,
} from "lucide-react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";
import { useGetMusicTrack } from "@/hooks/use-music";
import { formatTime, setupPlayer } from "@/services/player";
import { useAddTrackDataToAnalytics } from "@/hooks/use-analytics";
import { startListening } from "@/services/analytics.service";
import { useListeningLimit } from "@/context/ListeningLimitContext";
import { LikeButton } from "@/components/LikeButton";
import { DownloadButton } from "@/components/DownloadButton";
import { useSongDownload, useOfflineEntitlement } from "@/hooks/use-downloads";
import { FormSheetModal } from "@/components/FormSheetModel";
import { LinearGradient } from "expo-linear-gradient";
import { useQueryClient } from "@tanstack/react-query";
import { useNetwork } from "@/context/NetworkContext";
import Toast from "react-native-toast-message";
import { WifiOff } from "lucide-react-native";

function TrackViewContent({
  musicId,
}: {
  musicId: string;
}) {
  const queryClient = useQueryClient();
  const { isOffline } = useNetwork();
  const { height: screenHeight } = useWindowDimensions();
  const sheetTranslateY = useSharedValue(0);
  const isClosing = useSharedValue(false);

  useFocusEffect(
    useCallback(() => {
      cancelAnimation(sheetTranslateY);
      sheetTranslateY.value = 0;
      isClosing.value = false;
    }, [isClosing, sheetTranslateY]),
  );

  const dismissPlayer = () => router.back();
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  const dragHandleGesture = Gesture.Pan()
    .activeOffsetY(8)
    .failOffsetX([-12, 12])
    .onUpdate(({ translationY }) => {
      sheetTranslateY.value = Math.max(0, translationY);
    })
    .onEnd(({ translationY, velocityY }) => {
      if (!isClosing.value && (translationY > 100 || velocityY > 850)) {
        isClosing.value = true;
        sheetTranslateY.value = withTiming(
          screenHeight,
          { duration: 220 },
          (finished) => {
            if (finished) runOnJS(dismissPlayer)();
            else isClosing.value = false;
          },
        );
      } else {
        sheetTranslateY.value = withSpring(0, {
          damping: 24,
          stiffness: 260,
          mass: 0.8,
        });
      }
    });

  const { data: musicData, isError, isLoading: isMusicLoading } = useGetMusicTrack(musicId);

  const { mutateAsync: adduserdetailstodbforstreamtracking } =
    useAddTrackDataToAnalytics();
  const {
    playCount,
    isLimitReached,
    showUpgradeModal,
    isLoading,
    setLoading,
    setListeningAccess,
    resetTrackRegistration,
    registerListeningAtHalf,
    openUpgradeModal,
    closeUpgradeModal,
  } = useListeningLimit();

  const trackedMusicIdRef = useRef<string | null>(null);
  const listeningMusicIdRef = useRef<string | null>(null);
  const limitModalShownSessionRef = useRef<string | null>(null);
  const listenedSecondsRef = useRef(0);
  const lastPlaybackPositionRef = useRef<number | null>(null);

  const showFreeLimitModal = useCallback((sessionId?: string | null) => {
    if (sessionId && limitModalShownSessionRef.current === sessionId) return;
    if (sessionId) limitModalShownSessionRef.current = sessionId;
    TrackPlayer.pause().catch(() => null);
    openUpgradeModal();
  }, [openUpgradeModal]);

  const closeLimitModalAndGoHome = useCallback(async () => {
    closeUpgradeModal();
    try {
      await TrackPlayer.reset();
    } catch (error) {
      console.error("Failed to stop playback after reaching the free limit:", error);
      await TrackPlayer.pause().catch(() => null);
    }
    router.replace("/(root)/(tabs)/home");
  }, [closeUpgradeModal]);

  const { record: downloadRecord, isDownloaded } = useSongDownload(musicId);
  const { checkCanPlayOffline } = useOfflineEntitlement();

  const activeTrack = useActiveTrack();
  const playbackState = usePlaybackState();
  const { duration, position } = useProgress(300);

  const isPlaying = playbackState.state === State.Playing;
  const isCurrentTrack = activeTrack?.id === musicId;
  const trackPosition = isCurrentTrack ? position : 0;
  const trackDuration = isCurrentTrack ? duration : 0;

  const musicCover =
    musicData?.coverPhoto?.url || downloadRecord?.coverPhoto || (isCurrentTrack ? activeTrack?.artwork : undefined);
  const musicTitle =
    musicData?.musicTitle || downloadRecord?.title || (isCurrentTrack ? activeTrack?.title : undefined) || "Unknown title";
  const artistName =
    musicData?.primaryArtistName || downloadRecord?.artist || (isCurrentTrack ? activeTrack?.artist : undefined) || "Unknown artist";
  const musicUrl =
    isDownloaded && downloadRecord?.localUri
      ? downloadRecord.localUri
      : musicData?.music?.url || (isCurrentTrack ? activeTrack?.url : undefined);
  const artist = musicData?.artist;
  const artistImage = artist?.profileImage?.url;

  useEffect(() => {
    let cancelled = false;

    async function startTrack() {
      if (!musicUrl || !musicId) {
        setLoading(false);
        return;
      }

      if (activeTrack?.id === musicId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        if (listeningMusicIdRef.current === musicId) return;

        await setupPlayer();

        if (cancelled) return;

        const currentTrack = await TrackPlayer.getActiveTrack();
        if (currentTrack?.id === musicId) {
          setLoading(false);
          return;
        }

        if (isDownloaded && downloadRecord?.localUri) {
          if (isOffline) {
            const canPlay = await checkCanPlayOffline();
            if (!canPlay) {
              setLoading(false);
              Toast.show({
                type: "error",
                text1: "Offline access expired",
                text2: "Connect to the internet to verify your Premium subscription.",
                position: "top",
                visibilityTime: 4000,
              });
              return;
            }
          }

          await TrackPlayer.reset();
          await TrackPlayer.add({
            id: musicId,
            url: downloadRecord.localUri,
            title: musicTitle,
            artist: artistName,
            artwork: musicCover,
          });

          listeningMusicIdRef.current = musicId;
          await TrackPlayer.play();
          return;
        }

        const listeningAccess = await startListening(musicId);
        if (cancelled) return;

        await TrackPlayer.reset();

        await TrackPlayer.add({
          id: musicId,
          url: musicUrl,
          title: musicTitle,
          artist: artistName,
          artwork: musicCover,
        });

        listeningMusicIdRef.current = musicId;
        setListeningAccess(listeningAccess);

        await TrackPlayer.play();
        await queryClient.invalidateQueries({
          queryKey: ["recentSongPlaying"],
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (message.toLowerCase().includes("free listening limit")) {
          showFreeLimitModal();
        } else if (isOffline) {
          Toast.show({
            type: "error",
            text1: "You're offline",
            text2: "This song isn't downloaded. Connect to the internet or play downloaded songs.",
            position: "top",
          });
        } else {
          console.error("Failed to start track playback:", error);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    startTrack();

    return () => {
      cancelled = true;
    };
  }, [
    activeTrack?.id,
    artistName,
    checkCanPlayOffline,
    downloadRecord?.localUri,
    isDownloaded,
    isOffline,
    musicCover,
    musicId,
    musicTitle,
    musicUrl,
    queryClient,
    setListeningAccess,
    setLoading,
    showFreeLimitModal,
  ]);

  useEffect(() => {
    listeningMusicIdRef.current = null;
    trackedMusicIdRef.current = null;
    limitModalShownSessionRef.current = null;
    resetTrackRegistration();
    listenedSecondsRef.current = 0;
    lastPlaybackPositionRef.current = null;
  }, [musicId, resetTrackRegistration]);

  useEffect(() => {
    if (playbackState.state !== State.Playing || activeTrack?.id !== musicId) {
      lastPlaybackPositionRef.current = null;
      return;
    }

    const previousPosition = lastPlaybackPositionRef.current;
    if (previousPosition !== null) {
      const progressDelta = position - previousPosition;
      if (progressDelta > 0 && progressDelta <= 2.5) {
        listenedSecondsRef.current += progressDelta;
      }
    }

    lastPlaybackPositionRef.current = position;
  }, [activeTrack?.id, musicId, playbackState.state, position]);

  useEffect(() => {
    if (playbackState.state === State.Ended) {
      if (isLimitReached) showFreeLimitModal(musicId);
      trackedMusicIdRef.current = null;
      listeningMusicIdRef.current = null;
      return;
    }

    if (playbackState.state === State.Stopped) {
      trackedMusicIdRef.current = null;
      listeningMusicIdRef.current = null;
      limitModalShownSessionRef.current = null;
      return;
    }

    if (
      isDownloaded ||
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
    isLimitReached,
    musicId,
    playbackState.state,
    position,
    showFreeLimitModal,
  ]);

  useEffect(() => {
    if (
      isDownloaded ||
      playbackState.state !== State.Playing ||
      activeTrack?.id !== musicId ||
      !duration ||
      position < duration / 2
    ) {
      return;
    }

    registerListeningAtHalf(musicId).catch((error) => {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.toLowerCase().includes("free listening limit")) {
        console.error("Listening milestone registration failed:", error);
      }
    });
  }, [
    activeTrack?.id,
    duration,
    isDownloaded,
    musicId,
    playbackState.state,
    position,
    registerListeningAtHalf,
  ]);

  const togglePlayback = async () => {
    if (isLoading) return;
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

  if (isMusicLoading && !isDownloaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#000000',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  if (isError && !isDownloaded) {
    return (
      <View className="flex-1 justify-center px-6" style={{ backgroundColor: "transparent" }}>
        <View className="items-center rounded-2xl bg-[#121212] p-6 border border-white/10">
          <View className="w-16 h-16 rounded-full bg-[#181818] items-center justify-center mb-4">
            <WifiOff size={28} color="#B3B3B3" />
          </View>
          <Text className="text-center text-white text-lg font-bold mb-1">
            {isOffline ? "You're offline" : "Song could not be loaded"}
          </Text>
          <Text className="text-center text-[#A7A7A7] text-xs leading-5 mb-5 px-3">
            {isOffline
              ? "This song hasn't been downloaded for offline playback. Head over to your downloaded songs to listen offline."
              : "Something went wrong while loading this song."}
          </Text>

          {isOffline && (
            <TouchableOpacity
              onPress={() => {
                router.back();
                router.push("/(root)/(screens)/Downloaded-Songs");
              }}
              activeOpacity={0.85}
              className="w-full bg-[#1DB954] py-3.5 rounded-full items-center justify-center mb-3"
            >
              <Text className="font-extrabold text-black text-xs uppercase tracking-wider">
                Go to Downloaded Songs
              </Text>
            </TouchableOpacity>
          )}

          <Pressable
            onPress={() => router.back()}
            className="rounded-full bg-white/10 px-6 py-2.5"
          >
            <Text className="font-semibold text-white text-xs">Go back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: "transparent" }}>
      <Animated.View
        className="flex-1 overflow-hidden rounded-t-[22px] bg-[#121212]"
        style={[{ backgroundColor: "#121212" }, sheetStyle]}
      >
        <SafeAreaView
          className="flex-1 bg-[#121212]"
          style={{ backgroundColor: "#121212" }}
          edges={["top"]}
        >
          <GestureDetector gesture={dragHandleGesture}>
            <View
              className="h-14 items-center justify-center bg-[#10301C]"
              accessibilityRole="adjustable"
              accessibilityLabel="Swipe down to close the player"
            >
              <View className="h-1 w-9 rounded-full bg-white/45" />
            </View>
          </GestureDetector>
          <ScrollView
            style={{ flex: 1, backgroundColor: "#121212" }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 48,
              backgroundColor: "#121212",
            }}
          >
            <LinearGradient
              colors={["#10301C", "#0B1D12", "#121212"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              className="px-5 -mt-12 pt-12 pb-7 rounded-b-[28px]"
            >
              <View className="pt-2 mt-6 p-5">
                <View className="flex-row items-center justify-between py-2 px-4">
                  <View className="w-6">
                    <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
                      <ChevronDown color="white" size={26} />
                    </TouchableOpacity>
                  </View>

                  <Text className="text-[11px] font-bold uppercase tracking-[2px] text-white text-center flex-1">
                    Now playing
                  </Text>

                  <View className="w-6" />
                </View>

                {/* Fixed Artwork Container to prevent small image layout flickering */}
                <View className="mt-7 items-center w-full">
                  <View className="aspect-square w-full max-w-[390px] rounded-md bg-[#282828] overflow-hidden">
                    {musicCover ? (
                      <Image
                        source={{ uri: String(musicCover) }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                      />
                    ) : null}
                  </View>
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
                  <View className="flex-row items-center gap-4">
                    <DownloadButton
                      musicId={musicId}
                      title={musicTitle}
                      artist={artistName}
                      coverPhoto={musicCover ?? ""}
                      duration={trackDuration}
                      size={24}
                    />
                    <LikeButton musicId={musicId} isOffline={isOffline} />
                  </View>
                </View>

                <View className="mt-5">
                  <Slider
                    minimumValue={0}
                    maximumValue={Math.max(trackDuration, 1)}
                    value={Math.min(trackPosition, trackDuration || 0)}
                    minimumTrackTintColor="#ffffff"
                    maximumTrackTintColor="#5e5e5e"
                    thumbTintColor="#ffffff"
                    onSlidingComplete={(value) => TrackPlayer.seekTo(value)}
                  />
                  <View className="-mt-1 ml-3 mr-3 flex-row items-center justify-between">
                    <Text className="text-[11px] text-[#a7a7a7]">
                      {formatTime(trackPosition)}
                    </Text>
                    <Text className="text-[11px] text-[#a7a7a7]">
                      -{formatTime(Math.max(trackDuration - trackPosition, 0))}
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
                      style={{ width: "100%", height: 260 }}
                      resizeMode="cover"
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
              visible={showUpgradeModal}
              title="You've Reached Your Limit"
              onClose={closeLimitModalAndGoHome}
            >
              <View className="items-center mb-5">
                <View className="w-16 h-16 rounded-full bg-[#1DB954]/20 items-center justify-center border border-[#1DB954]/40 shadow-lg shadow-[#1DB954]/20">
                  <Zap size={32} color="#1DB954" fill="#1DB954" />
                </View>
              </View>

              <Text className="text-neutral-300 text-sm leading-6 text-center mb-5 px-1 font-medium">
                You’ve listened to your <Text className="text-white font-bold">{playCount} free songs</Text> for today. Upgrade to Premium to keep the music playing without interruption.
              </Text>

              <View className="bg-[#242424] rounded-2xl p-3.5 mb-6 gap-2 border border-white/5">
                <View className="flex-row items-center gap-2.5">
                  <Check size={15} color="#1DB954" strokeWidth={3} />
                  <Text className="text-neutral-200 text-xs font-semibold">Unlimited song plays</Text>
                </View>
                <View className="flex-row items-center gap-2.5">
                  <Check size={15} color="#1DB954" strokeWidth={3} />
                  <Text className="text-neutral-200 text-xs font-semibold">Download songs for offline listening</Text>
                </View>
                <View className="flex-row items-center gap-2.5">
                  <Check size={15} color="#1DB954" strokeWidth={3} />
                  <Text className="text-neutral-200 text-xs font-semibold">Play downloaded songs anywhere without an internet connection</Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  closeUpgradeModal();
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
      </Animated.View>
    </View>
  );
}

function TrackViewReady({ routeMusicId }: { routeMusicId?: string }) {
  const activeTrack = useActiveTrack();
  const musicId = routeMusicId || String(activeTrack?.id ?? "");
  return <TrackViewContent key={musicId} musicId={musicId} />;
}

export default function TrackView() {
  const { musicId: routeMusicId } = useLocalSearchParams<{ musicId?: string }>();
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    setupPlayer()
      .catch((error) => {
        console.error("Failed to initialize the playback player:", error);
      })
      .finally(() => {
        if (mounted) setPlayerReady(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (!playerReady) {
    return <View className="flex-1 bg-[#121212]" />;
  }

  return <TrackViewReady routeMusicId={routeMusicId} />;
}