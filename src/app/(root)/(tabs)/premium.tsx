import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
} from "lucide-react-native";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { useAuth } from "@/context/Auth.Context";
import {
  useSubscriptionStatus,
  useSubscribeMutation,
  useCancelSubscriptionMutation,
} from "@/hooks/useSubscription";
import { FormSheetModal } from "@/components/FormSheetModel";

interface FeatureRowProps {
  title: string;
  freeText: string;
  premiumText: string;
  isLast?: boolean;
}

function FeatureRow({ title, freeText, premiumText, isLast }: FeatureRowProps) {
  return (
    <View
      className={`flex-row items-center py-3.5 ${!isLast ? "border-b border-neutral-800" : "pb-1"
        }`}
    >
      <View className="flex-[1.4]">
        <Text className="text-white text-[13px] font-semibold">{title}</Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="text-neutral-400 text-xs text-center">{freeText}</Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <View className="flex-row items-center gap-1">
          <Check size={13} color="#1DB954" strokeWidth={3} />
          <Text className="text-[#1DB954] text-xs font-bold text-center">
            {premiumText}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function PremiumScreen() {
  const { userToken } = useAuth();
  const {
    isPremium,
    status,
    currentPeriodEnd,
    cancelAtPeriodEnd,
    isLoading: isStatusLoading,
    subscriptionId
  } = useSubscriptionStatus();
  const subscribeMutation = useSubscribeMutation();
  const cancelMutation = useCancelSubscriptionMutation();

  const [selectedPlanId, setSelectedPlanId] = useState("price_premium_monthly");
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleSubscribe = async () => {
    

    try {
      const result = await subscribeMutation.mutateAsync({ priceId: selectedPlanId });
      if (result.success) {
        Toast.show({
          type: "success",
          text1: "Welcome to Premium!",
          text2: "Enjoy unlimited free music",
          position: "top"
        });
      } else if (!result.cancelled && result.error) {
        Alert.alert("Payment Failed", result.error);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to complete subscription";
      Alert.alert("Subscription Error", message);
    }
  };

  const handleCancelSubscription = () => {
    setShowCancelModal(true);
  };

  const confirmCancellation = async () => {
    try {
      setShowCancelModal(false);
      await cancelMutation.mutateAsync({ cancelImmediately: true });
      Toast.show({
        type: "success",
        text1: "Subscription Cancelled",
        text2: "Your subscription has been cancelled immediately.",
        position: "top"
      
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to cancel subscription";
      Alert.alert("Cancellation Error", msg);
    }
  };

  const formattedPeriodEnd = currentPeriodEnd
    ? new Date(currentPeriodEnd).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : null;

  return (
    <View className="flex-1 bg-[#121212]">
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <SafeAreaView edges={["top"]} className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Gradient Hero */}
          <LinearGradient
            colors={["#107432", "#183b22", "#121212"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            className="items-center px-5 mt-20 pb-7 rounded-b-[28px]"
          >
            <View className="flex-1 justify-center items-center p-4">
              <Text className="text-3xl mt-8 font-extrabold text-white text-center mb-2.5 tracking-tight">
                Listen without limits.
              </Text>
              <Text className="text-sm leading-5 p-4 text-neutral-400 text-center max-w-[320px]">
                Experience high-definition audio, and complete freedom from daily listening caps.
              </Text>
            </View>
          </LinearGradient>

          {isPremium ? (
            <View className="flex-row items-center justify-between bg-[#18281d] mx-4 mt-4 p-4 rounded-2xl border border-[#1DB954]/30">
              <View className="flex-row items-center gap-3 flex-1">
                <ShieldCheck size={26} color="#1DB954" />
                <View className="flex-1">
                  <Text className="text-white text-sm font-bold">
                    You are a Premium Member
                  </Text>
                  <Text className="text-[#A3D9B1] text-xs mt-0.5">
                    {cancelAtPeriodEnd
                      ? `Access active until ${formattedPeriodEnd} (cancels soon)`
                      : `Renews on ${formattedPeriodEnd || "next month"}`}
                  </Text>
                </View>
              </View>
              <View className="bg-[#1DB954] py-1 px-2.5 rounded-full ml-2">
                <Text className="text-black text-[11px] font-extrabold">
                  {status ? status.toUpperCase() : "ACTIVE"}
                </Text>
              </View>
            </View>
          ) : (
            <View className="flex-row bg-[#221e10] mx-4 mt-4 p-4 rounded-2xl border border-[#FFB800]/30 gap-3">
              <Zap size={20} color="#FFB800" />
              <View className="flex-1">
                <Text className="text-[#FFB800] text-sm font-bold mb-1">
                  Daily Limit Warning (Free Tier)
                </Text>
                <Text className="text-[#D4C7A3] text-xs leading-4">
                  Free tier users are capped at 3 tracks per day. Upgrade now to stream continuously with zero roadblocks.
                </Text>
              </View>
            </View>
          )}

          <View className="bg-[#181818] mx-4 mt-5 rounded-2xl p-4 border border-[#282828]">
            <View className="flex-row pb-3 border-b border-[#282828] mb-2">
              <Text className="flex-[1.4] text-neutral-500 text-[11px] font-bold tracking-wider">
                EXPERIENCE
              </Text>
              <Text className="flex-1 text-neutral-500 text-[11px] font-bold text-center tracking-wider">
                FREE
              </Text>
              <Text className="flex-1 text-[#1DB954] text-[11px] font-bold text-center tracking-wider">
                PREMIUM
              </Text>
            </View>

            <FeatureRow
              title="Daily Playback"
              freeText="3 tracks/day"
              premiumText="Unlimited"
            />
          </View>

          {!isPremium && (
            <View className="mx-4 mt-6">
              <Text className="text-white text-lg font-bold mb-3">Select Your Plan</Text>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setSelectedPlanId("price_premium_monthly")}
                className={`p-5 rounded-2xl border-2 ${selectedPlanId === "price_premium_monthly"
                  ? "border-[#1DB954] bg-[#1A221C]"
                  : "border-[#282828] bg-[#181818]"
                  }`}
              >
                <View className="flex-row justify-between items-center mb-3">
                  <View className="flex-row items-center gap-2">
                    <Sparkles size={18} color="#1DB954" />
                    <Text className="text-white text-lg font-bold">Individual Premium</Text>
                  </View>
                  <View className="w-5 h-5 rounded-full border-2 border-[#1DB954] items-center justify-center">
                    {selectedPlanId === "price_premium_monthly" && (
                      <View className="w-2.5 h-2.5 rounded-full bg-[#1DB954]" />
                    )}
                  </View>
                </View>

                <View className="flex-row items-baseline mb-2">
                  <Text className="text-white text-3xl font-extrabold">$2.99</Text>
                  <Text className="text-neutral-400 text-sm font-medium"> / month</Text>
                </View>

                <Text className="text-neutral-400 text-[13px] leading-5 mb-4">
                  1 Premium account. Cancel anytime directly in your app with one tap.
                </Text>

                <View className="gap-2.5 border-t border-white/10 pt-3.5">
                  <View className="flex-row items-center gap-2">
                    <Check size={14} color="#1DB954" />
                    <Text className="text-neutral-200 text-xs">
                      Unlimited Songs Listening
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}

          <View className="mx-4 mt-7 items-center">
            {isPremium ? (
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={cancelMutation.isPending || cancelAtPeriodEnd}
                onPress={handleCancelSubscription}
                className={`w-full bg-[#282828] py-4 rounded-full items-center justify-center border border-[#3E3E3E] ${cancelMutation.isPending || cancelAtPeriodEnd ? "opacity-60" : ""
                  }`}
              >
                {cancelMutation.isPending ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text className="text-red-400 text-sm font-bold">
                    {cancelAtPeriodEnd ? "Cancellation Scheduled" : "Cancel Subscription"}
                  </Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.85}
                disabled={subscribeMutation.isPending || isStatusLoading}
                onPress={handleSubscribe}
                className={`w-full bg-[#1DB954] py-4 rounded-full items-center justify-center shadow-lg shadow-[#1DB954]/30 ${subscribeMutation.isPending || isStatusLoading ? "opacity-60" : ""
                  }`}
              >
                {subscribeMutation.isPending ? (
                  <View className="flex-row items-center gap-2">
                    <ActivityIndicator color="#000000" size="small" />
                    <Text className="text-black text-sm font-bold">Opening Checkout...</Text>
                  </View>
                ) : (
                  <Text className="text-black text-sm font-extrabold tracking-wider">
                    GET PREMIUM FOR $2.99
                  </Text>
                )}
              </TouchableOpacity>
            )}

            <Text className="text-neutral-500 text-[11px] leading-4 text-center mt-3.5 px-4">
              Recurring billing. You can cancel anytime before renewal via account settings.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      <FormSheetModal
        visible={showCancelModal}
        title="Are You Sure?"
        onClose={() => setShowCancelModal(false)}
      >
        <View className="items-center mb-4">
          <View className="w-16 h-16 rounded-full bg-amber-500/15 items-center justify-center border border-amber-500/30 shadow-lg shadow-amber-500/10">
            <Zap size={30} color="#F59E0B" fill="#F59E0B" />
          </View>
        </View>

        <Text className="text-white text-base font-bold text-center mb-2">
          You'll lose your Premium perks
        </Text>

        <Text className="text-neutral-400 text-xs leading-5 text-center mb-5">
          If you cancel, your account will revert to the free plan with ads and daily listening caps at the end of your current billing period.
        </Text>

        <View className="bg-[#242424] rounded-2xl p-4 mb-6 border border-white/5 gap-2.5">
          <View className="flex-row items-center gap-2.5">
            <View className="w-2 h-2 rounded-full bg-red-400" />
            <Text className="text-neutral-300 text-xs font-medium">Daily song limit (capped at 3 songs)</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={cancelMutation.isPending}
          onPress={() => setShowCancelModal(false)}
          className="w-full bg-[#1DB954] py-4 rounded-full items-center justify-center shadow-lg shadow-[#1DB954]/30 mb-3"
        >
          <Text className="text-black text-sm font-black tracking-widest uppercase">
            KEEP PREMIUM
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          disabled={cancelMutation.isPending}
          onPress={confirmCancellation}
          className="w-full py-3 items-center justify-center"
        >
          {cancelMutation.isPending ? (
            <ActivityIndicator color="#EF4444" size="small" />
          ) : (
            <Text className="text-red-400 text-xs font-bold tracking-wider uppercase">
              Cancel Subscription
            </Text>
          )}
        </TouchableOpacity>
      </FormSheetModal>
    </View>
  );
}