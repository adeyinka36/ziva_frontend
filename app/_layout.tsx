import "../global.css";
import React, { useEffect, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { AuthContextProvider, useAuth } from "@/contexts/auth";
import { GameContext } from "@/contexts/game";
import { getCurrentGame } from "@/functions/game";
import { GameType } from "@/types/game";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/config/toastConfig";
import { HeaderContext } from "@/contexts/header";
import NotificationManager from "@/components/NotificationManager";
import {NotificationProvider} from "@/contexts/NotificationContext";


function MainLayout() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === undefined) return;

    const currentRoute = "/" + segments.join("/");

    const publicRoutes = [
      "/login",
      "/register",
      "/requestPasswordToken",
      "/resetPassword",
    ];

    if (!isAuthenticated && !publicRoutes.includes(currentRoute)) {
      router.replace("/login");
      return;
    }

    if (isAuthenticated && publicRoutes.includes(currentRoute)) {
      router.replace("/home");
      return;
    }
  }, [isAuthenticated, segments, router]);

  return <Slot />;
}

export default function RootLayout() {
  const [currentGame, setCurrentGame] = useState<GameType | undefined>(undefined);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setCurrentGame(undefined); // or load from storage/api
      } catch (error) {
        console.error("Error retrieving game:", error);
      }
    };

    fetchGame();
  }, []);



  return (
    <AuthContextProvider>
      <GameContext.Provider value={{ currentGame, setCurrentGame }}>
        <NotificationProvider>
        <HeaderContext.Provider value={{ title, setTitle }}>
          <MainLayout />
          <NotificationManager />
          <Toast config={toastConfig} />
        </HeaderContext.Provider>
        </NotificationProvider>
      </GameContext.Provider>
    </AuthContextProvider>
  );
}
