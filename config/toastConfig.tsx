import React from "react";
import { View, Button } from "react-native";
import Toast, { BaseToast, ErrorToast, InfoToast, ToastConfig } from "react-native-toast-message";



export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "green", // The left border color
        backgroundColor: "#e6ffe6",
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "green",
      }}
      text2Style={{
        fontSize: 14,
        color: "green",
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "red",
        backgroundColor: "#ffe6e6",
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "red",
      }}
      text2Style={{
        fontSize: 14,
        color: "red",
      }}
    />
  ),
  info: (props) => (
    <InfoToast
      {...props}
      style={{
        borderLeftColor: "#FFFF00",
        backgroundColor: "#FFFF00",
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
      }}
      text2Style={{ 
        fontSize: 14,
        color: "black",
      }}
    />
  ),
};
