import { useEffect, useState } from 'react';

import * as ImagePicker from 'expo-image-picker';

import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { ImagePlus, Pencil, X } from 'lucide-react-native';

import type { UpdateArtistProfileData } from '@/services/artist.service';
import { SafeAreaView, } from 'react-native-safe-area-context';

type EditProfileModalProps = {
    visible: boolean;
    initialData: UpdateArtistProfileData | null;
    error: string;
    isPending: boolean;
    onClose: () => void;
    onSave: (profileData: UpdateArtistProfileData) => void;
};

export function EditProfileModal({
    visible,
    initialData,
    error,
    isPending,
    onClose,
    onSave,
}: EditProfileModalProps) {
    const [form, setForm] =
        useState<UpdateArtistProfileData | null>(initialData);


    useEffect(() => {
        if (visible) {
            setForm(initialData);
        }
    }, [visible]);

    const chooseImage = async (
        field: 'profileImage' | 'coverImage'
    ) => {
        const result =
            await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 0.8,
            });

        if (result.canceled || !form) {
            return;
        }

        const selectedImage = result.assets[0]?.uri;

        if (!selectedImage) {
            return;
        }

        setForm({
            ...form,
            [field]: selectedImage,
        });
    };

    const updateField = (
        field: keyof UpdateArtistProfileData,
        value: string
    ) => {
        if (!form) {
            return;
        }

        setForm({
            ...form,
            [field]: value,
        });
    };

    const handleSave = () => {
        if (!form || isPending) {
            return;
        }

        onSave(form);
    };

    return (
        <SafeAreaView className=''>

            <Modal
                visible={visible}
                transparent
                animationType="slide"
                onRequestClose={onClose}
            >
                <View className=" flex-1  bg-black/70 " >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                    >
                        <View className=" rounded-t-[30px] pt-12    bg-[#121212] px-5 pb-8 ">
                            {/* Header */}

                            <View className="mb-5  flex-row items-center justify-between">
                                <Text className="text-2xl font-bold text-white">
                                    Edit profile
                                </Text>

                                <TouchableOpacity
                                    onPress={onClose}
                                    className="rounded-full bg-[#292929] p-2"
                                >
                                    <X
                                        size={20}
                                        color="#FFFFFF"
                                    />
                                </TouchableOpacity>
                            </View>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                                contentContainerStyle={{ flexGrow: 1 }}
                            >
                                {!form ? (
                                    <ActivityIndicator color="#1ED760" />
                                ) : (
                                    <>
                                        {/* Profile Photo */}

                                        <Text className="mb-2 text-xs font-bold uppercase tracking-widest text-[#B3B3B3]">
                                            Profile photo
                                        </Text>

                                        <TouchableOpacity
                                            onPress={() =>
                                                chooseImage(
                                                    'profileImage'
                                                )
                                            }
                                            className="relative mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-[#303030] bg-[#292929]"
                                        >
                                            {form.profileImage ? (
                                                <Image
                                                    source={{
                                                        uri: form.profileImage,
                                                    }}
                                                    className="h-full w-full"
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <View className="h-full w-full items-center justify-center">
                                                    <ImagePlus
                                                        size={22}
                                                        color="#1ED760"
                                                    />
                                                </View>
                                            )}

                                            <View className="absolute bottom-3 right-3 rounded-full  items-center justify-center">
                                                <Pencil size={15} color="#000000" />

                                            </View>
                                        </TouchableOpacity>

                                        {/* Cover Photo */}

                                        <Text className="mb-2 text-xs font-bold uppercase tracking-widest text-[#B3B3B3]">
                                            Cover photo
                                        </Text>

                                        <TouchableOpacity
                                            onPress={() =>
                                                chooseImage(
                                                    'coverImage'
                                                )
                                            }
                                            className="relative mb-4 h-24 w-full overflow-hidden rounded-2xl border border-[#303030] bg-[#1B1B1B]"
                                        >
                                            {form.coverImage ? (
                                                <Image
                                                    source={{
                                                        uri: form.coverImage,
                                                    }}
                                                    className="h-full w-full"
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <View className="h-full w-full items-center justify-center">
                                                    <ImagePlus
                                                        size={28}
                                                        color="#1ED760"
                                                    />
                                                </View>
                                            )}

                                            <View className="absolute bottom-3 right-3 rounded-full  p-2 items-center justify-center">
                                                <Pencil size={15} color="#000000" />

                                            </View>

                                        </TouchableOpacity>

                                        {/* Artist Name */}

                                        <Text className="mb-2 text-xs font-bold uppercase tracking-widest text-[#B3B3B3]">
                                            Artist name
                                        </Text>

                                        <TextInput
                                            value={form.name}
                                            onChangeText={(value) =>
                                                updateField(
                                                    'name',
                                                    value
                                                )
                                            }
                                            placeholder="Artist name"
                                            placeholderTextColor="#6F6F6F"
                                            className="mb-4 h-13 rounded-xl border border-[#303030] bg-[#1B1B1B] px-4 text-base text-white"
                                            selectionColor="#1ED760"
                                        />

                                        {/* Artist Type */}

                                        <Text className="mb-2 text-xs font-bold uppercase tracking-widest text-[#B3B3B3]">
                                            Artist type
                                        </Text>

                                        <TextInput
                                            value={
                                                form.artistType
                                            }
                                            onChangeText={(value) =>
                                                updateField(
                                                    'artistType',
                                                    value
                                                )
                                            }
                                            placeholder="Artist type"
                                            placeholderTextColor="#6F6F6F"
                                            className="mb-4 h-13 rounded-xl border border-[#303030] bg-[#1B1B1B] px-4 text-base text-white"
                                            selectionColor="#1ED760"
                                        />

                                        {/* Genres */}

                                        <Text className="mb-2 text-xs font-bold uppercase tracking-widest text-[#B3B3B3]">
                                            Genres
                                        </Text>

                                        <TextInput
                                            value={form.genres}
                                            onChangeText={(value) =>
                                                updateField(
                                                    'genres',
                                                    value
                                                )
                                            }
                                            placeholder="Pop, Hip-Hop"
                                            placeholderTextColor="#6F6F6F"
                                            className="mb-4 h-13 rounded-xl border border-[#303030] bg-[#1B1B1B] px-4 text-base text-white"
                                            selectionColor="#1ED760"
                                        />

                                        {/* Bio */}

                                        <Text className="mb-2 text-xs font-bold uppercase tracking-widest text-[#B3B3B3]">
                                            Bio
                                        </Text>

                                        <TextInput
                                            value={form.bio}
                                            onChangeText={(bio) =>
                                                updateField(
                                                    'bio',
                                                    bio
                                                )
                                            }
                                            multiline
                                            textAlignVertical="top"
                                            placeholder="Write a short bio about yourself..."
                                            placeholderTextColor="#6F6F6F"
                                            className="mb-4 min-h-[110px] rounded-xl border border-[#303030] bg-[#1B1B1B] px-4 py-3 text-base text-white"
                                            selectionColor="#1ED760"
                                            maxLength={500}
                                        />

                                        <Text className="mb-4 text-right text-xs text-[#6F6F6F]">
                                            {form.bio.length}/500
                                        </Text>

                                        {/* Error */}

                                        {error ? (
                                            <Text className="mb-4 text-sm text-[#FF6B6B]">
                                                {error}
                                            </Text>
                                        ) : null}

                                        {/* Buttons */}

                                        <View className="">
                                          
                                    <TouchableOpacity
                                        onPress={handleSave}
                                        disabled={isPending}
                                        className="w-full bg-[#1ED760] py-3 rounded-full items-center justify-center "
                                    >
                                        {isPending ? (
                                            <ActivityIndicator color="#000000" />
                                        ) : (
                                            <Text className="text-black font-bold text-base">Save Profile</Text>
                                        )}
                                    </TouchableOpacity>
                                        </View>
                                    </>
                                )}
                            </ScrollView>
                        </View>

                    </KeyboardAvoidingView>


                </View>
            </Modal>
        </SafeAreaView>
    );
}