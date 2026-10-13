const BackendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "http://192.168.100.247:9000"

// const BackendUrl = "http://192.168.100.159:9000"





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


export interface CloudinaryImage {
    url: string;
    publicId: string;
}
export type ArtistMusic = {
    _id: string;
    musicTitle: string;
    coverPhoto?: Pick<CloudinaryImage, "url">;
    music: Pick<CloudinaryImage, "url">;
}[];

export interface CreatedArtist extends Omit<ArtistData, "profileImage" | "coverImage"> {
    profileImage: CloudinaryImage;
    coverImage: CloudinaryImage;
}

export type ArtistProfile = CreatedArtist;
export type publicArtist = {
    _id: string;
    user: string;
    name: string;
    artistType: string;
    genres: string;
    bio: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    artistmusic: ArtistMusic;
    profileImage: CloudinaryImage;
    coverImage: CloudinaryImage;
}

export type UpdateArtistProfileData = Omit<ArtistData, "profileImage" | "coverImage"> & {
    profileImage?: string;
    coverImage?: string;
};


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


export async function getArtistProfile(): Promise<ArtistProfile> {
    return ApiClient(`${BackendUrl}/artist/profile`, {
        method: "GET",
    });
}

export async function updateArtistProfile(
    profileData: UpdateArtistProfileData,
): Promise<ArtistProfile> {
    const formData = new FormData();
    formData.append("name", profileData.name);
    formData.append("artistType", profileData.artistType);
    formData.append("genres", profileData.genres);
    formData.append("bio", profileData.bio);

    if (profileData.profileImage && !profileData.profileImage.startsWith("http")) {
        formData.append("profileImage", new File(profileData.profileImage));
    }

    if (profileData.coverImage && !profileData.coverImage.startsWith("http")) {
        formData.append("coverImage", new File(profileData.coverImage));
    }

    return ApiClient(`${BackendUrl}/artist/profile`, {
        method: "PATCH",
        body: formData,
    });
}

export async function getArtistdetailforpubluc(artistId: string): Promise<publicArtist> {
    return ApiClient(`${BackendUrl}/artist/profileforuser/${artistId}`, {
        method: "GET",
    });
}

export async function getPublicArtists(): Promise<publicArtist[]> {
    return ApiClient(`${BackendUrl}/artist/public`, {
        method: "GET",
    });
}
