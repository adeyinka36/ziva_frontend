import React, { useState, useRef, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useAuth } from "@/contexts/auth";
import { updateUserDetails } from "@/functions/updateUser";
import { userType } from "@/types/userType";
import { handleImageSelectionAndUpload } from "@/components/imageUploader";
import { Image } from "react-native";
import { HeaderContext } from "@/contexts/header";
import { GameContext } from "@/contexts/game";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Toast from "react-native-toast-message";

type FormData = {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  currentPassword: string;
  newPassword?: string;
  confirmNewPassword?: string;
};

export default function ProfileUpdate() {
  const { control, handleSubmit, watch } = useForm<FormData>();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const { setTitle } = useContext(HeaderContext);
  const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).+$/;

  useEffect(() => {
    setTitle("UPDATE");
  }, []);

  const onUpdate = async (data: FormData) => {
    setLoading(true);
    setApiError(null);
    setSuccessMessage(null);

    // Always require current password
    if (!data.currentPassword) {
      setApiError("Current password is required.");
      setLoading(false);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    // Check that at least one optional field is provided
    if (
      !data.firstName &&
      !data.lastName &&
      !data.username &&
      !data.email &&
      !data.newPassword
    ) {
      setApiError("Please update at least one field besides the current password.");
      Toast.show({
        text1: "Please update at least one field besides the current password.",
        type: "error",
      });
      setLoading(false);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    // Validate new password fields if provided
    if (data.newPassword || data.confirmNewPassword) {
      if (!data.newPassword || !data.confirmNewPassword) {
        setApiError("Both new password and confirm new password are required.");
        setLoading(false);
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        return;
      }
      if (data.newPassword !== data.confirmNewPassword) {
        setApiError("New password and confirm new password must match.");
        Toast.show({
          text1: "New password and confirm new password must match.",
          type: "error",
        });
        setLoading(false);
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        return;
      }
      if (!passwordPattern.test(data.newPassword)) {
        setApiError(
          "New password must be alphanumeric and include at least one number and one special character."
        );
        Toast.show({
          text1: "New password must be alphanumeric and include at least one number and one special character.",
          type: "error",
        });
        setLoading(false);
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        return;
      }
    }

    try {
      const res = await updateUserDetails({
        userId: user.id,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        username: data.username,
      });
      setLoading(false);
      if (!res) {
        setApiError("Profile update failed. Please try again.");
        Toast.show({
          text1: "Profile update failed. Please try again.",
          type: "error",
        });
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      } else {
        setUser((prev: userType) => {
          const updatedUser = { ...prev };
          if (data.firstName) {
            updatedUser.first_name = data.firstName;
          }
          if (data.lastName) {
            updatedUser.last_name = data.lastName;
          }
          if (data.email) {
            updatedUser.email = data.email;
          }
          if (data.username) {
            updatedUser.username = data.username;
          }
          return updatedUser;
        });
        setSuccessMessage("Profile updated successfully.");
        Toast.show({
          text1: "Profile updated successfully.",
          type: "success",
        });
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }
    } catch (error: any) {
      setApiError("An error occurred while updating your profile.");
      Toast.show({
        text1: "An error occurred while updating your profile.",
        type: "error",
      });
      setLoading(false);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-primary">
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {apiError && (
          <Text className="text-red-500 text-xl mb-2">{apiError}</Text>
        )}
        {successMessage && (
          <Text className="text-green-500 text-xl mb-2">{successMessage}</Text>
        )}

       <TouchableOpacity onPress={() => handleImageSelectionAndUpload(user.id)}>
        <Image source={{ uri: user.avatar }} className=" rounded-full" style={{width: wp(50), height: wp(50)}}/>
       </TouchableOpacity>

        {/* Current Password (Required) */}
        <View className="w-full mb-3">
          <Controller
            control={control}
            name="currentPassword"
            defaultValue=""
            rules={{ required: "Current password is required" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Text className="text-black text-xs mt-1">
                  This current password always required to update your profile.
                </Text>
                <View className="flex-row items-center w-full bg-primary rounded-lg border p-4">
                  <FontAwesome name="lock" size={30} color="black" className="mr-3" />
                  <TextInput
                    className="flex-1 text-black font-bold"
                    placeholder="Current Password (required)"
                    placeholderTextColor="#000"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    style={{ height: hp(6), paddingVertical: 0 }}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {error && (
                  <Text className="text-red-500 text-sm mt-1">{error.message}</Text>
                )}
              </>
            )}
          />
        </View>

        {/* Optional Fields */}
        <View className="w-full mb-3">
          <Controller
            control={control}
            name="firstName"
            defaultValue={user.first_name || ""}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <View className="flex-row items-center w-full bg-primary rounded-lg border p-4">
                  <FontAwesome name="user" size={20} color="black" className="mr-3" />
                  <TextInput
                    className="flex-1 text-black font-bold"
                    placeholder="First Name (optional)"
                    placeholderTextColor="#000"
                    value={value}
                    onChangeText={onChange}
                    style={{ height: hp(6), paddingVertical: 0 }}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {error && (
                  <Text className="text-red-500 text-sm mt-1">{error.message}</Text>
                )}
              </>
            )}
          />
        </View>

        <View className="w-full mb-3">
          <Controller
            control={control}
            name="lastName"
            defaultValue={user.last_name || ""}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <View className="flex-row items-center w-full bg-primary rounded-lg border p-4">
                  <FontAwesome name="user" size={20} color="black" className="mr-3" />
                  <TextInput
                    className="flex-1 text-black font-bold"
                    placeholder="Last Name (optional)"
                    placeholderTextColor="#000"
                    value={value}
                    onChangeText={onChange}
                    style={{ height: hp(6), paddingVertical: 0 }}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {error && (
                  <Text className="text-red-500 text-sm mt-1">{error.message}</Text>
                )}
              </>
            )}
          />
        </View>

        <View className="w-full mb-3">
          <Controller
            control={control}
            name="username"
            defaultValue={user.username || ""}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <View className="flex-row items-center w-full bg-primary rounded-lg border p-4">
                  <FontAwesome name="user" size={20} color="black" className="mr-3" />
                  <TextInput
                    className="flex-1 text-black font-bold"
                    placeholder="Username (optional)"
                    placeholderTextColor="#000"
                    value={value}
                    onChangeText={onChange}
                    style={{ height: hp(6), paddingVertical: 0 }}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {error && (
                  <Text className="text-red-500 text-sm mt-1">{error.message}</Text>
                )}
              </>
            )}
          />
        </View>

        <View className="w-full mb-3">
          <Controller
            control={control}
            name="email"
            defaultValue={user.email || ""}
            rules={{
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please enter a valid email address",
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <View className="flex-row items-center w-full bg-primary rounded-lg border p-4">
                  <FontAwesome name="envelope" size={20} color="black" className="mr-3" />
                  <TextInput
                    className="flex-1 text-black font-bold"
                    placeholder="Email address (optional)"
                    placeholderTextColor="#000"
                    value={value}
                    onChangeText={onChange}
                    style={{ height: hp(6), paddingVertical: 0 }}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {error && (
                  <Text className="text-red-500 text-sm mt-1">{error.message}</Text>
                )}
              </>
            )}
          />
        </View>

        {/* New Password */}
        <View className="w-full mb-3">
          <Controller
            control={control}
            name="newPassword"
            defaultValue=""
            rules={{
              pattern: {
                value: passwordPattern,
                message:
                  "Password must be alphanumeric with at least one number and one special character",
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <View className="flex-row items-center w-full bg-primary rounded-lg border p-4">
                  <FontAwesome name="lock" size={30} color="black" className="mr-3" />
                  <TextInput
                    className="flex-1 text-black font-bold"
                    placeholder="New Password (optional)"
                    placeholderTextColor="#000"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    style={{ height: hp(6), paddingVertical: 0 }}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {error && (
                  <Text className="text-red-500 text-sm mt-1">{error.message}</Text>
                )}
              </>
            )}
          />
        </View>

        {/* Confirm New Password */}
        <View className="w-full mb-3">
          <Controller
            control={control}
            name="confirmNewPassword"
            defaultValue=""
            rules={{
              validate: (value) =>
                value === watch("newPassword") || "New passwords do not match",
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <View className="flex-row items-center w-full bg-primary rounded-lg border p-4">
                  <FontAwesome name="lock" size={30} color="black" className="mr-3" />
                  <TextInput
                    className="flex-1 text-black font-bold"
                    placeholder="Confirm New Password (optional)"
                    placeholderTextColor="#000"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    style={{ height: hp(6), paddingVertical: 0 }}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {error && (
                  <Text className="text-red-500 text-sm mt-1">{error.message}</Text>
                )}
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
            <Text className="text-primary text-center font-bold text-xl">
              UPDATE PROFILE
            </Text>
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
