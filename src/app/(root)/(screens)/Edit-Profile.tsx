import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native'
import { Mail, UserPen } from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router';
import { useChangeUsername, useCurrentUser } from '@/hooks/use-auth';
import { useState } from 'react';
import { ChangeUserNameModal } from '@/models/ChangeUsernameModal';
import Toast from 'react-native-toast-message';

export default function EditProfile() {
    const { data: UserDetails, isLoading } = useCurrentUser()
    const { mutate, isPending } = useChangeUsername()
    const router = useRouter()

    const userName = UserDetails?.name?.trim() || 'User'
    const userInitial = userName.charAt(0).toUpperCase()
    const [isModalOpen, setIsModalOpen] = useState(false);

    const HandleUsernameChange = (newUserName: string) => {
        mutate(newUserName)

        Toast.show({
            position: 'top',
            visibilityTime: 1800,
            text1: 'username changed successfully'
        });

    }

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 w-full"
            >
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ alignItems: 'center' }}
                >
                    <View className="shadow-2xl w-full flex items-center shadow-black my-6">
                        <View className="w-[140px] h-[140px] rounded-full bg-[#282828] items-center justify-center border-2 border-[#b3b3b3]">
                            <Text className="text-white text-5xl font-bold tracking-wide">
                                {userInitial}
                            </Text>
                        </View>
                    </View>

                    {/* Action Menu List */}
                    <View className="w-full flex flex-col gap-6 px-8">
                        <TouchableOpacity
                            onPress={() => setIsModalOpen(true)}
                            className="flex-row items-center gap-3 py-1"
                        >
                            <UserPen strokeWidth={1.5} size={22} color="#B3B3B3" />
                            <Text className="text-white text-base font-semibold">Change username</Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center gap-3 py-1">
                            <Mail strokeWidth={1.5} size={22} color="#B3B3B3" />
                            <Text className="text-white text-base font-semibold">Change email</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <View className="px-8 pb-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="py-4  items-center bg-[#282828] rounded-xl"
                    >
                        <Text className="text-white text-base font-semibold tracking-wider">
                            Close
                        </Text>
                    </TouchableOpacity>
                </View>

                {isModalOpen && (
                    <View className="absolute inset-0 z-[70]">
                        <ChangeUserNameModal
                            onClose={() => setIsModalOpen(false)}
                            currentUsername={userName}
                            onSave={HandleUsernameChange}
                        />
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
