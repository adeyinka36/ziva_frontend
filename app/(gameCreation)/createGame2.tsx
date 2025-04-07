import React, { useContext, useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  FlatList,
} from "react-native";
import { SparklesIcon } from "react-native-heroicons/outline";
import { PlayIcon } from "react-native-heroicons/solid";
import { GameContext } from "@/contexts/game";
import { HeaderContext } from "@/contexts/header";
import { useAuth } from "@/contexts/auth";
import { PlayerType } from "@/functions/getPlayers";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { scheduleNotification } from "@/functions/sendNotification";

type LocalPlayer = PlayerType & { is_ready: boolean };

export default function ConfirmGame() {
  const { currentGame } = useContext(GameContext);
  const { setTitle } = useContext(HeaderContext);
  const { user } = useAuth();

  // Store local array of players, each with an is_ready property
  const [players, setPlayers] = useState<LocalPlayer[]>([]);

  // Animated values for each player's bounce
  const bounceAnimations = useRef<Animated.Value[]>([]);
  // Animated value for the "Start Game" button pulse
  const startBtnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setTitle && setTitle("Start Game");
  }, [setTitle]);

  useEffect(() => {
    // Extract players from currentGame
    const gamePlayers = currentGame?.players || [];

    // Build a local array that includes 'is_ready'
    // Make the current user immediately ready
    const localPlayers: LocalPlayer[] = gamePlayers.map((p) => ({
      ...p,
      is_ready: p.id === user.id, // user is always ready by default
    }));
    setPlayers(localPlayers);

    // Create a bounce Animated.Value for each player
    bounceAnimations.current = localPlayers.map(() => new Animated.Value(0));

    // Start bounce loop for each
    localPlayers.forEach((_, i) => {
      startBounce(i);
    });

    // Start the "Start Game" pulsing
    startButtonPulse();
  }, [currentGame, user]);

  // Slide in + indefinite bounce for each player
  const startBounce = (index: number) => {
    const bounceVal = bounceAnimations.current[index];
    if (!bounceVal) return;

    // Start at 50 (below), then slide up to 0
    bounceVal.setValue(50);
    Animated.sequence([
      Animated.timing(bounceVal, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      // Then indefinite bounce from 0 to -5
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceVal, {
            toValue: -5,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(bounceVal, {
            toValue: 0,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  };

  // Pulsing "Start Game" button
  const startButtonPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(startBtnScale, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(startBtnScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // If every player is is_ready => trigger handleAllAccepted
  useEffect(() => {
    if (players.length > 0 && players.every((pl) => pl.is_ready)) {
      handleAllAccepted();
    }
  }, [players]);

  // Called automatically when all players are ready
  const handleAllAccepted = () => {
    console.log("All players are ready!");
    // Insert any logic needed when everyone is ready
  };

  // Called when pressing the start button
  const handleStartGame = () => {
    // create game in the backedn which then sends request to all players
    scheduleNotification();
  };

  // Toggle readiness for the given player index
  // (In a real app, you'd likely need server logic or user interactions)
  const togglePlayerReady = (index: number) => {
    // Skip if it's the user
    if (players[index].id === user.id) return;

    setPlayers((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        is_ready: !updated[index].is_ready,
      };
      return updated;
    });
  };

  //todo: listen for response from players invited and the togglePlayerReady method to mark player as ready




  // Render each player with bounce + circular avatar + username + overlay if not ready
  const renderPlayer = ({ item, index }: { item: LocalPlayer; index: number }) => {
    const bounceVal = bounceAnimations.current[index];
    if (!bounceVal) return null;

    // Convert bounceVal to a translateY
    const translateY = bounceVal.interpolate({
      inputRange: [-5, 50],
      outputRange: [-5, 50],
    });

    // If not ready, show the overlay (unless it's the user)
    const showOverlay = !item.is_ready && item.id !== user.id;

    return (
      <Animated.View
        style={[
          {
            transform: [{ translateY }],
          },
        ]}
        className="items-center m-2"
      >
        {/* Circular avatar container */}
        <View className="w-20 h-20 rounded-full overflow-hidden bg-gray-300 mb-2 relative">
          <Image
            source={{ uri: item.avatar }}
            className="w-full h-full"
            resizeMode="cover"
          />

          {/* Slight overlay if NOT ready and not the user */}
          {showOverlay && (
            <TouchableOpacity
              activeOpacity={0.8}
              // onPress={() => togglePlayerReady(index)}
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: "rgba(0,0,0,0.6)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }} className="text-center ">Waiting</Text>
            
            </TouchableOpacity>
          )}
        </View>

        {/* Username */}
        <Text className="text-black text-center text-base font-bold">
          {item.username}
        </Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      {/* Topic container at top */}
      <View className="flex-row items-center justify-center p-4 bg-yellow rounded-b-2xl mx-4 ">
        <SparklesIcon size={wp(5)} color="#000" />
        <Text className="text-black font-bold ml-2" style={{ fontSize: wp(5) }}>
          {currentGame?.topic?.title?.toUpperCase() || "No Topic"}
        </Text>
      </View>

      {/* Players list */}
      <View className="flex-1 px-4 ">
        <FlatList
          data={players}
          keyExtractor={(p) => p.id}
          renderItem={renderPlayer}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
          }}
        />
      </View>

      {/* Start Game Button (pulsing) */}
      <Animated.View
        style={{
          transform: [{ scale: startBtnScale }],
          position: "absolute",
          bottom: hp(3),
          alignSelf: "center",
        }}
      >
        <TouchableOpacity
          onPress={handleStartGame}
          className="flex-row items-center bg-yellow px-8 py-3 rounded-full"
          activeOpacity={0.8}
        >
          <PlayIcon size={wp(5)} color="#000" />
          <Text className="text-black font-bold ml-2" style={{ fontSize: wp(4) }}>
            Start Game
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

// A small helper for absolute fill
import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
});
