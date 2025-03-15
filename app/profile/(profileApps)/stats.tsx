import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useAuth } from '@/contexts/auth';
import { getStats, Stats } from '@/functions/getStats';

const StatsPage: React.FC = () => {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState<Stats | undefined>(undefined);

  useEffect(() => {
    const loadStats = async () => {
      const res = await getStats(user.id);
      setStatistics(res?.data);
    };

    loadStats();
  }, [user.id]);

  // Calculate progress percentage: user's zivas out of 1000, capped at 100%
  const progressPercentage = statistics ? Math.min((statistics.zivas / 1000) * 100, 100) : 0;

  // Parse redeemable date and compare (ignoring time portion)
  const redeemableDate = statistics?.zivas_redeemable_date ? new Date(statistics.zivas_redeemable_date) : null;
  const today = new Date();
  if (redeemableDate) {
    redeemableDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
  }
  const redeemableDateFormatted = statistics?.zivas_redeemable_date
    ? new Date(statistics.zivas_redeemable_date).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  const isRedeemable = redeemableDate ? (redeemableDate <= today ) : false;

  const handleGetGiftCard = () => {
    // Trigger your gift card conversion logic
    alert("Gift card redemption initiated!");
  };

  return (
  <SafeAreaView className="flex-1 bg-primary">
    {/* Main container: scrollable stats and fixed bottom gift card section */}
    <View className="flex-1 p-4">
      {/* Header */}


      {/* Scrollable Games Stats Card */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-xl p-6 shadow-lg mb-4">
          {/* Games Played */}
          <View className="flex-row items-center justify-between border-b border-gray-200 pb-4 mb-4">
            <View className="flex-row items-center space-x-2">
              <Ionicons name="game-controller-outline" size={wp(8)} color="#ffc75f" />
              <Text className="text-secondary text-lg font-medium">
                Games Played
              </Text>
            </View>
            <Text className="text-secondary text-lg font-bold">
              {statistics?.games_played || 0}
            </Text>
          </View>
          {/* Wins */}
          <View className="flex-row items-center justify-between border-b border-gray-200 pb-4 mb-4">
            <View className="flex-row items-center space-x-2">
              <Ionicons name="trophy-outline" size={wp(8)} color="#ffc75f" />
              <Text className="text-secondary text-lg font-medium">
                Wins
              </Text>
            </View>
            <Text className="text-secondary text-lg font-bold">
              {statistics?.games_won || 0}
            </Text>
          </View>
          {/* Losses */}
          <View className="flex-row items-center justify-between border-b border-gray-200 pb-4 mb-4">
            <View className="flex-row items-center space-x-2">
              <Ionicons name="close-circle-outline" size={wp(8)} color="#ffc75f" />
              <Text className="text-secondary text-lg font-medium">
                Losses
              </Text>
            </View>
            <Text className="text-secondary text-lg font-bold">
              {statistics?.games_lost || 0}
            </Text>
          </View>
          {/* Draws */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-2">
              <Ionicons name="scale-outline" size={wp(8)} color="#ffc75f" />
              <Text className="text-secondary text-lg font-medium">
                Draws
              </Text>
            </View>
            <Text className="text-secondary text-lg font-bold">
              {statistics?.games_drawn || 0}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom: Gift Card Conversion Card */}
      <View>
        <View className="bg-white rounded-xl p-6 shadow-lg">
          <Text className="text-secondary text-2xl font-bold mb-4 text-center">
            Gift Card Conversion
          </Text>
          {/* Progress Bar Container */}
          <View className="w-full bg-light mb-2">
            <View className="w-full bg-gray-300 h-4 rounded-full">
              <View style={{ width: `${progressPercentage}%` }} className="bg-secondary h-4 rounded-full" />
            </View>
          </View>
          <Text className="text-secondary text-center font-medium mb-4">
            {statistics ? `${statistics.zivas} / 1000 Zivas` : 'Loading...'}
          </Text>
          {isRedeemable ? (
            <TouchableOpacity
              onPress={handleGetGiftCard}
              className="bg-secondary py-3 px-6 rounded-full"
            >
              <Text className="text-primary font-bold text-center">
                Get Gift Card
              </Text>
            </TouchableOpacity>
          ) : (redeemableDateFormatted && ( 
            <Text className="text-secondary text-center font-medium">
              Gift card redeemable on {redeemableDateFormatted}
            </Text>)
          )}
        </View>
      </View>
    </View>
  </SafeAreaView>
  );
};

export default StatsPage;
