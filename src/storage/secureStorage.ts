import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";

export async function saveTokens(
    accessToken: string,
    refreshToken: string
): Promise<boolean> {
    try {
        console.log(" [SecureStore] Attempting to save tokens...");
        console.log(" Access Token to save:", accessToken ? `${accessToken.substring(0, 10)}...` : "null");
        console.log(" Refresh Token to save:", refreshToken ? `${refreshToken.substring(0, 10)}...` : "null");

        await SecureStore.setItemAsync(ACCESS_TOKEN, accessToken);
        await SecureStore.setItemAsync(REFRESH_TOKEN, refreshToken);

        console.log(" [SecureStore] Tokens successfully saved.");
        return true;
    } catch (error) {
        console.error(" [SecureStore] Failed to save tokens:", error);
        return false;
    }
}

export async function getAccessToken(): Promise<string | null> {
    try {
        console.log(" [SecureStore] Fetching access token...");
        const token = await SecureStore.getItemAsync(ACCESS_TOKEN);

        console.log("[SecureStore] Retrieved access token:", token ? `${token.substring(0, 10)}...` : "null");
        return token;
    } catch (error) {
        console.error(" [SecureStore] Failed to fetch access token:", error);
        return null;
    }
}

export async function getRefreshToken(): Promise<string | null> {
    try {
        console.log(" [SecureStore] Fetching refresh token...");
        const token = await SecureStore.getItemAsync(REFRESH_TOKEN);

        console.log(" [SecureStore] Retrieved refresh token:", token ? `${token.substring(0, 10)}...` : "null");
        return token;
    } catch (error) {
        console.error(" [SecureStore] Failed to fetch refresh token:", error);
        return null;
    }
}

export async function clearTokens(): Promise<boolean> {
    try {
        console.log(" [SecureStore] Attempting to clear tokens...");
        await SecureStore.deleteItemAsync(ACCESS_TOKEN);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN);

        console.log(" [SecureStore] Tokens successfully cleared.");
        return true;
    } catch (error) {
        console.error(" [SecureStore] Failed to clear tokens:", error);
        return false;
    }
}
