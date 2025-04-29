import React, { useEffect, useContext } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { storePushToken } from "@/functions/updateUser";
import { useAuth } from "@/contexts/auth";
import { useNavigation } from '@react-navigation/native';
import { getItemFromAsyncStorage, storeItemInAsyncStorage} from "@/functions/asyncStorage";
import { useNotification } from "@/contexts/NotificationContext";
import { GameContext } from "@/contexts/game";



export const getPushToken = async (userId: string) => {
    return await Notifications.getExpoPushTokenAsync()
            .then((respoonseData)=>{
               storePushToken(userId, respoonseData.data)
            }).catch((error) =>{
              console.error('erro}r storing push token in db--', error)
            })
  }

export default function NotificationManager() {
  const { user } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();
  const {setNotificationData} = useNotification();
  const {setCurrentGame} = useContext(GameContext);
  const pathname = usePathname();

  // Register for push notifications
  useEffect(() => {
    const register = async () => {
      if (!user?.id) return;

      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }

        const tokenRes = await Notifications.getExpoPushTokenAsync();
        await storePushToken(user.id, tokenRes.data);
      } else {
        alert("Must use physical device for Push Notifications");
      }

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    };

    register();
  }, [user]);

  // Set how notifications behave when received
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  }, []);

  useEffect(() => {
    const receivedSubscription = Notifications.addNotificationReceivedListener(notification => {
      const data = notification.request.content.data;
      setTimeout(() =>{
        if(data.type == 'game_invite_response') {
          setCurrentGame({...data.game_data})
        }
      }, 1000)
    });
  
    return () => {
      receivedSubscription.remove();
    };
  }, [setNotificationData]);

  // todo: make this more reliable
  useEffect(() => { 

    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if(data.type === 'game_invite') {
        setTimeout(() => {
          const setGameAndRedirect = async () => {
            setCurrentGame({...data.currentGame});
            router.push(data.targetScreen);
          };
          setGameAndRedirect();
        }, 1000);
      }
      setNotificationData({...data});
       
      const handleNotification = async () => {

        const data = response.notification.request.content.data;
        const gameId = data?.gameId;

        
        if(gameId) {
          await storeItemInAsyncStorage(gameId, 'gameId');
        }
      
      }

      handleNotification();
      
    });
  
    return () => responseSub.remove();
  }, [setNotificationData]);

  return null;
}
