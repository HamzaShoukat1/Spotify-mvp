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

export async function getAnalyticsForDashboard(range: AnalyticsRange) {
    return ApiClient(
        `${BackendUrl}/stream/analytics?range=${range}`,
        {
            method: "GET",
        }
    );
}