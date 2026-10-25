import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export function FormSheetModal({
  visible,
  title,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-center items-center bg-black/80 px-6"
      >
        <View className="bg-[#181818] rounded-3xl p-6 w-full max-w-sm border border-[#282828] shadow-2xl items-center">
          <Text className="text-white text-xl font-extrabold text-center tracking-tight mt-1 mb-4">
            {title}
          </Text>

          <View className="w-full">
            {children}
          </View>

          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            className="py-3 items-center mt-3"
          >
            <Text className="text-[#A7A7A7] text-xs font-bold tracking-widest uppercase">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}