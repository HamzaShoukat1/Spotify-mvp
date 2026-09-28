import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { ChevronLeft, Search, Check } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 3;

const ARTISTS_DATA = [
    { id: '1', name: 'Billie Eilish' },
    { id: '2', name: 'Kanye West' },
    { id: '3', name: 'Ariana Grande' },
    { id: '4', name: 'Lana Del Rey' },
    { id: '5', name: 'BTS' },
    { id: '6', name: 'Drake' },
    { id: '7', name: 'Harry Styles' },
    { id: '8', name: 'One Direction' },
    { id: '9', name: 'Rihanna' },
    { id: '10', name: 'Ed Sheeran' },
    { id: '11', name: 'The Weeknd' },
    { id: '12', name: 'Dua Lipa' },
];

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1517230878791-4d28214057c2?ixid=M3w4MjcwNjd8MHwxfHNlYXJjaHwxfHxzaW5nZXJ8ZW58MHx8fHwxNzkwMzUwNzgzfDA&ixlib=rb-4.1.0&fit=max&q=80';

export default function Artist() {
    const [selectedArtists, setSelectedArtists] = useState<string[]>([]);

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
                        <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")} className="p-1">
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
                            className="flex-1 text-black text-base p-0"
                        />
                    </View>
                    {/* Grid List of Artists */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    >
                        <View className="flex-row flex-wrap justify-between">
                            {ARTISTS_DATA.map((artist) => {
                                const isSelected = selectedArtists.includes(artist.id);
                                return (
                                    <TouchableOpacity
                                        key={artist.id}
                                        style={{ width: ITEM_WIDTH }}
                                        className="items-center mb-6"
                                        activeOpacity={0.7}
                                        onPress={() => toggleArtistSelection(artist.id)}
                                    >
                                        <View className="relative">
                                            <Image
                                                source={{ uri: PLACEHOLDER_IMAGE }}
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
                                onPress={() => router.push("/(onboarding)/Choose-Podcast")}
                                className="bg-white rounded-full py-3.5 items-center justify-center shadow-lg"
                            >
                                <Text className="text-black font-bold text-base">
                                    Next ({selectedArtists.length} selected)
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
