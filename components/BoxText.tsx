import React from "react";
import { View, Text } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { SparklesIcon } from "react-native-heroicons/outline";

interface BoxTextProps {
  text: string;
  color?: string;
  size?: number; // in percentage of screen width
  sparkleColor?: string;
  backgroundColor?: string
}

export default function BoxText({
  text = "",
  color = "#000000",
  size = 5, // size in % of screen width
  sparkleColor = "#000000",
  backgroundColor = "bg-yellow"
}: BoxTextProps) {
  return (
    <View className={` flex-row items-center ${backgroundColor} rounded-lg py-2 px-3 mb-4 `}>
      <SparklesIcon size={wp(size)} color={sparkleColor} />
      <Text
        className="ml-2 font-semibold"
        style={{
          color: color,
          fontSize: wp(size), // responsive font size!
        }}
      >
        {text}
      </Text>
    </View>
  );
}
