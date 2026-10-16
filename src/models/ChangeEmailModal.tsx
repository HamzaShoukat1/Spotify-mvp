import { useEffect, useRef, useState, type MutableRefObject } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { BlurView } from "expo-blur";
import { Mail, ShieldCheck } from "lucide-react-native";
import { useEmailChange } from "@/hooks/use-auth";
import Toast from "react-native-toast-message";

type Step = "currentOtp" | "newEmail" | "newOtp";

interface ChangeEmailModalProps {
    currentEmail: string;
    onClose: () => void;
}

const hiddensomeemailcharacter = (email: string) => {
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    return `${name.slice(0, 2)}${"*".repeat(Math.max(3, name.length - 2))}@${domain}`;
};

export function ChangeEmailModal({
    currentEmail,
    onClose,
}: ChangeEmailModalProps) {
    const { requestCurrentOtp, verifyCurrentOtp, requestNewOtp, confirmChange } =
        useEmailChange();
    const [step, setStep] = useState<Step>("currentOtp");
    const [otpDigits, setOtpDigits] = useState<string[]>(() => Array(6).fill(""));
    const [newEmail, setNewEmail] = useState("");
    const [verificationToken, setVerificationToken] = useState("");
    const [error, setError] = useState("");
    const inputs = useRef<Array<TextInput | null>>([]);
    const hasRequestedInitialOtp = useRef(false);
    const otp = otpDigits.join("");

    useEffect(() => {
        if (hasRequestedInitialOtp.current) return;
        hasRequestedInitialOtp.current = true;
        requestCurrentOtp.mutate(undefined, {
            onError: () => setError("We could not send the code. Please try again."),
        });
    }, []);

    useEffect(() => {
        setOtpDigits(Array(6).fill(""));
        setError("");
        const timer = setTimeout(() => {
            inputs.current[0]?.focus();
        }, 100);
        return () => clearTimeout(timer);
    }, [step]);

    const isPending =
        requestCurrentOtp.isPending ||
        verifyCurrentOtp.isPending ||
        requestNewOtp.isPending ||
        confirmChange.isPending;

    const handleOtpChange = (value: string, index: number) => {
        const digits = value.replace(/\D/g, "");
        const nextOtp = [...otpDigits];

        if (!digits) {
            nextOtp[index] = "";
            setOtpDigits(nextOtp);
            return;
        }

        digits
            .slice(0, 6 - index)
            .split("")
            .forEach((digit, offset) => {
                nextOtp[index + offset] = digit;
            });
        setOtpDigits(nextOtp);
        inputs.current[Math.min(index + digits.length, 5)]?.focus();
    };

    const handleOtpKeyPress = (key: string, index: number) => {
        if (key === "Backspace" && !otpDigits[index] && index > 0) {
            const nextOtp = [...otpDigits];
            nextOtp[index - 1] = "";
            setOtpDigits(nextOtp);
            inputs.current[index - 1]?.focus();
        }
    };

    const verifyCurrent = () => {
        if (otp.length !== 6)
            return setError("Enter the six-digit code from your current email.");
        setError("");
        verifyCurrentOtp.mutate(otp, {
            onSuccess: (data) => {
                setVerificationToken(data.verificationToken);
                setStep("newEmail");
            },
            onError: (requestError) => setError(requestError.message),
        });
    };

    const sendNewEmailCode = () => {
        const normalizedEmail = newEmail.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return setError("Enter a valid new email address.");
        }
        setError("");
        requestNewOtp.mutate(
            { newEmail: normalizedEmail, verificationToken },
            {
                onSuccess: () => {
                    setNewEmail(normalizedEmail);
                    setStep("newOtp");
                },
                onError: (requestError) => setError(requestError.message),
            },
        );
    };

    const saveNewEmail = () => {
        if (otp.length !== 6)
            return setError("Enter the six-digit code from your new email.");
        setError("");
        confirmChange.mutate(
            { newEmail, otp, verificationToken },
            {
                onSuccess: () => {
                    Toast.show({ position: "top", text1: "Email changed successfully" });
                    onClose();
                },
                onError: (requestError) => setError(requestError.message),
            },
        );
    };

    const resend = () => {
        setError("");
        if (step === "currentOtp") {
            requestCurrentOtp.mutate(undefined, {
                onError: (requestError) => setError(requestError.message),
            });
        } else if (step === "newOtp") {
            requestNewOtp.mutate(
                { newEmail, verificationToken },
                { onError: (requestError) => setError(requestError.message) },
            );
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <BlurView
                intensity={20}
                tint="dark"
                style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
            />
            <Pressable
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    backgroundColor: "rgba(0,0,0,0.55)",
                }}
                onPress={onClose}
            />
            <View
                style={{
                    width: "85%",
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: "#282828",
                    backgroundColor: "#121212",
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                }}
            >
                <View className="mb-3 flex-row items-center gap-3">
                    <View className="h-9 w-9 items-center justify-center rounded-xl bg-[#1f1f1f]">
                        <Mail size={18} color="#1DB954" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-[17px] font-bold text-white">
                            Change email
                        </Text>
                        <Text className="mt-0.5 text-xs text-[#A7A7A7]">
                            Verify both addresses to continue
                        </Text>
                    </View>
                </View>

                {step === "currentOtp" && (
                    <>
                        <Text className="mb-1 text-base font-semibold text-white">
                            Enter the code we emailed you
                        </Text>
                        <Text className="mb-3 text-sm leading-5 text-[#A7A7A7]">
                            Sent to {hiddensomeemailcharacter(currentEmail)}. Check your spam folder if you
                            do not see it.
                        </Text>
                        <OtpBoxes
                            otp={otp}
                            inputs={inputs}
                            onChange={handleOtpChange}
                            onKeyPress={handleOtpKeyPress}
                        />
                        <PrimaryButton
                            label="Verify current email"
                            labelColor="#FFFFFF"
                            onPress={verifyCurrent}
                            disabled={otp.length !== 6 || isPending}
                            pending={isPending}
                        />
                        <ResendButton onPress={resend} disabled={isPending} />
                    </>
                )}

                {step === "newEmail" && (
                    <>
                        <Text className="mb-1 text-base font-semibold text-white">
                            Enter new email address
                        </Text>
                        <Text className="mb-3 text-sm leading-5 text-[#A7A7A7]">
                            Your current email is verified. We will send one final code to the
                            new address.
                        </Text>
                        <TextInput
                            value={newEmail}
                            onChangeText={setNewEmail}
                            placeholder="New email address"
                            placeholderTextColor="#727272"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoFocus
                            className="mb-4 rounded-xl border border-gray-300 bg-[#1f1f1f] px-4 py-3.5 text-white"
                        />
                        <PrimaryButton
                            label="Send code"
                            onPress={sendNewEmailCode}
                            disabled={!newEmail.trim() || isPending}
                            pending={isPending}
                            labelColor="white"
                        />
                    </>
                )}

                {step === "newOtp" && (
                    <>
                        <Text className="mb-1 text-base font-semibold text-white">
                            Enter the code we emailed you
                        </Text>
                        <Text className="mb-3 text-sm leading-5 text-[#A7A7A7]">
                            Check {newEmail} and enter the six-digit code.
                        </Text>
                        <OtpBoxes
                            otp={otp}
                            inputs={inputs}
                            onChange={handleOtpChange}
                            onKeyPress={handleOtpKeyPress}
                        />
                        <PrimaryButton
                            label="Update email"
                            onPress={saveNewEmail}
                            disabled={otp.length !== 6 || isPending}
                            pending={isPending}
                            labelColor="white"
                        />
                        <ResendButton onPress={resend} disabled={isPending} />
                    </>
                )}

                {!!error && (
                    <Text className="mt-3 text-center text-sm text-white">{error}</Text>
                )}
                <TouchableOpacity
                    onPress={onClose}
                    disabled={isPending}
                    className="mt-5 items-center"
                >
                    <Text className="text-sm font-semibold text-[#A7A7A7]">Cancel</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

