import { View, Text, TouchableOpacity } from 'react-native'
import { useLogoutMutation } from '@/hooks/use-auth'
import { router } from 'expo-router'

export default function SettingAndPrivacy() {
    const { mutate, isPending } = useLogoutMutation()

    const handleLogout = () => {
        mutate(undefined, {
            onSuccess: () => {
                router.replace('/(auth)/login')
                return 
            },
        })
    }

    return (
        <View className="flex-1 items-center justify-center p-4 bg-black">
            <TouchableOpacity
                onPress={handleLogout}
                disabled={isPending}
                className={`bg-white py-2 px-3 rounded-xl shadow-sm border border-gray-200 items-center ${isPending ? 'opacity-50' : ''}`}
            >
                <Text className="text-gray-900 font-semibold text-base">
                    {isPending ? 'Logging out...' : 'Logout'}
                </Text>
            </TouchableOpacity>
        </View>
    )
}
