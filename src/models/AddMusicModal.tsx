import {
    Text,
    View,
    TouchableOpacity,
    Pressable,
} from 'react-native';

import { BlurView } from 'expo-blur';
import { Music } from 'lucide-react-native';
import { router } from 'expo-router';

export function AddMusicModal({
    onClose,
}: {
    visible: boolean;
    onClose: () => void;
}) {
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
                        <Text className="mt-0.5 text-[13.5px] text-white">Upload a song to your library</Text>
                    </View>
                </TouchableOpacity>
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
                        <Text className="text-[17px] font-bold text-white">Playlist</Text>
                        <Text className="mt-0.5 text-[13.5px] text-white">Create a Playlist with musics</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}