import React, { useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  RocketLaunchIcon,
  PencilSquareIcon,
  UserGroupIcon,
} from "react-native-heroicons/outline";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/auth";


export default function Home() {
  const router = useRouter();
  const {user} = useAuth();
  const handlePlay = () => {
    router.push("/topics");
  };

  const handleCreateCustomQuiz = () => {
    router.push("/createCustomQuiz");
    // e.g. navigation.navigate("CreateQuiz");
  };

  const handleFriends = () => {
    router.push("/profile/(profileApps)/friends")
    // e.g. show share sheet or link to invite flow
  };


  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView contentContainerStyle={{ paddingVertical: wp(8), alignItems: "center", justifyContent: "center", flex: 1 }} className="px-4">

        {/* Button group container */}
        <View className="w-full items-center">
          {/* PLAY Button */}
          <TouchableOpacity
            onPress={handlePlay}
            className="flex-row items-center justify-center w-[80%] bg-[yellow] rounded-full py-4 mb-6"
            activeOpacity={0.8}
          >
            <RocketLaunchIcon size={wp(6)} color="#000000" />
            <Text className="ml-2 text-black text-lg font-bold">Play</Text>
          </TouchableOpacity>

          {/* CREATE CUSTOM QUIZ Button */}
          <TouchableOpacity
            onPress={handleCreateCustomQuiz}
            className="flex-row items-center justify-center w-[80%] bg-[yellow] rounded-full py-4 mb-6"
            activeOpacity={0.8}
          >
            <PencilSquareIcon size={wp(6)} color="#000" />
            <Text className="ml-2 text-black text-lg font-bold">Create Custom Quiz</Text>
          </TouchableOpacity>

          {/* INVITE FRIEND Button */}
          <TouchableOpacity
            onPress={handleFriends}
            className="flex-row items-center justify-center w-[80%] bg-yellow rounded-full py-4"
            activeOpacity={0.8}
          >
            <UserGroupIcon size={wp(6)} color="#000" />
            <Text className="ml-2 text-black text-lg font-bold">Friends</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
