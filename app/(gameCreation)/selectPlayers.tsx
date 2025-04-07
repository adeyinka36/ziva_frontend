import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import {
  XMarkIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/solid";
import {
  ExclamationCircleIcon,
} from "react-native-heroicons/outline";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuth } from "@/contexts/auth";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { GameContext } from "@/contexts/game";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { HeaderContext } from "@/contexts/header";
import { getFriendships } from "@/functions/getFriends";
import { PlayerType } from "@/functions/getPlayers";
import { GameType } from "@/types/game";

const MAX_PLAYERS = 6;

export default function SelectPlayers() {
  const { setTitle } = useContext(HeaderContext);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { currentGame, setCurrentGame } = useContext(GameContext);

  // Initialize selected players from currentGame or empty
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerType[]>(
    currentGame?.players ?? []
  );
  const [availablePlayers, setAvailablePlayers] = useState<PlayerType[]>([]);
  const debouncedQuery = useDebounce(searchQuery, 300);
  const router = useRouter();

  // On mount, ensure the user is always in the selected list
  useEffect(() => {
    setTitle("SELECT PLAYERS");
    const userAlreadySelected = selectedPlayers.some((p) => p.id === user.id);
    if (!userAlreadySelected) {
      setSelectedPlayers((prev) => [...prev, user]);
      if (currentGame?.players) {
        setCurrentGame({
          ...currentGame,
          players: [...currentGame.players, user],
        });
      } else {
        setCurrentGame({ ...currentGame, players: [user] });
      }
    }
  }, []);

  // Fetch players (friends who are "accepted") using debouncedQuery
  useEffect(() => {
    fetchPlayers(debouncedQuery);
  }, [debouncedQuery]);

  // Helper to retrieve players & remove current user + already selected
  const fetchPlayers = async (q: string) => {
    try {
      const response = await getFriendships(user.id, "accepted", q);
      if (response?.data) {
        // Filter out selected players + self
        const filtered = response.data.filter(
          (p) => !selectedPlayers.find((sel) => sel.id === p.id) && p.id !== user.id
        );
        setAvailablePlayers(filtered);
      } else {
        setAvailablePlayers([]);
      }
    } catch (error) {
      console.error("Error fetching players:", error);
      setAvailablePlayers([]);
    }
  };

  // Add a player (max 6)
  const handleSelectPlayer = (player: PlayerType) => {
    if (selectedPlayers.length >= MAX_PLAYERS) {
      Toast.show({
        type: "info",
        text1: "Maximum Players Reached",
        text2: `You can only have up to ${MAX_PLAYERS} players in a game`,
      });
      return;
    }
    setSelectedPlayers((prev) => [...prev, player]);

    if (currentGame?.players) {
      setCurrentGame({
        ...currentGame,
        players: [...currentGame.players, player],
      });
    } else {
      setCurrentGame({ ...currentGame, players: [player] });
    }
    setAvailablePlayers((prev) => prev.filter((p) => p.id !== player.id));
  };

  // Remove a player (never remove self)
  const handleUnselectPlayer = (player: PlayerType) => {
    if (player.id === user.id) return;
    setSelectedPlayers((prev) => prev.filter((p) => p.id !== player.id));

    if (currentGame?.players) {
      setCurrentGame({
        ...currentGame,
        players: currentGame.players.filter((p) => p.id !== player.id),
      });
    } else {
      setCurrentGame({ ...currentGame, players: [] });
    }
    setAvailablePlayers((prev) => [player, ...prev]);
  };

  // Next screen
  const nextPage = () => {
    if (!selectedPlayers.length) return;
    if (!currentGame) return;

    const updatedGame: GameType = { ...currentGame, players: selectedPlayers };
    setCurrentGame(updatedGame);

    router.push("/createGame");
  };

  // Render a selected player
  const renderSelectedPlayer = ({ item }: { item: PlayerType }) => {
    const isUser = item.id === user.id;
    return (
      <View className="p-2 items-center">
        {/* Avatar circle */}
        <View
          style={{
            width: wp(20),
            height: wp(20),
            borderRadius: wp(20) / 2,
            overflow: "hidden",
          }}
        >
          <Image
            source={{ uri: item.avatar }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </View>

        {/* Name + remove button */}
        <View className="flex-column w-full mt-1 items-center justify-center">
          <View className="flex-row bg-gray-300 rounded-md px-1 items-center">
            {!isUser && (
              <TouchableOpacity onPress={() => handleUnselectPlayer(item)}>
                <XMarkIcon size={wp(5)} color="red" style={{ marginRight: 4 }} />
              </TouchableOpacity>
            )}
            <Text className="text-black font-bold">{item.username}</Text>
          </View>
        </View>
      </View>
    );
  };

  // Render an available player
  const renderAvailablePlayer = ({ item }: { item: PlayerType }) => (
    <View className="p-2 items-center">
      <TouchableOpacity
        style={{
          width: wp(20),
          height: wp(20),
          borderRadius: wp(20) / 2,
          overflow: "hidden",
        }}
        onPress={() => handleSelectPlayer(item)}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: item.avatar }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View className="bg-gray-300 mt-1 rounded-md items-center px-1">
        <Text className="text-black font-bold">{item.username}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <KeyboardAvoidingView behavior="padding" className="flex-1 p-4">

        {/* Selected players */}
        <View style={{ flex: 0.4 }}>
          {selectedPlayers.length > 0 ? (
            <FlatList
              data={selectedPlayers}
              keyExtractor={(item) => item.id}
              renderItem={renderSelectedPlayer}
              // Center horizontally & vertically
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              // e.g. 3 across
              numColumns={3}
              bounces={false}
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text className="text-secondary text-lg">
                No players selected yet
              </Text>
            </View>
          )}
        </View>

        {/* Search bar */}
        <View className="flex-row items-center mb-4 border border-secondary rounded-md bg-gray-200 px-3 py-2">
          <MagnifyingGlassIcon size={20} color="#000" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Select a friend to play!"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-black"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* If no search & none available */}
        {searchQuery.length === 0 && availablePlayers.length === 0 && (
          <View className="items-center mb-2">
            <MagnifyingGlassIcon size={wp(20)} color="#4e2b00" className="mb-2" />
            <Text className="text-secondary text-xl text-center px-6">
              Type in a username or email to find players
            </Text>
          </View>
        )}

        {/* If searching but no results */}
        {searchQuery.length > 0 && availablePlayers.length === 0 && (
          <View className="flex-row items-center justify-center mb-2 space-x-2">
            <ExclamationCircleIcon size={wp(8)} color="#4e2b00" />
            <Text className="text-secondary text-xl">
              No results found for "{searchQuery}"
            </Text>
          </View>
        )}

        {/* Available players */}
        <View style={{ flex: 0.6 }}>
          <FlatList
            data={availablePlayers}
            keyExtractor={(item) => item.id}
            renderItem={renderAvailablePlayer}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            // Center horizontally & vertically
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Floating 'NEXT' Button */}
      <TouchableOpacity
        onPress={nextPage}
        style={{
          position: "absolute",
          bottom: wp(5),
          right: wp(5),
          paddingVertical: wp(4),
          paddingHorizontal: wp(7),
          borderRadius: 9999,
        }}
        className={selectedPlayers.length > 0 ? "bg-yellow" : "bg-gray"}
      >
        <Text className="text-secondary font-bold text-xl">NEXT</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
