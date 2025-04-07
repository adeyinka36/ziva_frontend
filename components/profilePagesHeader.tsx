import React, { useContext } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import CircularProgressBar from "./CircularProgressBar";
import { useAuth } from "@/contexts/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderContext } from "@/contexts/header";


const ProfilePageHeader = () =>{
   const router = useRouter();
   const {user} = useAuth();
   const percentage = (user.zivas / 1000) * 100
   const segments = useSegments();
   const { title } = useContext(HeaderContext);
  const goBack = () => {
        if(segments[1] == "selectPlayers"){
            router.replace('/topics');
            return;
        }
        if(segments.length > 1 ){
            router.back();
        }
  };

    return(
        <View className="flex-row justify-between p-2 items-center">
            <TouchableOpacity onPress={goBack}>
                <Ionicons name="arrow-back" size={wp(13)} color="000" />
            </TouchableOpacity>

            <View className="flex-row justify-center items-center"> 
                <Text className="text-black font-bold justify-center items-center align-middle text-lg"> {title.toUpperCase()} </Text>
            </View>
            
            <TouchableOpacity>
                <CircularProgressBar percentage={percentage} points={user.zivas} size={17}/>
            </TouchableOpacity>
       </View>
    )
}

export default ProfilePageHeader;