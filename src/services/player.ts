import TrackPlayer, {
  Capability,
  AppKilledPlaybackBehavior,
} from "react-native-track-player";

let setupPromise: Promise<void> | null = null;

export function setupPlayer(): Promise<void> {
  // Reuse the same initialization promise across concurrent calls.
  if (setupPromise) {
    return setupPromise;
  }

  setupPromise = initializePlayer();

  return setupPromise;
}

async function initializePlayer(): Promise<void> {
  try {
    try {
      await TrackPlayer.setupPlayer();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);

      if (!message.toLowerCase().includes("already been initialized")) {
        throw error;
      }
    }

    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SeekTo,
        Capability.Stop,
      ],

      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.Stop,
      ],

      progressUpdateEventInterval: 1,

      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
    });
  } catch (error) {
    setupPromise = null;
    throw error;
  }
}

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = String(totalSeconds % 60).padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}