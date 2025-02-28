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

export default function RegisterScreen() {
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>();

    const onRegister = (data: FormData) => {
        if (data.password !== data.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        // Handle registration logic here
        console.log("Registration data", data);
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

            {/* Password Input */}
            <View className="w-full mb-3">
                <Controller
                    control={control}
                    name="password"
                    rules={{
                        required: "Password is required",
                        pattern: {
                            // Regex: Must contain at least one number, one special character, and one letter.
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

            {/* Register Button */}
            <TouchableOpacity onPress={handleSubmit(onRegister)} className="bg-black p-4 rounded-lg mt-6 min-w-full">
                <Text className="text-primary text-center font-bold text-xl">REGISTER</Text>
            </TouchableOpacity>

            {/* Login Link */}
            <Text className="mt-4 text-black">
                Already have an account?{" "}
                <Link href="/login" className="text-dark font-bold">
                    Login
                </Link>
            </Text>
        </KeyboardAvoidingView>
    );
}
