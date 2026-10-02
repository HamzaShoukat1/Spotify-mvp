import { Music } from 'lucide-react-native';
import { Modal, Text, View, TouchableOpacity } from 'react-native';
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
            <View className="flex-1 mb-10 justify-end bg-gray-700/50">
                <TouchableOpacity
                    className="absolute top-0 left-0 right-0 bottom-0"
                    onPress={onClose}
                />


                <View className="bg-[#121212] rounded-md mx-4 mb-8  pb-10 border border-zinc-800 px-6">
                    <TouchableOpacity
                        onPress={() => {
                            onClose();
                            router.push('/(root)/(music)/music-audio');
                        }}
                        className="flex-row mt-4 items-center gap-3 gap-x-4"
                    >

                        <View className="w-14 h-14 bg-gray-600 rounded-full  items-center justify-center">
                            <Music size={24} color="#fff" />
                        </View>

                        <View className="flex-1 justify-center">
                            <Text className="text-white text-xl font-bold" numberOfLines={1}>
                                Add Music
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <View className="w-12 h-1 bg-white rounded-full self-center mb-8" />
                    <View className="w-12 h-1 bg-white rounded-full self-center mb-8" />

                    <View className="w-12 h-1 bg-white rounded-full self-center mb-8" />




                </View>
            </View>
        </Modal>
    );
}
