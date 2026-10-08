export async function redirectSystemPath({ path }: { path: string }) {
    if (path.includes("notification.click")) {
        return "/Track-View";
    }

    return path;
}
