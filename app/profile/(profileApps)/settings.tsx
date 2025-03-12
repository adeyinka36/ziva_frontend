import React, { useState } from 'react';
import { SafeAreaView, View, Text, Switch, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SettingsPage: React.FC = () => {
  // State for toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleNotifications = () => {
    setNotificationsEnabled(prev => !prev);
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  const handleContactPress = () => {
    Linking.openURL('mailto:ziva@gmail.com');
  };

  return (
    <SafeAreaView className="flex-1 bg-primary p-4">
      {/* Page Header */}
      <Text className="text-secondary text-3xl font-bold mb-6 text-center">
        Settings
      </Text>
      {/* Settings Card */}
      <View className="bg-primary rounded-xl p-6 shadow-lg space-y-6 flex-1 justify-start border-primary shadow-primary">
        {/* Notifications Option */}
        <View className="flex-row items-center justify-between pb-4">
          <View className="flex-row items-center space-x-2">
            <Ionicons name="notifications-outline" size={24} color="#ffc75f" />
            <Text className="text-secondary text-lg font-medium">
              Notifications
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            thumbColor={notificationsEnabled ? "#ffc75f" : "#ccc"}
            trackColor={{ false: "#ddd", true: "#0000FF" }}
          />
        </View>
        {/* Sound Option */}
        <View className="flex-row items-center justify-between pb-4">
          <View className="flex-row items-center space-x-2">
            <Ionicons name="volume-high-outline" size={24} color="#ffc75f" />
            <Text className="text-secondary text-lg font-medium">
              Sound
            </Text>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={toggleSound}
            thumbColor={soundEnabled ? "#ffc75f" : "#ccc"}
            trackColor={{ false: "#ddd", true: "#0000FF" }}
          />
        </View>
        {/* Contact Us Button */}
        <TouchableOpacity
          onPress={handleContactPress}
          className="bg-secondary rounded-full py-3 px-4 flex-row items-center justify-center self-center"
        >
          <Ionicons name="mail-outline" size={24} color="white" />
          <Text className="text-light text-lg font-medium ml-2">
            Contact Us: ziva@gmail.com
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SettingsPage;
