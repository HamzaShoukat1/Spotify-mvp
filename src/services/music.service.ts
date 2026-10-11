import { ApiClient } from "@/api/ApiClient";
import { CloudinaryImage } from "./artist.service";
import { File } from "expo-file-system";

// const BackendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "http://192.168.100.247:9000"
const BackendUrl = "http://192.168.100.159:9000"



export interface MusicData {
    musicTitle: string,
    primaryArtistName: string,
    Genre: string,
    Language: string,
    music: string
    coverPhoto: string


}

export interface TrackArtist {
    name: string;
    artistType: string;
    genres: string;
    bio: string;
    profileImage?: CloudinaryImage;
    coverImage?: CloudinaryImage;
}

export interface MusicTrack {
    _id: string;
    musicTitle: string;
    primaryArtistName: string;
    Genre: string;
    Language: string;
    music: CloudinaryImage;
    coverPhoto: CloudinaryImage;
    artist: TrackArtist | null;
}
export interface CreateMusic extends Omit<MusicData, "music" | "coverPhoto"> {
    music: CloudinaryImage
    coverPhoto: CloudinaryImage
}

export async function createMusic(createMusicData: MusicData): Promise<CreateMusic> {
    const formData = new FormData();
    formData.append("musicTitle", createMusicData.musicTitle);
    formData.append("primaryArtistName", createMusicData.primaryArtistName);
    formData.append("Genre", createMusicData.Genre);
    formData.append("Language", createMusicData.Language);
    if (createMusicData.music) {
        formData.append("music", new File(createMusicData.music));
    }
    if (createMusicData.coverPhoto) {
        formData.append("coverPhoto", new File(createMusicData.coverPhoto))
    }

    return ApiClient(`${BackendUrl}/music/add`, {
        method: "POST",
        body: formData
    });
}


export async function getMusicDetail() {
    return ApiClient(`${BackendUrl}/music/musicdetailforhome`, {
        method: "GET",
    });
}




export async function getMusicTrack(musicId: string): Promise<MusicTrack> {
    return ApiClient(`${BackendUrl}/music/track/${musicId}`, {
        method: "GET",
    });
}
