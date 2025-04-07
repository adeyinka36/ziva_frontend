import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    Image,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Link, useRouter} from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useAuth } from "@/contexts/auth";

type FormData = {
    token: string;
    password: string;
    confirmPassword: string;
};

export default function ForgotPasswordScreen() {
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
    // Assuming useAuth provides a forgotPassword function
    const { sendPasswordResetToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const router = useRouter();

    const onForgotPassword = async (data: FormData) => {
        setLoading(true);
        setApiError(null);

        if (data.password !== data.confirmPassword) {
            setApiError("Passwords do not match");
            setLoading(true);
            return;
        }

        // Call your forgotPassword function, which should return an error property if something goes wrong.
        const res = await sendPasswordResetToken(
            data.token,
            data.password,
            data.confirmPassword
        );

        if (res.error) {
            setApiError(res.error);
            setLoading(false);
        }

        if(res.success){
            setLoading(false);
            router.replace("/login");
        }else  {
            setLoading(false);
            setApiError('An unexpected error occurred');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-primary"
        >
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 24,
                }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Illustration */}
                <View className="items-center mb-8">
                    <Image
                        style={{ height: hp(25) }}
                        resizeMode="contain"
                        source={require("../assets/images/ziva_logo.png")}
                    />
                </View>

                <Text className="text-black font-bold text-xl mb-6">Please provide token sent to your email</Text>
                {/* API Error Message */}
                {apiError && (
                    <Text className="text-red-500 text-xl mb-2">{apiError}</Text>
                )}

                {/* Token Input */}
                <View className="w-full mb-3">
                    <Controller
                        control={control}
                        name="token"
                        rules={{ required: "Reset token is required" }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <>
                                <View className="flex-row items-center w-full bg-primary rounded-lg border text-base p-4">
                                    <FontAwesome name="key" size={20} color="black" className="mr-3" />
                                    <TextInput
                                        className="flex-1 text-black font-bold"
                                        placeholder="Reset Token"
                                        placeholderTextColor="#000"
                                        value={value}
                                        onChangeText={onChange}
                                        style={{ height: hp(6), paddingVertical: 0 }}
                                        numberOfLines={1}
                                        autoCapitalize="none"
                                    />
                                </View>
                                {error && <Text className="text-red-500 text-sm mt-1">{error.message}</Text>}
                            </>
                        )}
                    />
                </View>

                {/* New Password Input */}
                <View className="w-full mb-3">
                    <Controller
                        control={control}
                        name="password"
                        rules={{
                            required: "New password is required",
                            pattern: {
                                value: /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).+$/,
                                message:
                                    "Password must be alphanumeric with at least one number and one special character",
                            },
                        }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <>
                                <View className="flex-row items-center w-full bg-primary rounded-lg border text-base p-4">
                                    <FontAwesome name="lock" size={30} color="black" className="mr-3" />
                                    <TextInput
                                        className="flex-1 text-black font-bold"
                                        placeholder="New Password"
                                        placeholderTextColor="#000"
                                        secureTextEntry
                                        value={value}
                                        onChangeText={onChange}
                                        style={{ height: hp(6), paddingVertical: 0 }}
                                        autoCapitalize="none"
                                    />
                                </View>
                                {error && <Text className="text-red-500 text-sm mt-1">{error.message}</Text>}
                            </>
                        )}
                    />
                </View>

                {/* Confirm Password Input */}
                <View className="w-full mb-3">
                    <Controller
                        control={control}
                        name="confirmPassword"
                        rules={{ required: "Please confirm your password" }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <>
                                <View className="flex-row items-center w-full bg-primary rounded-lg border text-base p-4">
                                    <FontAwesome name="lock" size={30} color="black" className="mr-3" />
                                    <TextInput
                                        className="flex-1 text-black font-bold"
                                        placeholder="Confirm Password"
                                        placeholderTextColor="#000"
                                        secureTextEntry
                                        value={value}
                                        onChangeText={onChange}
                                        style={{ height: hp(6), paddingVertical: 0 }}
                                    />
                                </View>
                                {error && <Text className="text-red-500 text-sm mt-1">{error.message}</Text>}
                            </>
                        )}
                    />
                </View>

                {/* Reset Password Button */}
                <TouchableOpacity
                    onPress={handleSubmit(onForgotPassword)}
                    className="bg-black p-4 rounded-lg mt-6 min-w-full"
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" size="small" className="min-w-full"/>
                    ) : (
                        <Text className="text-primary text-center font-bold text-xl">
                            RESET PASSWORD
                        </Text>
                    )}
                </TouchableOpacity>

                {/* Back to Login Link */}
                <Text className="mt-4 text-black">
                    Remember your password?{" "}
                    {loading ? (
                        <Text className="text-dark font-bold">Login</Text>
                    ) : (
                        <Link href="/login" className="text-dark font-bold">
                            Login
                        </Link>
                    )}
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
