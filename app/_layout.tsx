import "../global.css";
import React, { useEffect, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { AuthContextProvider, useAuth } from "@/contexts/auth";
import { GameContext } from "@/contexts/game"; 
import { getCurrentGame } from "@/functions/game";
import { GameType } from "@/types/game";

function MainLayout() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // If we don't yet know if user is authenticated, do nothing
    if (isAuthenticated === undefined) return;

    // The current path, e.g. "/login", "/home", etc.
    const currentRoute = "/" + segments.join("/");

    // Public routes for unauthenticated users only
    const publicRoutes = [
      "/login",
      "/register",
      "/requestPasswordToken",
      "/resetPassword",
    ];

    // If NOT authenticated but trying to access a protected route, redirect to /login
    if (!isAuthenticated && !publicRoutes.includes(currentRoute)) {
      router.replace("/login");
      return;
    }

    // If authenticated but on a public route, redirect to /home (or another protected route)
    if (isAuthenticated && publicRoutes.includes(currentRoute)) {
      router.replace("/home");
      return;
    }
  }, [isAuthenticated, segments, router]);

  // This layout just renders the nested routes
  return <Slot />;
}

export default function RootLayout() {
  // The game state is declared here, so it can be passed into GameContext.Provider
  const [currentGame, setCurrentGame] = useState<GameType | undefined>(undefined);

  // Load the current game from AsyncStorage once, on mount
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const game = await getCurrentGame();
        setCurrentGame(game);
      } catch (error) {
        console.error("Error retrieving game:", error);
      }
    };
    fetchGame();
  }, []);

  return (
    <AuthContextProvider>
      <GameContext.Provider value={{ currentGame, setCurrentGame }}>
        <MainLayout />
      </GameContext.Provider>
    </AuthContextProvider>
  );
}
