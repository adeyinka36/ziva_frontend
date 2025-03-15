import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import CircularProgressBar from "./CircularProgressBar";
import { useAuth } from "@/contexts/auth";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfilePageHeader = () =>{
   const router = useRouter();
   const {user} = useAuth();
   const percentage = (user.zivas / 1000) * 100
   

    return(
        <View className="flex-row justify-between p-2">
            <TouchableOpacity 
            onPress={() => router.push("/home")}
            >
                <Ionicons name="arrow-back" size={wp(15)} color="000" />
            </TouchableOpacity>
            <TouchableOpacity

            >
                <CircularProgressBar percentage={percentage} points={user.zivas} size={20}/>

            </TouchableOpacity>
       </View>
    )
}

export default ProfilePageHeader;