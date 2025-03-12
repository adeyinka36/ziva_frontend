import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { BellIcon } from "react-native-heroicons/outline";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

const HomeSectionHeader: React.FC = () => {
  const router = useRouter();
  // Replace this with your actual notification state logic.
  const hasNewNotifications = true;

  return (
    <SafeAreaView className="flex-row items-center justify-between bg-primary">
      <View style={{ flex: 1, padding: hp("2%") }} className="flex-row items-center justify-between bg-primary">
        {/* Notification Icon */}
        <TouchableOpacity
          onPress={() => router.replace("/profile/notifications")}
          className="relative"
        >
          <BellIcon size={hp("6%")} color="black" />
          {hasNewNotifications && (
            <View className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full  bg-dark" />
          )}
        </TouchableOpacity>

        {/* Profile Section */}
        <TouchableOpacity
          className="flex-row items-center space-x-2"
          onPress={() => {
            console.log("going to profile");
            router.replace("/profile/page");
          }}
        >
          <Text
            style={{ fontSize: hp("2.5%"), marginRight: wp(".5%") }}
            className="text-black font-semibold"
          >
            YinkaX86
          </Text>
          <View
            style={{ width: wp("12%"), height: wp("12%") }}
            className="bg-gray-300 rounded-full border-secondary justify-center items-center border-4"
          >
            <Text style={{ fontSize: hp("4%") }} className="text-secondary font-bold">
              Y
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeSectionHeader;
