import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMySubscriptionStatus,
  createSubscriptionSetup,
  cancelSubscription,
  type SubscriptionStatusResponse,
  type CancelSubscriptionResponse,
} from "@/services/subscription.service";
import { useStripePayment } from "./useStripePayment";
import { useAuth } from "@/context/Auth.Context";

export const SUBSCRIPTION_QUERY_KEY = ["subscription", "status"] as const;


export function useSubscriptionStatus() {
  const { userToken, isPremium: isAuthPremium, planTier: authPlanTier } = useAuth();

  const query = useQuery<SubscriptionStatusResponse>({
    queryKey: [...SUBSCRIPTION_QUERY_KEY, userToken],
    queryFn: getMySubscriptionStatus,
    enabled: Boolean(userToken),
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  const isPremium = query.data?.planTier === "premium" || query.data?.isPremium === true || isAuthPremium;

  const planTier = query.data?.planTier || authPlanTier || "free";
  const status = query.data?.subscription?.status || (isPremium ? "active" : "free");
  const cancelAtPeriodEnd = query.data?.subscription?.cancelAtPeriodEnd || false;
  const currentPeriodEnd = query.data?.subscription?.currentPeriodEnd || null;
  const subscriptionId = query.data?.subscription?.id

  return {
    ...query,
    subscription: query.data?.subscription || null,
    planTier,
    isPremium,
    status,
    cancelAtPeriodEnd,
    currentPeriodEnd,
    subscriptionId
  };
}


export function useSubscribeMutation() {
  const queryClient = useQueryClient();
  const { userToken, refreshAuth } = useAuth();
  const { initializePaymentSheet, presentPaymentSheet } = useStripePayment();

  const mutation = useMutation<
    { success: boolean; cancelled: boolean; error?: string, },
    Error,
    { priceId?: string }
  >({
    mutationFn: async (params) => {
      if (!userToken) {
        throw new Error("You must be logged in to subscribe to Premium");
      }

      const priceId = params?.priceId;

      const setup = await createSubscriptionSetup(priceId);

      const initResult = await initializePaymentSheet({
        paymentIntentClientSecret: setup.clientSecret,
        customerEphemeralKeySecret: setup.ephemeralKeySecret,
        customerId: setup.customerId,
        merchantDisplayName: "Spotify Premium",
      });

      if (!initResult.success) {
        throw new Error(initResult.error || "Failed to initialize payment sheet");
      }

      const presentResult = await presentPaymentSheet();

      if (presentResult.cancelled) {
        return { success: false, cancelled: true };
      }

      if (!presentResult.success) {
        throw new Error(presentResult.error || "Payment was declined or failed");
      }

      return { success: true, cancelled: false };
    },
    onSuccess: async (result) => {
      if (result.success) {
        const queryKey = [...SUBSCRIPTION_QUERY_KEY, userToken || "anonymous"];

        queryClient.setQueryData<SubscriptionStatusResponse>(queryKey, (old) => {
          return {
            planTier: "premium",
            isPremium: true,
            subscription: old?.subscription
              ? { ...old.subscription, status: "active" }
              : null,
          };
        });

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_QUERY_KEY }),
          queryClient.invalidateQueries({ queryKey: ["currentUser"] }),
        ]);

     
        await refreshAuth().catch(() => null);
      }
    },
  });

  return mutation;
}


export function useCancelSubscriptionMutation() {
  const queryClient = useQueryClient();
  const { refreshAuth } = useAuth();

  return useMutation<
    CancelSubscriptionResponse,
    Error,
    { cancelImmediately?: boolean }
  >({
    mutationFn: async (payload) => {
      return cancelSubscription(payload || {});
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: ["currentUser"] }),
      ]);
      await refreshAuth().catch(() => null);
    },
  });
}
