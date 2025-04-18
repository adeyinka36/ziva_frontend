import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { BellIcon } from "react-native-heroicons/outline";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useAuth } from "@/contexts/auth";
import { Image } from "react-native";

const HomeSectionHeader: React.FC = () => {
  const router = useRouter();
  const {user, setUser} = useAuth();

  // Replace this with your actual notification state logic.
  const hasNewNotifications = true;


  const showImageModal = async () => {
    console.log('showing large version of image')
  }

  return (
    <SafeAreaView className="flex-row items-center justify-between bg-primary">
      <View style={{ flex: 1, padding: hp("2%") }} className="flex-row items-center justify-between bg-primary">
        {/* Notification Icon */}
        <TouchableOpacity
          onPress={() => router.push("/profile/notifications")}
          className="relative"
        >
          <BellIcon size={hp("6%")} color="black" />
          {hasNewNotifications && (
            <View className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full  bg-dark" />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/profile/page")} className="bg-primary">
           
            <Image
              style={{ height: hp(10), width: wp(20) }}
              resizeMode="contain"
              source={require("@/assets/images/ziva_logo.png")}
            />
        </TouchableOpacity>

        {/* Profile Section */}
        <TouchableOpacity
          className="flex-row items-center space-x-2"
          onPress={() => {
            showImageModal();
          }}
        >
          <Image source={{ uri: user.avatar }} className=" rounded-full"  style={{ height: hp(8), width: wp(15) }}/>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeSectionHeader;
