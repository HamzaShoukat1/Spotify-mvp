import { ApiClient } from "@/api/ApiClient";

const BackendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "http://192.168.100.247:9000"

// const BackendUrl = "http://192.168.100.159:9000"






// export async function AddTrackDataToAnalytics(
// ) {
//     return ApiClient(`${BackendUrl}/stream/music`, {
//         method: "POST",
//         body: JSON.stringify(analyticData),
//     });
// }

// export async function getAnalyticsForDashboard(range: AnalyticsRange) {
//     return ApiClient(
//         `${BackendUrl}/stream/analytics?range=${range}`,
//         {
//             method: "GET",
//         }
//     );
// }

// export async function togglelike(musicId: string): Promise<any> {
//     return ApiClient(`${BackendUrl}/song/toggle/${musicId}`, {
//         method: "POST",
//     });
// }

// export async function getLikesPostdetails() {
//     return ApiClient(`${BackendUrl}/song/getallikedsongs`, {
//         method: "GET",
//     });
// }


export async function likeSong(musicId: string) {
  return ApiClient(`${BackendUrl}/song/like/${musicId}`, {
    method: "PUT",
  });
}

export async function unlikeSong(musicId: string) {
  return ApiClient(`${BackendUrl}/song/unlike/${musicId}`, {
    method: "DELETE",
  });
}

export async function getLikedSongs() {
  return ApiClient(`${BackendUrl}/song/liked`, {
    method: "GET",
  });
}