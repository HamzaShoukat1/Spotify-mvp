import {
    Text,
    View,
    TouchableOpacity,
    Pressable,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { Music } from 'lucide-react-native';
import { router } from 'expo-router';
import { useCurrentUser } from '@/hooks/use-auth';
import { useAlbumContext } from '@/context/AlbumContext';

export function AddMusicModal({
    onClose,
}: {
    visible: boolean;
    onClose: () => void;
}) {

    const { data: CurrentUser } = useCurrentUser()
    const { resetAlbum } = useAlbumContext();
    const isArtist = CurrentUser?.role === "artist";
    return (
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <BlurView
                intensity={50}
                tint="dark"
                style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
            />
            <Pressable
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                }}
                onPress={onClose}
            />
            <View
                style={{
                    width: '95%',
                    alignSelf: 'center',
                    borderRadius: 12,
                    backgroundColor: '#1C1C1E',

                    paddingHorizontal: 24,
                    paddingTop: 20,
                    paddingBottom: 20,
                }}
            >
                {isArtist && (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            onClose();
                            router.push('/(root)/(music)/music-audio');
                        }}
                        className="flex-row items-center py-2"
                    >
                        <View className="h-14 w-14 items-center justify-center rounded-full bg-[#3b3b3b]">
                            <Music size={26} color="#FFFFFF" strokeWidth={2} />
                        </View>
                        <View className="ml-4 flex-1">
                            <Text className="text-[17px] font-bold text-white">Add music</Text>
                            <Text className="mt-0.5 text-[13.5px] text-white">Upload a song for your audience</Text>
                        </View>
                    </TouchableOpacity>
                )}
                
                {isArtist && (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            onClose();
                            resetAlbum();
                            router.push('/(root)/(album)/album-metadata');
                        }}
                        className="flex-row items-center py-2"
                    >
                        <View className="h-14 w-14 items-center justify-center rounded-full bg-[#3b3b3b]">
                            <Music size={26} color="#FFFFFF" strokeWidth={2} />
                        </View>
                        <View className="ml-4 flex-1">
                            <Text className="text-[17px] font-bold text-white">Add Album</Text>
                            <Text className="mt-0.5 text-[13.5px] text-white">Upload an album for your audience</Text>
                        </View>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        onClose();
                        router.push('/(root)/(screens)/Create-Playlist');
                    }}
                    className="flex-row items-center py-2"
                >
                    <View className="h-14 w-14 items-center justify-center rounded-full bg-[#3b3b3b]">
                        <Music size={26} color="#FFFFFF" strokeWidth={2} />
                    </View>
                    <View className="ml-4 flex-1">
                        <Text className="text-[17px] font-bold text-white">Create playlist</Text>
                        <Text className="mt-0.5 text-[13.5px] text-white">Make a playlist for your music</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
