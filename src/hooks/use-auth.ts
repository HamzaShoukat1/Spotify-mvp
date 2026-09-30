import { createUser, loginUser, LogoutUser } from "@/services/auth.service";
import { clearTokens, saveTokens } from "@/storage/secureStorage";
import { useMutation } from "@tanstack/react-query";




export function useSignupMutation() {
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
        },
    });
}

export function useLoginMutation() {
    return useMutation({
        mutationFn: loginUser,
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
        },
    });
}



export function useLogoutMutation() {
    return useMutation({
        mutationFn: LogoutUser,
        onSuccess: async () => {
            const success = await clearTokens();
            if (success) {
                console.log('Local tokens cleared after logout.');
            }
        },
    });
}
