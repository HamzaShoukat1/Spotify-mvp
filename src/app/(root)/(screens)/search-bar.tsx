import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    FlatList,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, X } from 'lucide-react-native';
import { useDebounce } from '@/hooks/use-debounce';
import { UseSearchArtistandMusic } from '@/hooks/use-search';

interface SearchItem {
    _id: string;
    name: string;
    type: 'artist' | 'music';
    imageUrl?: string;
}

export default function SearchBar() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 400);

    const { data: apiResponse, isLoading: isSearchLoading } = UseSearchArtistandMusic(debouncedSearch);

    const searchResults: SearchItem[] = useMemo(() => {
        if (!apiResponse) return [];

        const payload = apiResponse?.data || apiResponse;

        const artistsList: SearchItem[] = (payload?.artists || []).map((artist: any) => ({
            _id: artist._id,
            name: artist.name,
            type: 'artist',
            imageUrl: artist.profileImage?.url?.trim(),
        }));

        const musicList: SearchItem[] = (payload?.music || []).map((track: any) => ({
            _id: track._id,
            name: track.musicTitle,
            type: 'music',
            imageUrl: track.coverPhoto?.url?.trim()
        }));

        return [...artistsList, ...musicList];
    }, [apiResponse]);

    const isTypingOrLoading = search.trim().length > 0 && (isSearchLoading || search !== debouncedSearch);

    const handleCancel = () => {
        setSearch("");
        router.back();
    };

    const handleItemPress = (item: SearchItem) => {
        if (item.type === 'artist') {
            router.push({
                pathname: "/(root)/(screens)/Artist-detail",
                params: { artistId: item._id }
            });
        } else if (item.type === 'music') {
            router.push({
                pathname: "/(root)/(screens)/Track-View",
                params: { musicId: item._id }
            });
        }
    };

    const renderSearchItem = ({ item }: { item: SearchItem }) => (
        <TouchableOpacity
            onPress={() => handleItemPress(item)}
            className="flex-row items-center py-2 mb-2 active:opacity-70"
        >
            {item.imageUrl ? (
                <Image
                    source={{ uri: item.imageUrl }}
                    className={`w-12 h-12 bg-[#282828] ${item.type === 'artist' ? 'rounded-full' : 'rounded-[4px]'}`}
                />
            ) : (
                <View className={`w-12 h-12 bg-[#282828] items-center justify-center ${item.type === 'artist' ? 'rounded-full' : 'rounded-[4px]'}`}>
                    <Text className="text-white text-xs font-bold">
                        {item.name?.charAt(0)?.toUpperCase() || '?'}
                    </Text>
                </View>
            )}
            <View className="flex-1 ml-3 justify-center">
                <Text numberOfLines={1} className="text-white text-base font-medium">
                    {item.name}
                </Text>
                <Text className="text-[#b3b3b3] text-xs capitalize mt-0.5">
                    {item.type}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 w-full bg-black">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 w-full px-4"
            >
                {/* Search header container */}
                <View className="flex-row mt-4 items-center gap-3">
                    <View className="flex-1 flex-row items-center bg-[#282828] rounded-[10px] px-4 py-2.5">
                        <Search color="#777777" size={21} className="mr-2" />
                        <TextInput
                            value={search}
                            onChangeText={setSearch}
                            placeholder="What do you want to listen to?"
                            placeholderTextColor="#777777"
                            autoFocus={true}
                            clearButtonMode="never"
                            autoCapitalize="none"
                            autoCorrect={false}
                            className="flex-1 text-white text-base p-0 m-0"
                        />
                        {search.length > 0 && (
                            <TouchableOpacity onPress={() => setSearch("")} className="ml-2">
                                <X color="#ffffff" size={18} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity onPress={handleCancel} className="justify-center items-center py-2.5">
                        <Text className="text-white font-bold text-base">Cancel</Text>
                    </TouchableOpacity>
                </View>

                {search.trim().length === 0 ? (
                    <View className="flex-1 justify-center items-center px-6">
                        <Text className="text-white text-xl font-bold mb-2 text-center">
                            Play what you love
                        </Text>
                        <Text className="text-[#b3b3b3] text-sm text-center">
                            Search for artists, songs, playlists, and more.
                        </Text>
                    </View>
                ) : isTypingOrLoading ? (
                    <View className="flex-1 bg-[#000000] justify-center items-center">
                        <ActivityIndicator size="large" color="#1DB954" />
                    </View>
                ) : searchResults.length === 0 ? (
                    <View className="flex-1 justify-center items-center px-6">
                        <Text className="text-white text-xl font-bold mb-2 text-center">
                            No results found for "{search}"
                        </Text>
                        <Text className="text-[#b3b3b3] text-sm text-center">
                            Please make sure your words are spelled correctly, or use fewer or different keywords.
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item) => item._id}
                        renderItem={renderSearchItem}
                        className="flex-1 mt-6"
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}