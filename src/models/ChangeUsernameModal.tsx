import React, { useState } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Pressable,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { User } from 'lucide-react-native';

interface ChangeUserNameModalProps {
    onClose: () => void;
    currentUsername?: string;
    onSave?: (newUsername: string) => void;
}

export function ChangeUserNameModal({
    onClose,
    currentUsername = '',
    onSave,
}: ChangeUserNameModalProps) {
    const [username, setUsername] = useState(currentUsername);

    const handleSave = () => {
        if (onSave) onSave(username);
        onClose();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            {/* Backdrop Blur & Overlay */}
            <BlurView
                intensity={20}
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
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
                onPress={onClose}
            />

            <View
                style={{
                    width: '85%',
                    borderRadius: 20, 
                    backgroundColor: '#121212',
                    paddingHorizontal: 20,
                    paddingTop: 24,
                    paddingBottom: 24,
                    borderWidth: 1,
                    borderColor: '#282828',
                }}
            >
                {/* Header Section */}
                <View className="flex-row items-center gap-3 mb-5">
                    <View className="h-9 w-9 items-center justify-center rounded-lg bg-[#181818] border border-[#282828]">
                        <User size={18} color="#1DB954" strokeWidth={2.2} />
                    </View>
                    <View className="ml-2.5">
                        <Text className="text-[17px] font-bold text-white tracking-tight">Update Username</Text>
                        <Text className="text-[12px] text-[#A7A7A7] mt-0.5">Pick a unique name for your profile</Text>
                    </View>
                </View>

                {/* Input Field Container */}
                <View className="mb-6">
                    <View 
                        className="flex-row items-center bg-[#1F1F1F] rounded-lg px-3.5 py-2.5 border border-[#282828]"
                        style={{ minHeight: 46 }}
                    >
                        <TextInput
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Enter new username"
                            placeholderTextColor="#727272"
                            autoFocus
                            autoCapitalize="none"
                            autoCorrect={false}
                            maxLength={20}
                            style={{
                                flex: 1,
                                color: '#FFFFFF',
                                fontSize: 12,
                                fontWeight: '500',
                                padding: 3,
                            }}
                        />
                        <Text className="text-[11px] text-white p-1 font-medium ml-2">
                            {username.length}/20
                        </Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-4">
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={onClose}
                        className="flex-1 items-center justify-center rounded-full bg-transparent py-2.5 border border-[#727272]"
                    >
                        <Text className="text-[14px] font-bold text-white">Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleSave}
                        disabled={!username.trim()}
                        style={{
                            backgroundColor: username.trim() ? '#1DB954' : 'rgba(29, 185, 84, 0.3)',
                        }}
                        className="flex-1 items-center justify-center rounded-full py-2.5"
                    >
                        <Text 
                            style={{
                                color: username.trim() ? '#000000' : 'rgba(0, 0, 0, 0.5)',
                            }}
                            className="text-[14px] font-bold"
                        >
                            Save Changes
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
