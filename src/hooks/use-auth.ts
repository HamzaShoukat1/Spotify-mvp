import { createUser, loginUser, LogoutUser } from "@/services/auth.service";
import { clearTokens, saveTokens } from "@/storage/secureStorage";
import { useAuth } from "@/context/Auth.Context";
import { useMutation } from "@tanstack/react-query";




export function useSignupMutation() {
    // const { refreshAuth } = useAuth();

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
            // await refreshAuth();
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
            if (success) {
                console.log('Local tokens cleared after logout.');
                await refreshAuth();
            }
        },
    });
}
