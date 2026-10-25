import { ChangeUsername, confirmEmailChange, createUser, currectUser, loginUser, LogoutUser, requestCurrentEmailOtp, requestNewEmailOtp, verifyCurrentEmailOtp } from "@/services/auth.service";
import { clearTokens, saveTokens } from "@/storage/secureStorage";
import { useAuth } from "@/context/Auth.Context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TrackPlayer from "react-native-track-player";
// import { router, useNavigation } from "expo-router";




export function useSignupMutation() {
    const { refreshAuth } = useAuth();

    return useMutation({
        mutationFn: createUser,
        onSuccess: async (data) => {
            if (!data?.accessToken || !data?.refreshToken) {
                throw new Error(
                    "Signup succeeded but authentication tokens were not received."
                );
            }

            await saveTokens(
                data.accessToken,
                data.refreshToken
            );
            await refreshAuth();
        },
    });
}
export function useLoginMutation() {
    const { refreshAuth } = useAuth();

    return useMutation({
        mutationFn: loginUser,
        onSuccess: async (data) => {
            if (!data?.accessToken || !data?.refreshToken) {
                throw new Error("Login succeeded but authentication tokens were not received.");
            }

            await saveTokens(data.accessToken, data.refreshToken);

            await refreshAuth();
        },
    });
}

export function useLogoutMutation() {
    const { refreshAuth } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: LogoutUser,
        onSuccess: async () => {
            queryClient.clear();
            await TrackPlayer.reset().catch(() => null);
            const success = await clearTokens();
            if (success) {
                await refreshAuth();
            }
        },
        onError: (err: any) => {
            console.error('Server logout request failed:', err?.message || err);
            queryClient.clear();
            clearTokens().then(() => refreshAuth());
        },
    });
}

export function useCurrentUser() {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: currectUser,
    });
}


export function useChangeUsername() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (name: string) => ChangeUsername(name),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });

        },
        onError: (error) => {
            console.error('Failed to change username:', error);
        }
    });
}

export function useEmailChange() {
    const queryClient = useQueryClient();

    const requestCurrentOtp = useMutation({
        mutationFn: requestCurrentEmailOtp,
    });
    const verifyCurrentOtp = useMutation({
        mutationFn: verifyCurrentEmailOtp,
    });
    const requestNewOtp = useMutation({
        mutationFn: ({ newEmail, verificationToken }: { newEmail: string; verificationToken: string }) =>
            requestNewEmailOtp(newEmail, verificationToken),
    });
    const confirmChange = useMutation({
        mutationFn: ({ newEmail, otp, verificationToken }: { newEmail: string; otp: string; verificationToken: string }) =>
            confirmEmailChange(newEmail, otp, verificationToken),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
    });

    return { requestCurrentOtp, verifyCurrentOtp, requestNewOtp, confirmChange };
}

