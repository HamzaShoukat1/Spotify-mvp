import { useState } from 'react';
import { router } from 'expo-router';
import { ImagePlus, Pencil } from 'lucide-react-native';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { ArtistStepLayout } from '@/components/ArtistStepLayout';
import { useMusicContext } from '@/context/MusicContext';
import * as ImagePicker from 'expo-image-picker';

export default function MusicCover() {
    const { musicDraft, updateMusic } = useMusicContext();
    const [coverPhoto, setCoverPhoto] = useState(musicDraft.coverPhoto);
    const [error, setError] = useState('');

    async function chooseImage(onSelected: (uri: string) => void) {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8,
        });
        if (!result.canceled) onSelected(result.assets[0].uri);
    }

    const handleNext = () => {
        if (!coverPhoto) {
            setError('Choose a cover file before continuing.');
            return;
        }
        updateMusic({ coverPhoto });
        router.push('/(root)/(music)/music-review');
    };

    const pick = (kind: 'cover') =>
        chooseImage((uri) => {
            setError('');
            if (kind === 'cover') setCoverPhoto(uri);
        });

    return (
        <ArtistStepLayout
            step={3}
            totalSteps={4}
            title="Upload your cover art"
            description="Add a visual image for your track. JPEG, PNG, and GIF formats are supported."
            onBack={() => router.back()}
            onNext={handleNext}
        >
            <TouchableOpacity
                onPress={() => pick("cover")}
                className="h-36 overflow-hidden rounded-2xl border border-[#303030] bg-[#1B1B1B]"
            >
                {coverPhoto ? (
                    <View className="flex-1">
                        <Image
                            source={{ uri: coverPhoto }}
                            className="h-full w-full"
                            resizeMode="cover"
                        />
                        <View className="absolute bottom-3 right-3 rounded-full bg-black/75 p-2">
                            <Pencil size={16} color="#FFFFFF" />
                        </View>
                    </View>
                ) : (
                    <View className="flex-1 items-center justify-center">
                        <ImagePlus size={26} color="#1ED760" />
                        <Text className="mt-3 font-bold text-white">Add cover image</Text>
                        <Text className="mt-1 text-xs text-[#777777]">
                            Wide images look best
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            {error ? (
                <Text className="mt-4 text-sm text-[#FF6B6B]">{error}</Text>
            ) : null}
        </ArtistStepLayout>
    );
}
