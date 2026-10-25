import { useState, useCallback } from "react";
import { useStripe, PaymentSheetError } from "@stripe/stripe-react-native";

export interface InitPaymentSheetParams {
  paymentIntentClientSecret: string;
  customerEphemeralKeySecret: string;
  customerId: string;
  merchantDisplayName?: string;
}

export interface PaymentSheetResult {
  success: boolean;
  cancelled: boolean;
  error?: string;
}

export function useStripePayment() {
  const { initPaymentSheet, presentPaymentSheet: stripePresentPaymentSheet } = useStripe();
  const [isInitializing, setIsInitializing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initializePaymentSheet = useCallback(
    async ({
      paymentIntentClientSecret,
      customerEphemeralKeySecret,
      customerId,
      merchantDisplayName = "Spotify Premium",
    }: InitPaymentSheetParams): Promise<{ success: boolean; error?: string }> => {
      setIsInitializing(true);
      try {
        const { error } = await initPaymentSheet({
          merchantDisplayName,
          customerId,
          customerEphemeralKeySecret,
          paymentIntentClientSecret,
          allowsDelayedPaymentMethods: false,
          returnURL: "spotifymvp://stripe-redirect",
          defaultBillingDetails: {
            name: "Spotify Listener",
          },
          style: "alwaysDark",
          appearance: {
            colors: {
              primary: "#1DB954",
              background: "#121212",
              componentBackground: "#282828",
              componentBorder: "#3E3E3E",
              componentDivider: "#282828",
              primaryText: "#FFFFFF",
              secondaryText: "#B3B3B3",
              componentText: "#FFFFFF",
              placeholderText: "#7A7A7A",
              icon: "#1DB954",
              error: "#E22134",
            },
            shapes: {
              borderRadius: 8,
              borderWidth: 1,
            },
            primaryButton: {
              shapes: {
                borderRadius: 24,
              },
              colors: {
                background: "#1DB954",
                text: "#000000",
              },
            },
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to initialize payment sheet";
        return { success: false, error: message };
      } finally {
        setIsInitializing(false);
      }
    },
    [initPaymentSheet]
  );


  const presentPaymentSheet = useCallback(async (): Promise<PaymentSheetResult> => {
    setIsSubmitting(true);
    try {
      const { error } = await stripePresentPaymentSheet();

      if (error) {
        if (error.code === PaymentSheetError.Canceled) {
          return {
            success: false,
            cancelled: true,
          };
        }

        return {
          success: false,
          cancelled: false,
          error: error.message || "Payment presentation failed",
        };
      }

      return {
        success: true,
        cancelled: false,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Payment execution encountered an error";
      return {
        success: false,
        cancelled: false,
        error: message,
      };
    } finally {
      setIsSubmitting(false);
    }
  }, [stripePresentPaymentSheet]);

  return {
    initializePaymentSheet,
    presentPaymentSheet,
    isInitializing,
    isSubmitting,
    isLoading: isInitializing || isSubmitting,
  };
}

