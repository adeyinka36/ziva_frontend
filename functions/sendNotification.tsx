import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { useContext } from "react";
import { useAuth } from "@/contexts/auth";
import { storePushToken } from "./updateUser";

export const scheduleNotification = () => {
    Notifications.scheduleNotificationAsync({
        content: {
            title: "Ziva Winning Notification!",
            body: "Claim a  £10 voucher!",
            data:  {
                provider: "Yinka"
            }
        },
        trigger: null
          
    })
}

export const setHandler = () =>  {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
}

export async function registerForPushNotificationsAsync() {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
  
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }

  export const getPushToken = async (userId: string) => {
    return await Notifications.getExpoPushTokenAsync()
            .then((respoonseData)=>{
               storePushToken(userId, respoonseData.data)
            }).catch((error) =>{
              console.error('erro}r storing push token in db--', error)
            })
  }


  export const notificationListener = () => {
    return Notifications.addNotificationReceivedListener((notification)=>{
        console.log('notification was recieved')
    })
  }
  export const notificationResponseListener = () => {
    return Notifications.addNotificationResponseReceivedListener((response)=>{
        console.log('notification was response was -0-- recieved')
    })
  }
