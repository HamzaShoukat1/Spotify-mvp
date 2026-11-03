import { ApiClient } from "@/api/ApiClient";
import { AnalyticsRange } from "@/hooks/use-analytics";

const BackendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "http://192.168.100.247:9000"

// const BackendUrl = "http://192.168.100.159:9000"






type analyticsData = {
    musicId: string
}

export async function AddTrackDataToAnalytics(
    analyticData: analyticsData
) {
    return ApiClient(`${BackendUrl}/stream/music`, {
        method: "POST",
        body: JSON.stringify(analyticData),
    });
}

export interface ListeningAccess {
    allowed: boolean;
    isPremium: boolean;
    sessionId: string | null;
    remaining: number | null;
    dailyLimit: number | null;
    playCount?: number | null;
    isLimitReached?: boolean;
}

export interface ListeningRegistration {
    counted: boolean;
    isPremium: boolean;
    playCount: number | null;
    isLimitReached: boolean;
    remaining: number | null;
    dailyLimit: number | null;
}

export async function registerListening(musicId: string) {
    return ApiClient(`${BackendUrl}/stream/register`, {
        method: "POST",
        body: JSON.stringify({ musicId }),
    }) as Promise<ListeningRegistration>;
}

export async function startListening(musicId: string) {
    return ApiClient(`${BackendUrl}/stream/start`, {
        method: "POST",
        body: JSON.stringify({ musicId }),
    }) as Promise<ListeningAccess>;
}

export async function getAnalyticsForDashboard(range: AnalyticsRange) {
    return ApiClient(
        `${BackendUrl}/stream/analytics?range=${range}`,
        {
            method: "GET",
        }
    );
}
