import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

type ArtistStepLayoutProps = {
    step: number;
    title: string;
    description: string;
    onBack: () => void;
    onNext?: () => void | Promise<void>;
    nextLabel?: string;
    isPending?: boolean;
    totalSteps?: number;
    children: React.ReactNode;
};

export function ArtistStepLayout({
    step,
    title,
    description,
    onBack,
    onNext,
    nextLabel = 'Continue',
    isPending = false,
    totalSteps = 4,
    children,
}: ArtistStepLayoutProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isLoading = isPending || isSubmitting;

    const handleNext = async () => {
        if (!onNext || isLoading) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onNext();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0B0B0B]" style={{ backgroundColor: '#0B0B0B' }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1 bg-[#0B0B0B]"
                style={{ backgroundColor: '#0B0B0B' }}
            >
                <View className="px-6 pt-2">
                    {/* Header Navigation */}
                    <View className="flex-row items-center justify-between">
                        <Pressable
                            onPress={onBack}
                            className="h-10 w-10 items-center justify-center rounded-full bg-[#1F1F1F] active:bg-[#2C2C2C]"
                            accessibilityLabel="Go back"
                        >
                            <ChevronLeft size={21} color="#FFFFFF" />
                        </Pressable>
                        <Text className="text-xs font-bold uppercase tracking-[2px] text-[#A7A7A7]">
                            Become an artist
                        </Text>
                        <View className="h-10 w-10" />
                    </View>

                    {/* Segmented Progress Line with Gaps directly above Step text */}
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '100%',
                            height: 6,
                            marginTop: 24,
                        }}
                    >
                        {Array.from({ length: totalSteps }, (_, index) => index + 1).map((item) => (
                            <View
                                key={item}
                                style={{
                                    flex: 1,
                                    height: 6,
                                    marginRight: item === totalSteps ? 0 : 8,
                                    borderRadius: 999,
                                    backgroundColor: item <= step ? '#1ED760' : '#292929',
                                }}
                            />
                        ))}
                    </View>

                    {/* Step Label */}
                    <Text className="mt-3 text-[11px] font-bold uppercase tracking-[1.5px] text-[#1ED760]">
                        Step {step} of {totalSteps}
                    </Text>
                </View>

                <ScrollView
                    className="flex-1 bg-[#0B0B0B]"
                    style={{ backgroundColor: '#0B0B0B' }}
                    contentContainerClassName="px-6 pt-7 pb-6"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Text className="text-[32px] font-black leading-[37px] tracking-tight text-white">
                        {title}
                    </Text>
                    <Text className="mt-3 max-w-[340px] text-[15px] leading-[22px] text-white">
                        {description}
                    </Text>
                    <View className="mt-8">{children}</View>
                </ScrollView>

                {onNext ? (
                    <View className="border-t border-[#202020] bg-[#0B0B0B] px-6 pb-5 pt-4">
                        <Pressable
                            onPress={handleNext}
                            disabled={isLoading}
                            className="mb-2 h-14 flex-row items-center justify-center rounded-full bg-[#1ED760] active:bg-[#1BC653] disabled:opacity-60"
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#000000" />
                            ) : (
                                <>
                                    <Text className="text-[15px] font-black uppercase tracking-[1px] text-black">
                                        {nextLabel}
                                    </Text>
                                    <ChevronRight size={19} color="#000000" strokeWidth={3} />
                                </>
                            )}
                        </Pressable>
                    </View>
                ) : null}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}