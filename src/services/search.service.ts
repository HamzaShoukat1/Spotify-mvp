import { ApiClient } from "@/api/ApiClient";

const BackendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "https://vercel.app"
// const BackendUrl = "http://192.168.100.159:9000"







export async function searchProducts(query: string) {
    return ApiClient(
        `${BackendUrl}/search/spotify?q=${encodeURIComponent(query)}`
    );
}