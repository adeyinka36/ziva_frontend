import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import CircularProgressBar from "./CircularProgressBar";

const ProfilePageHeader = () =>{
   const router = useRouter();

    return(
        <View className="flex-row justify-between p-2">
            <TouchableOpacity 
            onPress={() => router.push("/home")}
            >
                <Ionicons name="arrow-back" size={wp(15)} color="000" />
            </TouchableOpacity>
            <TouchableOpacity

            >
                <CircularProgressBar percentage={75} points={300} size={20}/>

            </TouchableOpacity>
       </View>
    )
}

export default ProfilePageHeader;