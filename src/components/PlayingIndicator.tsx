import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from "react-native-reanimated";

function BeatBar({ height, delay }: { height: number; delay: number }) {
  const scale = useSharedValue(0.55);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(1, { duration: 360 }), withTiming(0.45, { duration: 360 })),
        -1,
        true,
      ),
    );

    return () => cancelAnimation(scale);
  }, [delay, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        { height, width: 3, borderRadius: 2, backgroundColor: "#1ed760" },
      ]}
    />
  );
}

export function PlayingIndicator() {
  return (
    <View className="h-5 w-5 flex-row items-center justify-center gap-[2px]">
      <BeatBar height={9} delay={0} />
      <BeatBar height={16} delay={110} />
      <BeatBar height={12} delay={220} />
      <BeatBar height={18} delay={330} />
    </View>
  );
}
