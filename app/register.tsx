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
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useAuth } from "@/contexts/auth";

type FormData = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function RegisterScreen() {
    console.log("Register screen loaded");
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const onRegister = async (data: FormData) => {
        setLoading(true);
        setApiError(null);

        if (data.password !== data.confirmPassword) {
            setLoading(false);
            alert("Passwords do not match");
            return;
        }

        // Call your register function, which should return an object with an error property if something went wrong.
        try{
            await register(
                data.firstName,
                data.lastName,
                data.email,
                data.password,
                data.confirmPassword,
                data.username
            );
            setLoading(false);
        }catch (error: any) {
            setApiError("An error occurred");
            setLoading(false);
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
                {/* Illustration */}
                <View className="items-center mb-8">
                    <Image
                        style={{ height: hp(25) }}
                        resizeMode="contain"
                        source={require("../assets/images/ziva_logo.webp")}
                    />
                </View>

                {/* API Error Message */}
                {apiError && (
                    <Text className="text-red-500 text-xl mb-2">
                        {apiError}
                    </Text>
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
                                        autoCorrect={false}
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
                                        autoCorrect={false}
                                    />
                                </View>
                                {error && <Text className="text-red-500 text-sm mt-1">{error.message}</Text>}
                            </>
                        )}
                    />
                </View>

                {/* Username Input */}
                <View className="w-full mb-3">
                    <Controller
                        control={control}
                        name="username"
                        rules={{ required: "Username is required" }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <>
                                <View className="flex-row items-center w-full bg-primary rounded-lg border text-base p-4">
                                    <FontAwesome name="user" size={20} color="black" className="mr-3" />
                                    <TextInput
                                        className="flex-1 text-black font-bold"
                                        placeholder="Display Name"
                                        placeholderTextColor="#000"
                                        value={value}
                                        onChangeText={onChange}
                                        style={{ height: hp(6), paddingVertical: 0 }}
                                        numberOfLines={1}
                                        autoCapitalize="none"
                                        autoCorrect={false}
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
                                        autoCorrect={false}
                                    />
                                </View>
                                {error && <Text className="text-red-500 text-sm mt-1">{error.message}</Text>}
                            </>
                        )}
                    />
                </View>

                {/* Password Input */}
                <View className="w-full mb-3">
                    <Controller
                        control={control}
                        name="password"
                        rules={{
                            required: "Password is required",
                            pattern: {
                                value: /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).+$/,
                                message: "Password must be alphanumeric with at least one number and one special character",
                            },
                        }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <>
                                <View className="flex-row items-center w-full bg-primary rounded-lg border text-base p-4">
                                    <FontAwesome name="lock" size={30} color="black" className="mr-3" />
                                    <TextInput
                                        className="flex-1 text-black font-bold"
                                        placeholder="Password"
                                        placeholderTextColor="#000"
                                        secureTextEntry
                                        value={value}
                                        onChangeText={onChange}
                                        style={{ height: hp(6), paddingVertical: 0 }}
                                        autoCapitalize="none"
                                        autoCorrect={false}
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
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                </View>
                                {error && <Text className="text-red-500 text-sm mt-1">{error.message}</Text>}
                            </>
                        )}
                    />
                </View>

                {/* Register Button */}
                <TouchableOpacity
                    onPress={handleSubmit(onRegister)}
                    className="bg-black p-4 rounded-lg mt-6 min-w-full"
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" size="small" className="min-w-full"/>
                    ) : (
                        <Text className="text-primary text-center font-bold text-xl">REGISTER</Text>
                    )}
                </TouchableOpacity>

                {/* Login Link */}
                <View className="mt-4">
                    {loading ? (
                        <Text className="text-black">
                            Already have an account? <Text className="text-dark font-bold">Login</Text>
                        </Text>
                    ) : (
                        <Text className="mt-4 text-black">
                            Already have an account?{" "}
                            <Link href="/login" className="text-dark font-bold">
                                Login
                            </Link>
                        </Text>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
