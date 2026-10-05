import {
    Modal,
    Text,
    View,
    TouchableOpacity,
    Pressable,
} from 'react-native';

import { Music, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

export function HomepageModal({
    visible,
    onClose,
}: {
    visible: boolean;
    onClose: () => void;
}) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="flex-1     justify-end bg-black/60">

                <Pressable
                    className="absolute inset-0"
                    onPress={onClose}
                />
                {/* Bottom Sheet */}
                <View className="w-full bg-[#121212] rounded-t-[32px] px-6  pb-10    border-t border-zinc-800">

                     <View className="mb-7">
                        {/* <Text className="text-white text-2xl font-bold">
                            Create
                        </Text>

                        <Text className="text-white text-sm mt-1">
                            Add something new for your community
                        </Text> */}
                    </View>

                    {/* Add Music */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            onClose();

                            router.push(
                                '/(root)/(music)/music-audio'
                            );
                        }}
                        className="flex-row items-center bg-[#1c1c1c] rounded-2xl  px-4 py-4 mb-4 border border-zinc-800"
                    >
                        {/* Icon */}
                        <View className="w-16 h-16 rounded-xl bg-[#282828] items-center justify-center">
                            <Music
                                size={30}
                                color="#fff"
                                strokeWidth={2}
                            />
                        </View>

                        {/* Text */}
                        <View className="flex-1 ml-4">
                            <Text className="text-white text-lg font-bold">
                                Add Music
                            </Text>
                        </View>

                        {/* Arrow */}
                        <View>
                            <ChevronRight
                                size={24}
                                color="#a1a1a1"
                            />
                        </View>
                    </TouchableOpacity>

                     <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={onClose}
                        className="h-14 rounded-full bg-[#282828] items-center justify-center mt-2"
                    >
                        <Text className="text-white text-base font-semibold">
                            Cancel
                        </Text>
                    </TouchableOpacity> 

                </View>
            </View>
        </Modal>
    );
}