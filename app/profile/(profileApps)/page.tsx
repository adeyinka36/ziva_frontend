import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useRouter } from "expo-router";

const ProfilePage: React.FC = () => {
   const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-primary relative p-3">
      <View className="flex-1 flex-column justify-between items-center p-4">
        <TouchableOpacity
          onPress={()=>{router.replace('/profile/stats')}}
          className="flex-1 bg-blue-700 m-2 rounded-lg p-4 justify-center items-center"
        >
          <Ionicons name="stats-chart-outline"  color="000" size={wp(20)}/>
          <Text className="mt-2 text-black font-semibold">Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity
        onPress={()=>router.push('/profile/update')}
          className="flex-1 bg-red m-2 rounded-lg p-4 justify-center items-center" 
        > 
          <Ionicons name="create-outline"  color="000" size={wp(20)}/>
          <Text className="mt-2 text-black font-semibold">Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
        onPress={()=>{router.replace('/profile/settings')}}
          className="flex-1 bg-blue-700 m-2 rounded-lg p-4 justify-center items-center "
        >
          <Ionicons name="settings-outline"  color="000" size={wp(20)}/>
          <Text className="mt-2 text-black font-semibold">Settings</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
       onPress={()=>console.log('pressed')}
      className="bg-secondary p-4 rounded-lg items-center w-50">
        <Text className="text-primary font-bold text-lg bg-red ">Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfilePage;
