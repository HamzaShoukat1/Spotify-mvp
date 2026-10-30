import React, { useEffect, useRef } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Keyboard,
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
  liftOnKeyboard = false,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  liftOnKeyboard?: boolean;
}) {
  const keyboardLift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!liftOnKeyboard) return;

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      const lift = Math.min(event.endCoordinates.height * 0.35, 150);
      Animated.timing(keyboardLift, {
        toValue: -lift,
        duration: event.duration ?? 220,
        useNativeDriver: true,
      }).start();
    });
    const hideSubscription = Keyboard.addListener(hideEvent, (event) => {
      Animated.timing(keyboardLift, {
        toValue: 0,
        duration: event.duration ?? 180,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      keyboardLift.stopAnimation();
    };
  }, [keyboardLift, liftOnKeyboard]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={liftOnKeyboard ? undefined : Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
        className="flex-1 justify-center items-center bg-black/80 px-6"
      >
        <Animated.View
          style={{ transform: [{ translateY: liftOnKeyboard ? keyboardLift : 0 }] }}
          className="bg-[#181818] rounded-3xl p-6 w-full max-w-sm border border-[#282828] shadow-2xl items-center"
        >
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
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
