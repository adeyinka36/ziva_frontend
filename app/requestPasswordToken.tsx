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
import { Link, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useAuth } from "@/contexts/auth";

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
};

export default function RequestPasswordTokenScreen() {
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
    // Assuming useAuth provides a requestPasswordResetToken function.
    const { requestPasswordResetToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const router = useRouter();

    const onRequestToken = async (data: FormData) => {
        setLoading(true);
        setApiError(null);
        // Call your function that sends a token request to the API.
        const res = await requestPasswordResetToken(data.firstName, data.lastName, data.email);

        if (res.error) {
            setApiError(res.error);
            setLoading(false);
        }

        if(res.status === "success"){
            setLoading(false);
            router.replace("/resetPassword");
        } else  {
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
                contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 24 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="items-center mb-8">
                    <Image
                        style={{ height: hp(25) }}
                        resizeMode="contain"
                        source={require("../assets/images/ziva_logo.png")}
                    />
                </View>

                <Text className="text-black font-bold text-xl mb-6">Request Password Reset Token</Text>
                {/* API Error Message */}
                {apiError && (
                    <Text className="text-red-500 text-xl mb-2">{apiError}</Text>
                )}


                {/* First Name Input */}
                <View className="w-full mb-3">
                    <Controller
                        control={control}
                        name="firstName"
                        rules={{ required: "First name is required" }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <>
                                <View className="flex-row items-center w-full bg-primary rounded-lg border text-base p-4">
                                    <FontAwesome name="user" size={20} color="black" className="mr-3" />
                                    <TextInput
                                        className="flex-1 text-black font-bold"
                                        placeholder="First Name"
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

                {/* Last Name Input */}
                <View className="w-full mb-3">
                    <Controller
                        control={control}
                        name="lastName"
                        rules={{ required: "Last name is required" }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <>
                                <View className="flex-row items-center w-full bg-primary rounded-lg border text-base p-4">
                                    <FontAwesome name="user" size={20} color="black" className="mr-3" />
                                    <TextInput
                                        className="flex-1 text-black font-bold"
                                        placeholder="Last Name"
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

                {/* Email Input */}
                <View className="w-full mb-3">
                    <Controller
                        control={control}
                        name="email"
                        rules={{
                            required: "Email address is required",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Please enter a valid email address",
                            },
                        }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <>
                                <View className="flex-row items-center w-full bg-primary rounded-lg border text-base p-4">
                                    <FontAwesome name="envelope" size={20} color="black" className="mr-3" />
                                    <TextInput
                                        className="flex-1 text-black font-bold"
                                        placeholder="Email address"
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

                {/* Request Token Button */}
                <TouchableOpacity
                    onPress={handleSubmit(onRequestToken)}
                    className="bg-black p-4 rounded-lg mt-6 min-w-full"
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                        <Text className="text-primary text-center font-bold text-xl">
                            REQUEST TOKEN
                        </Text>
                    )}
                </TouchableOpacity>

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
