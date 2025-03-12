import React from 'react';
import { SafeAreaView, FlatList, TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Notification {
  id: string;
  title: string;
  description: string;
}

const notifications: Notification[] = [
  { id: '1', title: 'New friend request', description: 'John Doe sent you a friend request.' },
  { id: '2', title: 'Post liked', description: 'Your post was liked by Jane.' },
  { id: '3', title: 'Comment received', description: 'Mike commented on your post.' },
  { id: '4', title: 'New message', description: 'You have a new message from Emily.' },
  { id: '5', title: 'Event reminder', description: 'Don’t forget the party tomorrow!' },
  { id: '6', title: 'Milestone reached', description: 'You reached 100 posts!' },
  { id: '7', title: 'Story update', description: 'Your story received new views.' },
  { id: '8', title: 'Achievement unlocked', description: 'You unlocked a new badge.' },
  { id: '9', title: 'System update', description: 'A new update is available.' },
  { id: '10', title: 'Promotion', description: 'Check out the new feature in our app.' },
];

const NotificationsPage: React.FC = () => {
  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity className="bg-white rounded-xl p-4 shadow mb-4 flex-row items-center">
      <Ionicons name="notifications-outline" size={28} color="#ffc75f" />
      <View className="ml-4 flex-1">
        <Text className="text-secondary text-lg font-bold">{item.title}</Text>
        <Text className="text-gray-600">{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary p-4">
      {/* Page Header */}
      <Text className="text-secondary text-3xl font-bold mb-6 text-center">
        Notifications
      </Text>
      {/* Scrollable list of notifications */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        className='p-2'
      />
    </SafeAreaView>
  );
};

export default NotificationsPage;
