import { ChangeUsername, createUser, currectUser, loginUser, LogoutUser } from "@/services/auth.service";
import { clearTokens, saveTokens } from "@/storage/secureStorage";
import { useAuth } from "@/context/Auth.Context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
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
                throw new Error(
                    "Login succeeded but authentication tokens were not received."
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




export function useLogoutMutation() {
    const { refreshAuth } = useAuth();

    return useMutation({
        mutationFn: LogoutUser,
        onSuccess: async () => {
            const success = await clearTokens();
            await TrackPlayer.reset()
            if (success) {
                console.log('Local tokens cleared after logout.');
                await refreshAuth();
            }


        },
        onError: (err: any) => {
            console.log(err instanceof Error ? err.message : 'logout failed.');
        },
    });
}

export function useCurrentUser() {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: currectUser,
        // staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
        // retry: 1,                 // Retry failed requests once
    });
};



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

