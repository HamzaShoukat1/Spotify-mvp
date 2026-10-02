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
        className="flex-1 justify-center items-center bg-black/75 px-6"
      >
        <View className="bg-[#121212] rounded-3xl p-6 w-full max-w-sm border border-white/5 shadow-2xl">
          <Text className="text-white text-xl font-black text-center tracking-tight mt-2 mb-6">
            {title}
          </Text>

          <View className="w-full">
            {children}
          </View>

          {/* <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.6}
            className="py-3 items-center mt-2"
          >
            <Text className="text-[#A7A7A7] text-sm font-bold tracking-wider uppercase">
              Cancel
            </Text>
          </TouchableOpacity> */}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}