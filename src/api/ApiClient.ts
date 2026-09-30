import { getAccessToken } from "../storage/secureStorage";

export async function ApiClient(
    url: string,
    options?: RequestInit
) {
    const isFormData =
        options?.body instanceof FormData;

    const accessToken =
        await getAccessToken();

    const headers = new Headers(
        options?.headers
    );

   
    if (!isFormData && !headers.has("Content-Type")) {
        headers.set(
            "Content-Type",
            "application/json"
        );
    }

    if (accessToken) {
        headers.set(
            "Authorization",
            `Bearer ${accessToken}`
        );
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    const data = await response
        .json()
        .catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message ||
                `Request failed with status ${response.status}`
        );
    }

    return data?.data;
}