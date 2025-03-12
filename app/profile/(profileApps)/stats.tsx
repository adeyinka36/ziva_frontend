import React from 'react';
import { SafeAreaView, View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

const StatsPage: React.FC = () => {
  // Replace these with your actual data (from Redux, API, etc.)
  const gamesPlayed = 50;
  const wins = 30;
  const losses = 20;
  const totalPoints = 1500;
  const pointsRedeemableDate = "2025-08-31"; // YYYY-MM-DD

  // Format the redeemable date (you can adjust this as needed)
  const redeemableDateFormatted = new Date(pointsRedeemableDate).toLocaleDateString();

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        {/* Page header */}
        <Text className="text-secondary text-3xl font-bold mb-6 text-center">
          Stats
        </Text>
        <View className="space-y-6 flex-1 justify-between">
          {/* Games Stats Card */}
          <View className=" bg-white rounded-xl p-6 shadow-lg">
            {/* Games Played */}
            <View className="flex-row items-center justify-between border-b border-gray-200 pb-4 mb-4">
              <View className="flex-row items-center space-x-2">
                <Ionicons name="game-controller-outline" size={wp(8)} />
                <Text className="text-secondary text-lg font-medium">
                  Games Played
                </Text>
              </View>
              <Text className="text-secondary text-lg font-bold">
                {gamesPlayed}
              </Text>
            </View>
            {/* Wins */}
            <View className="flex-row items-center justify-between border-b border-gray-200 pb-4 mb-4">
              <View className="flex-row items-center space-x-2">
                <Ionicons name="trophy-outline" size={wp(8)} />
                <Text className="text-secondary text-lg font-medium">
                  Wins
                </Text>
              </View>
              <Text className="text-secondary text-lg font-bold">
                {wins}
              </Text>
            </View>
            {/* Losses */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center space-x-2">
                <Ionicons name="close-circle-outline" size={wp(8)} />
                <Text className="text-secondary text-lg font-medium">
                  Losses
                </Text>
              </View>
              <Text className="text-secondary text-lg font-bold">
                {losses}
              </Text>
            </View>
          </View>
          {/* Points Info Card */}
          <View className="bg-white rounded-xl p-6 shadow-lg">
            {/* Total Points */}
            <View className="flex-row items-center justify-between border-b border-gray-200 pb-4 mb-4">
              <View className="flex-row items-center space-x-2">
                <Ionicons name="star-outline" size={wp(8)} />
                <Text className="text-secondary text-lg font-medium">
                  Total Points
                </Text>
              </View>
              <Text className="text-secondary text-lg font-bold">
                {totalPoints}
              </Text>
            </View>
            {/* Points Redeemable Date */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center space-x-2">
                <Ionicons name="calendar-outline" size={24}  />
                <Text className="text-secondary text-lg font-medium">
                  Redeemable Date
                </Text>
              </View>
              <Text className="text-secondary text-lg font-bold">
                {redeemableDateFormatted}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StatsPage;
