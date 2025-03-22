import React, {useEffect, useState, useContext} from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { GameContext } from "@/contexts/game";

// Example data. Replace with real data from props/context if needed.
const mockTopic = "General Knowledge";
const mockPlayers = [
  { id: "1", username: "Alice" },
  { id: "2", username: "Bob" },
  { id: "3", username: "Carol" },
  { id: "4", username: "Dave" },
  { id: "5", username: "Eve" },
  { id: "6", username: "Frank" },
  { id: "7", username: "Gina" },
  { id: "8", username: "Helen" },
  { id: "9", username: "Ivan" },
  { id: "10", username: "Judy" },
];

export default function ConfirmGame() {
  const topic = mockTopic; // or from context
  const players = mockPlayers; // or from context
  const {currentGame, setCurrentGame} = useContext(GameContext);
  
 console.log('--->',currentGame)
  // Start the game
  const handleStartGame = () => {
    console.log("Starting the game!");
    // do any navigation or logic here
  };

  // Render each player in a 2-column grid item
  const renderPlayer = ({ item }: { item: typeof players[0] }) => (
    <View className="w-1/2 p-2">
      <View className="bg-[#0047AB] rounded-md p-3 items-center justify-center">
        <Text className="text-white font-bold text-base">{item.username}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="p-4 flex-1">
        {/* Topic Container */}
        <View className="bg-yellow rounded-full p-4 mb-4">
          <Text className="text-[#0047AB] text-[20px] font-bold text-center">
            {currentGame?.topic?.title}
          </Text>
        </View>

        {/* Scrollable container of Players (in rows of 2) */}
        <FlatList
          data={currentGame?.players ? currentGame.players : []}
          keyExtractor={(item) => item.id}
          renderItem={renderPlayer}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp(10), flex: 1 }}
        />

        {/* Floating or pinned Start Game container */}
        <View
          style={{
            position: "absolute",
            bottom: wp(5),
            left: wp(5),
            right: wp(5),
            borderRadius: 16,
          }}
          className="bg-[#0047AB] p-4"
        >
          <TouchableOpacity onPress={handleStartGame}>
            <Text className="text-center text-white font-bold text-lg">
              Start Game
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
