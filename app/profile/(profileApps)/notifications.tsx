import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getNotifications } from '@/functions/getNotification';
import { useAuth } from '@/contexts/auth';
import { Notification, NotificationResponse } from '@/functions/getNotification';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [nextPage, setNextPage] = useState<string | null>(null);

  const { user } = useAuth();


  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await getNotifications(user.id);
        if (response) {
          setNotifications(response.data);
          setNextPage(response._links.next);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user.id]);

  const fetchMoreNotifications = async () => {
    if (!nextPage || loadingMore) return;

    setLoadingMore(true);
    try {
      const response = await getNotifications(user.id, nextPage); 
      if (response) {
        setNotifications((prev) => [...prev, ...response.data]); 
        setNextPage(response._links.next); 
      }
    } catch (error) {
      console.error("Error loading more notifications:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity className="bg-white rounded-xl p-4 shadow mb-4 flex-row items-center">
      <Ionicons name="notifications-outline" size={28} color="#ffc75f" />
      <View className="ml-4 flex-1">
        <Text className="text-secondary text-lg font-bold">{item.title}</Text>
        <Text className="text-gray-600">{item.message}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary p-4">
      {/* Page Header */}


      {loading ? (
        <ActivityIndicator size="large" color="#ffc75f" />
      ) : (notifications.length === 0 || !notifications) ? (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="notifications-off-outline" size={50} color="gray" />
          <Text className="text-gray-600 text-lg mt-2">No notifications yet.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          className="p-2"
          onEndReached={fetchMoreNotifications}
          onEndReachedThreshold={0.2} 
          ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#ffc75f" /> : null}
        />
      )}
    </SafeAreaView>
  );
};

export default NotificationsPage;
