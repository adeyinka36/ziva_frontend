import React from "react";
import { View, Text, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

type FormData = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function ForgotPasswordScreen() {
    const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>();

    const password = watch("password");

    const onForgotPassword = (data: FormData) => {
        if (data.password !== data.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        // Handle forgot password logic here
        console.log("Forgot password data", data);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-primary justify-center items-center p-6"
        >
            {/* Illustration */}
            <View className="items-center mb-8">
                <Image
                    style={{ height: hp(25) }}
                    resizeMode="contain"
                    source={require("../assets/images/ziva_logo.webp")}
                />
            </View>

            <Text className="text-black font-bold text-xl mb-6">Reset Your Password</Text>

            {/* Username Input */}
            <View className="w-full mb-3">
                <Controller
                    control={control}
                    name="username"
                    rules={{ required: "Username is required" }}
                    render={({ field: { onChange, value } }) => (
                        <View className="flex-row items-center w-full bg-primary rounded-lg border text-base p-4">
                            <FontAwesome name="user" size={20} color="black" className="mr-3" />
                            <TextInput
                                className="flex-1 text-black font-bold"
                                placeholder="Username"
                                placeholderTextColor="#000"
                                value={value}
                                onChangeText={onChange}
                                style={{ height: hp(6), paddingVertical: 0 }}
                                numberOfLines={1}
                            />
                        </View>
                    )}
                />
                {errors.username && (
                    <Text className="text-red-500 text-sm mt-1">{errors.username.message}</Text>
                )}
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
                                    placeholder="New Password"
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

            {/* Confirm Password Input */}
            <View className="w-full mb-3">
                <Controller
                    control={control}
                    name="confirmPassword"
                    rules={{
                        required: "Please confirm your password",
                        validate: value =>
                            value === password || "Passwords do not match",
                    }}
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
            <TouchableOpacity onPress={handleSubmit(onForgotPassword)} className="bg-black p-4 rounded-lg mt-6 min-w-full">
                <Text className="text-primary text-center font-bold text-xl">RESET PASSWORD</Text>
            </TouchableOpacity>

            {/* Back to Login Link */}
            <Text className="mt-4 text-black">
                Remember your password?{" "}
                <Link href="/login" className="text-dark font-bold">
                    Login
                </Link>
            </Text>
        </KeyboardAvoidingView>
    );
}
