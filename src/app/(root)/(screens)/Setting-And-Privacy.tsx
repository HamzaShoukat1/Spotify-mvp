import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLogoutMutation } from '@/hooks/use-auth';
import { router } from 'expo-router';
import { LogOut, ChevronRight } from 'lucide-react-native';
import { FormSheetModal } from '@/components/FormSheetModel';

export default function SettingAndPrivacy() {
    const { mutate, isPending } = useLogoutMutation();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        mutate(undefined, {
            onSuccess: () => {
                setShowLogoutModal(false);
                router.replace('/(auth)/login');
            },
        });
    };

    return (
        <View className="flex-1 bg-[#121212] pt-6 px-4">
            <TouchableOpacity
                onPress={() => setShowLogoutModal(true)}
                activeOpacity={0.7}
                className="flex-row items-center justify-between mt-12 py-4 px-4 bg-[#181818] rounded-2xl border border-neutral-800"
            >
                <View className="flex-row items-center gap-3">
                    <View className="w-9 h-9 rounded-full bg-red-500/10 items-center justify-center">
                        <LogOut size={18} color="#EF4444" />
                    </View>
                    <Text className="text-white text-base font-semibold">
                        Log out
                    </Text>
                </View>
                <ChevronRight size={18} color="#737373" />
            </TouchableOpacity>

            <FormSheetModal
                visible={showLogoutModal}
                title="Log Out of Spotify?"
                onClose={() => setShowLogoutModal(false)}
            >
                <Text className="text-neutral-400 text-sm leading-5 text-center mb-6">
                    You are about to log out of your Spotify account. You will need to log in again to access your account.
                </Text>

                <TouchableOpacity
                    activeOpacity={0.85}
                    disabled={isPending}
                    onPress={handleLogout}
                    className="w-full bg-[#1DB954] py-4 rounded-full items-center justify-center shadow-lg shadow-[#1DB954]/30"
                >
                    {isPending ? (
                        <ActivityIndicator color="#000000" size="small" />
                    ) : (
                        <Text className="text-black text-sm font-extrabold tracking-wider">
                            LOG OUT
                        </Text>
                    )}
                </TouchableOpacity>
            </FormSheetModal>
        </View>
    );
}