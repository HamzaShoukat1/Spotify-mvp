import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import { useMemo, useState } from 'react'
import { ChevronLeft, Search, Check } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, router } from 'expo-router';
import { useAuth } from '@/context/Auth.Context';
import { usePublicArtists } from '@/hooks/useArtist';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 3;


export default function Artist() {
    const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const { finishOnboarding } = useAuth();
    const { data: artists = [], isLoading, isError } = usePublicArtists();

    const filteredArtists = useMemo(
        () => artists.filter((artist) => artist.name.toLowerCase().includes(search.toLowerCase())),
        [artists, search]
    );

    const toggleArtistSelection = (id: string) => {
        if (selectedArtists.includes(id)) {
            setSelectedArtists(selectedArtists.filter(artistId => artistId !== id));
        } else {
            setSelectedArtists([...selectedArtists, id]);
        }
    };



    return (
        <SafeAreaView className="flex-1 bg-black">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 w-full"
            >
                <View className="flex-1 bg-[#121212] pt-12 px-4">
                    {/* Header Bar */}
                    <View className="flex-row items-center mb-6">
                        <TouchableOpacity
                            onPress={() => router.replace("/(auth)/login")}
                            className="p-1"
                        >
                            <ChevronLeft color="#ffffff" size={28} />
                        </TouchableOpacity>
                        <Text className="text-white text-lg font-bold ml-4">
                            Choose 3 or more artists you like.
                        </Text>
                    </View>
                    {/* Search Bar */}
                    <View className="flex-row items-center bg-[#ffffff] rounded-md px-3 py-2.5 mb-6">
                        <Search color="#777777" size={15} className="mr-2" />
                        <TextInput
                            placeholder="Search"
                            placeholderTextColor="#757575"
                            value={search}
                            onChangeText={setSearch}
                            className="flex-1 text-black text-base p-0"
                        />
                    </View>
                    {/* Grid List of Artists */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    >
                        <View className="flex-row flex-wrap justify-between">
                            {isLoading ? (
                                <View
                                    style={{
                                        flex: 1,
                                        backgroundColor: "#000000",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <ActivityIndicator size="large" color="#1DB954" />
                                </View>
                            ) : isError ? (
                                <Text className="text-[#A7A7A7]">Unable to load artists.</Text>
                            ) : filteredArtists.map((artist) => {
                                const isSelected = selectedArtists.includes(artist._id);
                                return (
                                    <TouchableOpacity
                                        key={artist._id}
                                        style={{ width: ITEM_WIDTH }}
                                        className="items-center mb-6"
                                        activeOpacity={0.7}
                                        onPress={() => toggleArtistSelection(artist._id)}
                                    >
                                        <View className="relative">
                                            <Image
                                                source={{ uri: artist.profileImage?.url}}
                                                style={{ width: ITEM_WIDTH - 12, height: ITEM_WIDTH - 12 }}
                                                className={`rounded-full bg-[#282828] ${isSelected ? 'border-2 border-[#1DB954]' : ''}`}
                                            />
                                            {isSelected && (
                                                <View className="absolute right-0 bottom-0 bg-[#1DB954] rounded-full p-1 border-2 border-[#121212]">
                                                    <Check color="#ffffff" size={14} />
                                                </View>
                                            )}
                                        </View>

                                        <Text
                                            className={`text-xs font-semibold mt-2.5 text-center px-1 ${isSelected ? 'text-white' : 'text-[#A7A7A7]'}`}
                                        >
                                            {artist.name}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </ScrollView>

                    {selectedArtists.length >= 3 && (
                        <View className="absolute bottom-6 left-4 right-4 bg-transparent">
                            <TouchableOpacity
                                onPress={async () => {
                                    await finishOnboarding(selectedArtists);
                                    router.replace("/(root)/(tabs)/home");
                                }}

                                className="bg-white rounded-full py-3.5 items-center justify-center shadow-lg"
                            >
                                <Text className="text-black font-bold text-base">
                                    {selectedArtists.length} selected
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
