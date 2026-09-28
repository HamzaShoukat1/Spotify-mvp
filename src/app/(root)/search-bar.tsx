import { router } from 'expo-router'
import { Search } from 'lucide-react-native'
import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Searchbar() {
    return (
        <SafeAreaView className="flex-1 bg-black">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 w-full px-4"
            >
                <View className="flex-row mt-4 items-center gap-3">
                    <View className="flex-1 flex-row items-center bg-[#282828] rounded-[10px] px-4 py-2.5">
                        <Search color="#777777" size={21} className="mr-2" />
                        <TextInput
                            placeholder="Search"
                            placeholderTextColor="#ffff"
                            className="flex-1 text-white text-base p-0 m-0"
                        />
                    </View>
                    <TouchableOpacity onPress={() => router.push("/(root)/(tabs)/search")}
                        className="justify-center items-center py-2.5">
                        <Text className="text-white font-bold text-base">
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
