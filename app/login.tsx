import React from "react";
import { View, Text, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function LoginScreen() {
    const { control, handleSubmit, formState: { errors } } = useForm<{ email: string; password: string }>();

    const onLogin = (data: { email: string; password: string }) => {
        if (!data.email || !data.password) {
            alert("Please fill in all fields");
            return;
        }
        // Proceed with login logic
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-primary justify-center items-center p-6"
        >
            {/* Illustration */}
            <View className='items-center mb-8'>
                <Image
                    style={{ height: hp(25) }}
                    resizeMode='contain'
                    source={require('../assets/images/ziva_logo.webp')}
                />
            </View>

            {/* Email Input */}
            <View className="w-full">
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
                            {error && <Text className="text-red-500 text-xs mt-1">{error.message}</Text>}
                        </>
                    )}
                />
            </View>

            {/* Password Input */}
            <View className="w-full mt-3">
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
                            {error && <Text className="text-red-500 text-xs mt-1">{error.message}</Text>}
                        </>
                    )}
                />
            </View>

            {/* Forgot Password Link */}
            <View className="flex-row justify-end mt-2 min-w-full">
                <Link href="/ForgotPassword" className="text-dark font-bold">
                    Forgot Password?
                </Link>
            </View>

            {/* Login Button */}
            <TouchableOpacity onPress={handleSubmit(onLogin)} className="bg-black p-4 rounded-lg mt-6">
                <Text className="text-primary text-center font-bold text-xl min-w-full">LOGIN</Text>
            </TouchableOpacity>

            {/* Register Link */}
            <Text className="mt-4 text-black">
                Don't have an account?{" "}
                <Link href="/register" className="text-dark font-bold">
                    Register
                </Link>
            </Text>
        </KeyboardAvoidingView>
    );
}
