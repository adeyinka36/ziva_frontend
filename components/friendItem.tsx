import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { PlayerType } from "@/functions/getPlayers"; // or your player type

interface FriendItemProps {
  item: PlayerType;
  segment: "friends" | "sent" | "received";

  // Optional callbacks for button actions
  onAccept?: (playerId: string) => void;
  onUnfriend?: (playerId: string) => void;
  onAdd?: (playerId: string) => void;
}

/**
 * A single friend item row: circular avatar + username + segment-based action(s).
 */
const FriendItem: React.FC<FriendItemProps> = ({
  item,
  segment,
  onAccept,
  onUnfriend,
  onAdd,
}) => {
  return (
    <View className="flex-row items-center bg-[#dfe0df] p-3 m-4 rounded-md justify-between">
      {/* Left side: Avatar + Username */}
      <View className="flex-row items-center">
        {/* Circle Avatar (adjust item.avatar accordingly) */}
        <View style={{ width: wp(12), height: wp(12), borderRadius: wp(6), overflow: "hidden" }}>
          <Image
            source={{ uri: item.avatar || "https://via.placeholder.com/150" }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </View>
        {/* Username */}
        <Text className="ml-3 text-[#4e2b00] font-bold">{item.username}</Text>
      </View>

      {/* Right side: Action button(s) depending on segment */}
      <View className="flex-row items-center">
        {segment === "sent" && (
          <TouchableOpacity
            onPress={() => onUnfriend?.(item.id)}
            className="bg-[#4e2b00] rounded-full px-3 py-1 ml-2"
          >
            <Text className="text-[#ffffff] text-sm">Delete</Text>
          </TouchableOpacity>
        )}

        {segment === "received" && (
          <View className="flex-row">
            {/* Accept */}
            <TouchableOpacity
              onPress={() => onAccept?.(item.id)}
              className="bg-[#007663] rounded-full px-3 py-1 ml-2"
            >
              <Text className="text-[#ffffff] text-sm">Accept</Text>
            </TouchableOpacity>

            {/* Decline */}
            <TouchableOpacity
              onPress={() => onUnfriend?.(item.id)}
              className="bg-[#ff0000] rounded-full px-3 py-1 ml-2"
            >
              <Text className="text-[#ffffff] text-sm">Decline</Text>
            </TouchableOpacity>
          </View>
        )}

        {segment === "friends" && (
        <TouchableOpacity
            onPress={() => {
            if (item.is_friend) {
              onUnfriend?.(item.id);
            } else {
                onAdd?.(item.id);
            }
            }}
            className={`${item.is_friend? 'bg-[#FF0000]' : 'bg-[yellow]'} rounded-full px-3 py-1 ml-2`}
        >
            <Text className={`${ item.is_friend ?'text-black' :'text-[#000000]'} text-sm font-bold`}>
            {item.is_friend ? "REMOVE" : "ADD"}
            </Text>
        </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FriendItem;
