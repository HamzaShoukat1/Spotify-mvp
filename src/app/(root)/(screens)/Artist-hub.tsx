import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Image,
} from 'react-native';

import {
    ChevronLeft,
    Music2,
    Disc3,
    BarChart3,
    UserRound,
    ChevronRight,
    ImagePlus,
} from 'lucide-react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import {
    useArtistProfile,
    useUpdateArtistProfile,
} from '@/hooks/useArtist';

import { useProfileContext } from '@/context/ProfileContext';
import { EditProfileModal } from '@/models/EditProfileModal';

import type { UpdateArtistProfileData } from '@/services/artist.service';


export default function Artisthub() {
    const { profile, setProfile } = useProfileContext();

    const profileQuery = useArtistProfile();
    const updateProfile = useUpdateArtistProfile();

    const [isEditing, setIsEditing] = useState(false);

    const [error, setError] = useState('');

    useEffect(() => {
        if (profileQuery.data) {
            setProfile(profileQuery.data);
        }
    }, [profileQuery.data, setProfile]);


    const artist = {
        name: profile?.name ?? '',
        artistType: profile?.artistType ?? '',
        genres: profile?.genres ?? '',
        bio: profile?.bio ?? '',
        profileImage: {
            url: profile?.profileImage?.url ?? '',
            publicId: profile?.profileImage?.publicId ?? '',
        },
        coverImage: {
            url: profile?.coverImage?.url ?? '',
            publicId: profile?.coverImage?.publicId ?? '',
        },
    };



    const openEditor = () => {
        setIsEditing(true);
        setError('');
    };

    const initialData: UpdateArtistProfileData = {
        name: artist.name,
        artistType: artist.artistType,
        genres: artist.genres,
        bio: artist.bio,
        profileImage: artist.profileImage.url,
        coverImage: artist.coverImage.url,
    };

    const saveProfile = (form: UpdateArtistProfileData) => {

        if (!form.name.trim() || !form.artistType.trim() || !form.genres.trim()) {
            setError('fields are required.');
            return;
        }

        setError('');


        updateProfile.mutate(
            {
                ...form,
                name: form.name.trim(),
                artistType: form.artistType.trim(),
                genres: form.genres.trim(),
                bio: form.bio.trim(),
                coverImage: form.coverImage


            },
            {
                onSuccess: (updatedProfile) => {
                    setProfile(updatedProfile);
                    setIsEditing(false);
                },
                onError: (updatatingError) => {
                    if (updatatingError instanceof Error && updatatingError.message) {
                        setError(updatatingError.message);
                    }
                },
            }
        );
    };

    const menuItems = [
        {
            title: 'Overview',
            subtitle: 'Your artist dashboard',
            icon: BarChart3,
            route: null,
        },
        {
            title: 'Music',
            subtitle: 'Manage your songs',
            icon: Music2,
            route: null,
        },
        {
            title: 'Albums',
            subtitle: 'Create and manage albums',
            icon: Disc3,
            route: null
        },
        {
            title: 'Analytics',
            subtitle: 'See how your music performs',
            icon: BarChart3,
            route: null,
        },
        {
            title: 'Edit Profile',
            subtitle: 'Edit your artist information',
            icon: UserRound,
            route: null,
        },
    ];


    const genres = artist.genres
        .split(',')
        .map((genre) => genre.trim())
        .filter(Boolean);

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <KeyboardAvoidingView
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : 'height'
                }
                className="flex-1"
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 40,
                    }}
                >
                    {/* Header */}

                    <View className="flex-row items-center justify-between px-5 pt-3 pb-6">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="h-10 w-10 items-center justify-center rounded-full bg-[#1F1F1F]"
                        >
                            <ChevronLeft
                                size={22}
                                color="#FFFFFF"
                                strokeWidth={2}
                            />
                        </TouchableOpacity>

                        <Text className="text-white text-lg font-bold">
                            Artist Hub
                        </Text>

                        <View className="h-10 w-10" />
                    </View>

                    {/* Artist Hero */}

                    <View className="px-5">
                        <View className="overflow-hidden rounded-3xl bg-[#1B1B1B]">
                            {/* Cover Photo */}

                            {artist.coverImage.url ? (
                                <ImageBackground
                                    source={{
                                        uri: artist.coverImage.url,
                                    }}
                                    resizeMode="cover"
                                    className="h-52 w-full"
                                    imageStyle={{
                                        borderTopLeftRadius: 24,
                                        borderTopRightRadius: 24,
                                    }}
                                >
                                    <View className="flex-1 bg-black/30" />
                                </ImageBackground>
                            ) : (
                                <View className="h-52 w-full items-center justify-center bg-[#292929]">
                                    <ImagePlus
                                        size={38}
                                        color="#666666"
                                    />
                                </View>
                            )}

                            {/* Artist Information */}

                            <View className="px-5 pb-5">
                                {/* Avatar */}

                                <View className="-mt-10">
                                    <View className="h-20 w-20 overflow-hidden rounded-full border-4 border-[#1B1B1B] bg-[#292929] items-center justify-center">
                                        {artist.profileImage.url ? (
                                            <Image
                                                source={{
                                                    uri: artist
                                                        .profileImage
                                                        .url,
                                                }}
                                                className="h-full w-full"
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <UserRound
                                                size={38}
                                                color="#FFFFFF"
                                                strokeWidth={1.5}
                                            />
                                        )}
                                    </View>
                                </View>

                                {/* Artist Name */}

                                <View className="mt-3">
                                    <Text className="text-[#B3B3B3] text-xs font-semibold uppercase tracking-widest">
                                        {artist.artistType}
                                    </Text>

                                    <Text
                                        className="text-white text-2xl font-bold mt-1"
                                        numberOfLines={1}
                                    >
                                        {artist.name}
                                    </Text>

                                    {/* { <View className="flex-row items-center mt-2">
                                        <Users
                                            size={14}
                                            color="#B3B3B3"
                                        />

                                        <Text className="text-[#B3B3B3] text-sm ml-1.5">
                                            0 monthly listeners
                                        </Text>
                                    </View> } */}


                                    {genres.length > 0 && (
                                        <View className="flex-row flex-wrap mt-4 gap-2">
                                            {genres.map(
                                                (genre) => (
                                                    <View
                                                        key={genre}
                                                        className="rounded-full bg-[#292929] px-3 py-1.5"
                                                    >
                                                        <Text className="text-[#D4D4D4] text-xs font-semibold">
                                                            {genre}
                                                        </Text>
                                                    </View>
                                                )
                                            )}
                                        </View>
                                    )}
                                </View>

                                {/* Stats */}

                                <View className="flex-row mt-6 border-t border-[#2A2A2A] pt-5">
                                    <View className="flex-1 items-center">
                                        <Text className="text-white text-xl font-bold">
                                            0
                                        </Text>

                                        <Text className="text-[#A7A7A7] text-xs mt-1">
                                            Songs
                                        </Text>
                                    </View>

                                    <View className="w-[1px] bg-[#2A2A2A]" />

                                    <View className="flex-1 items-center">
                                        <Text className="text-white text-xl font-bold">
                                            0
                                        </Text>

                                        <Text className="text-[#A7A7A7] text-xs mt-1">
                                            Albums
                                        </Text>
                                    </View>

                                    <View className="w-[1px] bg-[#2A2A2A]" />

                                    <View className="flex-1 items-center">
                                        <Text className="text-white text-xl font-bold">
                                            0
                                        </Text>

                                        <Text className="text-[#A7A7A7] text-xs mt-1">
                                            Followers
                                        </Text>
                                    </View>
                                </View>

                                {/* Bio */}

                                {artist.bio ? (
                                    <View className="mt-6">
                                        <Text className="text-white text-base font-bold mb-2">
                                            About
                                        </Text>

                                        <Text
                                            className="text-[#A7A7A7] text-sm leading-5"
                                            numberOfLines={4}
                                        >
                                            {artist.bio}
                                        </Text>
                                    </View>
                                ) : null}
                            </View>
                        </View>
                    </View>

                    {/* Section Title */}

                    <View className="px-5 mt-8 mb-4">
                        <Text className="text-white text-xl font-bold">
                            Manage your music
                        </Text>

                        <Text className="text-[#A7A7A7] text-sm mt-1">
                            Everything you need as an artist
                        </Text>
                    </View>

                    {/* Navigation Cards */}

                    <View className="px-5">
                        {menuItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <TouchableOpacity
                                    key={item.title}
                                    activeOpacity={0.75}
                                    onPress={() => {
                                        if (
                                            item.title ===
                                            'Edit Profile'
                                        ) {
                                            openEditor();
                                        } else if (
                                            item.route
                                        ) {
                                            router.push(
                                                item.route as any
                                            );
                                        }
                                    }}
                                    className="flex-row items-center mb-3 rounded-2xl bg-[#1B1B1B] px-4 py-4 gap-4"
                                >
                                    <View className="h-12 w-12 items-center justify-center rounded-xl bg-[#292929]">
                                        <Icon
                                            size={23}
                                            color="#FFFFFF"
                                            strokeWidth={1.7}
                                        />
                                    </View>

                                    <View className="flex-1 ">
                                        <Text className="text-white text-base font-semibold">
                                            {item.title}
                                        </Text>

                                        <Text className="text-[#8F8F8F] text-sm mt-1">
                                            {item.subtitle}
                                        </Text>
                                    </View>

                                    <ChevronRight
                                        size={20}
                                        color="#6F6F6F"
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Close */}

                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="items-center mt-10"
                    >
                        <Text className="text-[#A7A7A7] text-sm font-semibold">
                            Close Artist Hub
                        </Text>
                    </TouchableOpacity>

                    <EditProfileModal
                        visible={isEditing}
                        initialData={initialData}
                        error={error}
                        isPending={updateProfile.isPending}
                        onClose={() => setIsEditing(false)}
                        onSave={saveProfile}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}