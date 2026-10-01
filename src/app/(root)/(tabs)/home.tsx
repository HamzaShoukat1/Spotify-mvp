import { View, Text, KeyboardAvoidingView, Platform, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Bell, timer, setting } from '../../../assets/images/index'
import { router, useNavigation } from 'expo-router'


const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1517230878791-4d28214057c2?ixid=M3w4MjcwNjd8MHwxfHNlYXJjaHwxfHxzaW5nZXJ8ZW58MHx8fHwxNzkwMzUwNzgzfDA&ixlib=rb-4.1.0&fit=max&q=80'


const PLACEHOLDER_IMAGE1 = 'https://images.unsplash.com/photo-1581368135153-a506cf13b1e1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const ARTIST_IMAGE = "https://images.unsplash.com/photo-1608319917470-9d9179430f8d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
const RECENTLY_PLAYED_DATA = [
    { id: '1', name: '1Remastered', isArtist: false, image: PLACEHOLDER_IMAGE },
    { id: '4', name: 'Lana Del Rey', isArtist: true, image: PLACEHOLDER_IMAGE1 },
    { id: '13', name: 'Marvin Gaye', isArtist: true, image: PLACEHOLDER_IMAGE },
    { id: '14', name: 'Indie Pop', isArtist: false, image: PLACEHOLDER_IMAGE },
];

const EDITORS_PICKS_DATA = [
    { id: '1', name: 'Ed Sheeran, Big Sean,Juice WRLD, Post Malone', image: PLACEHOLDER_IMAGE },
    { id: '2', name: 'Mitski, Tame Impala,Glass Animals, Charli XCX', image: PLACEHOLDER_IMAGE1 },
    { id: '3', name: 'A1', image: PLACEHOLDER_IMAGE1 },
    { id: '4', name: 'Front Left', image: PLACEHOLDER_IMAGE },
];
const ARTIST_DATA = [
    { id: '1', name: 'sonima', image: ARTIST_IMAGE },
    { id: '2', name: 'ankuma', image: ARTIST_IMAGE },
    { id: '3', name: 'deinsa', image: ARTIST_IMAGE },
    { id: '4', name: 'Fsansa', image: ARTIST_IMAGE },
];

export default function Home() {
    const navigation = useNavigation()
    const openProfileDrawer = () => {
        navigation.getParent()?.dispatch({ type: 'OPEN_DRAWER' })
    }

    const renderPlaylistItem = ({ item }: any) => (
        <TouchableOpacity onPress={() => router.push('/(root)/(screens)/Album-View')}

            className="items-center mr-4 w-[110px]">
            <Image
                source={{ uri: item.image }}
                className={`w-full max-w-[105px] h-[105px] bg-neutral-800 ${item.isArtist ? 'rounded-full' : 'rounded-md'}`}
                resizeMode="cover"
            />
            <Text
                numberOfLines={1}
                className="text-neutral-400 font-medium text-[11.5px] leading-[17px] mt-2 text-center w-full"
            >
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    const renderEditorsPickItem = ({ item }: any) => (
        <TouchableOpacity className="mr-4 w-[140px]">
            <Image
                source={{ uri: item.image }}
                className="w-full max-w-[154px] h-[154px] bg-neutral-800 rounded-none"
                resizeMode="cover"
            />
            <Text
                numberOfLines={2}
                className="text-neutral-400 text-xs font-semibold mt-2 w-full"
            >
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    const renderArtists = ({ item }: any) => (
        <TouchableOpacity

            className="items-center mr-4 w-[110px]">
            <Image
                source={{ uri: item.image }}
                className={`w-full max-w-[105px] h-[105px] rounded-full bg-neutral-800 `}
                resizeMode="cover"
            />
            <Text
                numberOfLines={1}
                className="text-neutral-400 font-medium text-[11.5px] leading-[17px] mt-2 text-center w-full"
            >
                {item.name}
            </Text>
        </TouchableOpacity>
    );


    return (
        <SafeAreaView className="flex-1 bg-black">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 w-full"
            >
                <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                    <View className='w-10 h-10 m-3 rounded-full bg-green-600 flex items-center justify-center'>
                        <TouchableOpacity onPress={openProfileDrawer}>
                            <Text className='text-white font-extrabold text-[20px] text-center'>
                                H
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Header */}
                    <View className="flex-row justify-between  ml-1 items-center relative p-4">
                        <Text className="font-[700] text-[19px] text-white leading-[28px] ">
                            Recently played
                        </Text>
                       

                    </View>

                    {/* Recently Playe List */}
                    <View className="w-full max-w-[530px] px-4 mt-2">
                        <FlatList
                            data={RECENTLY_PLAYED_DATA}
                            renderItem={renderPlaylistItem}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>

                    {/* Editor Pick Section */}
                    <View className="w-full max-w-[550px] px-4 mt-8 mb-6">
                        <Text className="font-[700] text-[19px] ml-1 text-white leading-[28px] mb-4">
                            Editor's picks
                        </Text>
                        <FlatList
                            data={EDITORS_PICKS_DATA}
                            renderItem={renderEditorsPickItem}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>

                    <View className='w-full max-w-[530px] px-4 mt-2'>
                        <Text className="font-[700] text-[19px] mb-4 ml-1 text-white leading-[28px] ">
                            Popular Artists
                        </Text>
                        <FlatList
                            data={ARTIST_DATA}
                            renderItem={renderArtists}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
