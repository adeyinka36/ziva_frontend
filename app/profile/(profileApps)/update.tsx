import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
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

export default function ProfileUpdate() {
    console.log("Profile Update loaded");
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
    const { updateProfile, currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const onUpdate = async (data: FormData) => {
        setLoading(true);
        setApiError(null);

        if (data.password !== data.confirmPassword) {
            setLoading(false);
            alert("Passwords do not match");
            return;
        }

        try {
            // Call updateProfile function provided by your auth context.
            const res = await updateProfile(
                data.firstName,
                data.lastName,
                data.email,
                data.username
            );
            setLoading(false);
            if (!res) {
                setApiError("Profile update failed. Please try again.");
            }
        } catch (error: unknown) {
            setApiError("An error occurred while updating your profile.");
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior="padding"
            className="flex-1 bg-primary"
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 24 }}
                keyboardShouldPersistTaps="handled"
            >

                <Text className="text-black text-2xl font-bold mb-4">Update Profile</Text>

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
                        defaultValue={currentUser?.firstName || ""}
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
                        defaultValue={currentUser?.lastName || ""}
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
                        defaultValue={currentUser?.username || ""}
                        rules={{ required: "Username is required" }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <>
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
                        defaultValue={currentUser?.email || ""}
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


                {/* Update Profile Button */}
                <TouchableOpacity
                    onPress={handleSubmit(onUpdate)}
                    className="bg-black p-4 rounded-lg mt-6 min-w-full"
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" size="small" className="min-w-full" />
                    ) : (
                        <Text className="text-primary text-center font-bold text-xl">UPDATE PROFILE</Text>
                    )}
                </TouchableOpacity>

                {/* Back Link */}
                <View className="mt-4">
                    {loading ? (
                        <Text className="text-black">Go back</Text>
                    ) : (
                        <Text className="mt-4 text-black">
                            <Link href="/home" className="text-dark font-bold">
                                Back to Home
                            </Link>
                        </Text>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
