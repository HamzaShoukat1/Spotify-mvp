import { ApiClient } from "@/api/ApiClient";

const BackendUrl =
  process.env.EXPO_PUBLIC_BACKEND_URL || "http://192.168.100.247:9000";

export interface SubscriptionDetails {
  id: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  status:
  | "incomplete"
  | "incomplete_expired"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "paused";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string | null;
}

export interface SubscriptionStatusResponse {
  planTier: "free" | "premium";
  isPremium: boolean;
  subscription: SubscriptionDetails | null;

}

export interface SubscriptionSetupResponse {
  subscriptionId: string;
  clientSecret: string;
  ephemeralKeySecret: string;
  customerId: string;
}

export interface ConfirmSubscriptionResponse {
  isPremium: boolean;
  status: SubscriptionDetails["status"];
  currentPeriodEnd: string | null;
}

export interface CancelSubscriptionResponse {
  subscriptionId: string;
  status: string;
  cancelImmediately?: boolean;
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: string;
}

export async function getMySubscriptionStatus(): Promise<SubscriptionStatusResponse> {
  return ApiClient(`${BackendUrl}/subscription/me`, {
    method: "GET",
  });
}

export async function createSubscriptionSetup(
  priceId?: string,
): Promise<SubscriptionSetupResponse> {
  return ApiClient(`${BackendUrl}/subscription/create-subscription`, {
    method: "POST",
    body: JSON.stringify({ priceId }),
  });
}

export async function confirmSubscriptionPayment(
  subscriptionId: string,
): Promise<ConfirmSubscriptionResponse> {
  return ApiClient(`${BackendUrl}/subscription/confirm`, {
    method: "POST",
    body: JSON.stringify({ subscriptionId }),
  });
}

export async function cancelSubscription(payload?: {
  cancelImmediately?: boolean;
}): Promise<CancelSubscriptionResponse> {
  return ApiClient(`${BackendUrl}/subscription/cancel`, {
    method: "POST",
    body: JSON.stringify(payload || {}),
  });
}
