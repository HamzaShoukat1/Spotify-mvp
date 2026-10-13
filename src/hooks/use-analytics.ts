import {
    AddTrackDataToAnalytics,
    getAnalyticsForDashboard,
} from "@/services/analytics.service";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
export type AnalyticsRange = "7d" | "30d" | "120d" | "360d";

export interface AnalyticsDatafordashboard {
    artist: {
        id: string;
        name: string;
    };

    range: AnalyticsRange;
    days: number;

    totalStreams: number;

    uniqueListeners: number;

    topSongs: Array<{
        _id: string;
        count: number;
        title: string;
        coverUrl?: string;
    }>;

    timelineData: Array<{
        date: string;
        value: number;
    }>;
}

export function useAddTrackDataToAnalytics() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: AddTrackDataToAnalytics,

        onSuccess: async (data) => {
            // console.log("Analytics response:", data);

            await queryClient.invalidateQueries({
                queryKey: ["dashboardAnalytics"],
            });
        },

        onError: (error) => {
            console.error(
                "Failed to track analytics data:",
                error
            );
        },
    });
}

export function useDashboardAnalytics(range: AnalyticsRange) {
    return useQuery<AnalyticsDatafordashboard, Error>({
        queryKey: ["dashboardAnalytics", range],
        queryFn: () => getAnalyticsForDashboard(range),
        staleTime: 30_000, // Data stays fresh for 30 seconds
        refetchInterval: 60_000, //Automatically poll and refetch every 60 seconds
    });
}