const BackendUrl = "http://192.168.100.247:9000"
// const BackendUrl = "http://192.168.100.159:9000";




import { ApiClient } from "../api/ApiClient";
import { File } from "expo-file-system";

export interface ArtistData {
    name: string;
    artistType: string;
    genres: string;
    bio: string;
    profileImage: string;
    coverImage: string;
}
export interface MusicData {
    musicTitle: string,
    primaryArtistName: string,
    Genre: string,
    Language: string,
    music: string


}

export interface CloudinaryImage {
    url: string;
    publicId: string;
}

export interface CreatedArtist extends Omit<ArtistData, "profileImage" | "coverImage"> {
    profileImage: CloudinaryImage;
    coverImage: CloudinaryImage;
}
export interface CreateMusic extends Omit<MusicData, "music"> {
    music: CloudinaryImage
}

export async function becameAnArtist(
    artistData: ArtistData,
): Promise<CreatedArtist> {
    const formData = new FormData();
    formData.append("name", artistData.name);
    formData.append("artistType", artistData.artistType);
    formData.append("genres", artistData.genres);
    formData.append("bio", artistData.bio);

    if (artistData.profileImage) {
        formData.append("profileImage", new File(artistData.profileImage));
    }

    if (artistData.coverImage) {
        formData.append("coverImage", new File(artistData.coverImage));
    }

    return ApiClient(
        `${BackendUrl}/artist/create`,
        {
            method: "POST",
            body: formData,
        }
    );
}


export async function createMusic(createMusicData: MusicData): Promise<CreateMusic> {     
    const formData = new FormData();     
    formData.append("musicTitle", createMusicData.musicTitle);     
    formData.append("primaryArtistName", createMusicData.primaryArtistName);     
    formData.append("Genre", createMusicData.Genre);     
    formData.append("Language", createMusicData.Language);      
    
    if (createMusicData.music) {         
        formData.append("music",new File(createMusicData.music));     
    }      
    
    return ApiClient(`${BackendUrl}/artist/music`, {         
        method: "POST",         
        body: formData     });
}
