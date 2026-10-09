import { ApiClient } from "@/api/ApiClient";

const BackendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "http://192.168.100.247:9000"
// const BackendUrl = "http://192.168.100.159:9000"







export async function searchProducts(query: string) {
    return ApiClient(
        `${BackendUrl}/search/spotify?q=${encodeURIComponent(query)}`
    );
}