function OtpBoxes({
    otp,
    inputs,
    onChange,
    onKeyPress,
}: {
    otp: string;
    inputs: MutableRefObject<Array<TextInput | null>>;
    onChange: (value: string, index: number) => void;
    onKeyPress: (key: string, index: number) => void;
}) {
    return (
        <View className="mb-3 flex-row justify-between">
            {Array.from({ length: 6 }, (_, index) => (
                <TextInput
                    key={index}
                    ref={(input) => {
                        inputs.current[index] = input;
                    }}
                    value={otp[index] || ""}
                    onChangeText={(value) => onChange(value, index)}
                    onKeyPress={({ nativeEvent }) => onKeyPress(nativeEvent.key, index)}
                    keyboardType="number-pad"
                    maxLength={6}
                    selectTextOnFocus
                    style={{
                        width: "13%",
                        height: 48,
                        minHeight: 48,
                        paddingHorizontal: 0,
                        paddingVertical: 0,
                        textAlign: "center",
                        textAlignVertical: "center",
                    }}
                    className="rounded-lg border border-[#727272] bg-[#1f1f1f] text-xl font-semibold text-white"
                />
            ))}
        </View>
    );
}

function PrimaryButton({
    label,
    labelColor = "#000000",
    onPress,
    disabled,
    pending,
}: {
    label: string;
    labelColor?: string;
    onPress: () => void;
    disabled: boolean;
    pending: boolean;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            className={`items-center rounded-full py-3 ${disabled ? "bg-[#315b41]" : "bg-[#1DB954]"}`}
        >
            {pending ? (
                <ActivityIndicator color={labelColor} />
            ) : (
                <Text style={{ color: labelColor }} className="font-bold">
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
}

function ResendButton({
    onPress,
    disabled,
}: {
    onPress: () => void;
    disabled: boolean;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            className="mt-5 flex-row items-center justify-center gap-2"
        >
            <ShieldCheck size={15} color="#A7A7A7" />
            <Text className="text-sm font-semibold text-[#A7A7A7]">Resend code</Text>
        </TouchableOpacity>
    );
}