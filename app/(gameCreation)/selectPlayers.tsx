import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from "react-native-heroicons/solid";
import {
  UserGroupIcon,
  ExclamationCircleIcon,
} from "react-native-heroicons/outline";
import { getPlayers, PlayerType } from "@/functions/getPlayers";
import { useDebounce } from "@/hooks/useDebounce"; // Remove if unused
import { useAuth } from "@/contexts/auth";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { GameContext } from "@/contexts/game";
import { useContext, useRef } from "react";
import { useRouter } from "expo-router";
import { GameType } from "@/types/game";


const MAX_PLAYERS = 6;

export default function SelectPlayers() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const {currentGame, setCurrentGame} = useContext(GameContext);

  
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerType[]>(currentGame?.players ? currentGame.players :[]);
  const [availablePlayers, setAvailablePlayers] = useState<PlayerType[]>([]);

  

  const [flashCount, setFlashCount] = useState(0);

  const debouncedQuery = useDebounce(searchQuery, 300);

  const router = useRouter();
  useEffect(() => {
    fetchPlayers(debouncedQuery);
  }, [debouncedQuery]);

  // useEffect(() => {

  //   if(typeof currentGame?.players !== 'undefined'){
  //     setSelectedPlayers(currentGame.players);
  //     setAvailablePlayers(prev => prev.filter((p) => !(selectedPlayers.includes(p))))
  //     console.log(selectedPlayers.map(p => p.username), availablePlayers.map(p => p.username))
  //   }
  // },[currentGame])
 

  // Helper to fetch players
  const fetchPlayers = async (q: string) => {
    try {
      const response = await getPlayers(q);
      if (response && response.data) {
        let filtered = response.data.filter(
          (p) => !selectedPlayers.find((sel) => sel.id === p.id)
        );

        const isUserSelected = selectedPlayers.some((sel) => sel.id === user.id);
        if (!isUserSelected) {
          filtered = filtered.filter((p) => p.id !== user.id);
          filtered.unshift(user);
        }

        setAvailablePlayers(filtered);
      } else {
        setAvailablePlayers([]);
      }
    } catch (error) {
      console.error("Error fetching players:", error);
      setAvailablePlayers([]);
    }
  };

  // Called when user taps an available player
  const handleSelectPlayer = (player: PlayerType) => {
    // If we've hit the max, flash the header and do not add
    if (selectedPlayers.length >= MAX_PLAYERS) {
      flashHeader();
      return;
    }

    setSelectedPlayers((prev) => [...prev, player]);
  
    if(typeof currentGame?.players !== 'undefined'){
      setCurrentGame({...currentGame, players: [...currentGame.players, player]})
    }else{
      setCurrentGame({...currentGame, players: [player]})
    }
    setAvailablePlayers(prev => prev.filter((p) => !selectedPlayers.includes(p)))

  };

  // Move player from "selected" to "available"
  const handleUnselectPlayer = (player: PlayerType) => {
    setSelectedPlayers((prev) => prev.filter((p) => p.id !== player.id));
    if(typeof currentGame?.players !== 'undefined'){
      setCurrentGame({...currentGame, players: currentGame.players.filter((p) => p.id !== player.id)})

    }else{
      setCurrentGame({...currentGame, players: [player]})
    }
    setAvailablePlayers(prev => [player, ...prev])
  };

  // Flash the header text 3 times
  const flashHeader = () => {
    // If we're already flashing, ignore
    if (flashCount > 0) return;

    let flashes = 0;
    setFlashCount(1); // Start flashing

    const interval = setInterval(() => {
      flashes++;
      setFlashCount((prev) => prev + 1);

      if (flashes === 3) {
        clearInterval(interval);
        setFlashCount(0); // Stop flashing
      }
    }, 300);
  };

  const nextPage = async () => {
    if (!selectedPlayers.length) {
        return
    }
    if (!currentGame) {
        return
    }
    const updatedGame: GameType = { 
        ...currentGame,
        players: selectedPlayers
    }
    setCurrentGame(updatedGame);
  
    router.push("/createGame");
  };

  // Header: changes text based on whether we've reached the limit
  const isMaxPlayers = selectedPlayers.length === MAX_PLAYERS;
  const headerText = isMaxPlayers ? "Maximum Players" : `Up to ${MAX_PLAYERS} Players`;

  // We can also flash the text color. If flashCount is odd, use a different color
  const textColorClass = flashCount % 2 === 1 ? "text-red-600" : "text-secondary";

  // Render each "selected" player
  const renderSelectedPlayer = ({ item }: { item: PlayerType }) => (
    <View className="w-1/3 p-2">
      <View
        className="bg-darkYellow rounded-md p-3 items-center justify-center"
        style={{ minHeight: hp(12) }}
      >
        <Text className="text-secondary font-bold text-md mb-1">
          {item.username === user.username ? "You" : item.username}
        </Text>
        {/* Remove button */}
        <TouchableOpacity
          onPress={() => handleUnselectPlayer(item)}
          className="flex-row items-center bg-red-600 px-2 py-1 rounded-md"
        >
          <TrashIcon size={wp(4)} color="#F00" />
          <Text className="text-danger text-xs ml-1">Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render each "available" player (circular, yellow background)
  const renderAvailablePlayer = ({ item }: { item: PlayerType }) => (
    <TouchableOpacity
      className="w-1/3 p-2"
      onPress={() => handleSelectPlayer(item)}
    >
      <View
        className="bg-yellow-400 rounded-2xl items-center justify-center p-4 bg-darkYellow"
        style={{ minHeight: hp(12) }}
      >
        <Text className="text-black font-semibold text-md text-center">
        {item.username === user.username ? "You" : item.username}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <KeyboardAvoidingView behavior="padding" className="flex-1 p-4">
        {/* Title + Icon */}
        <View className="flex-row items-center mb-4 justify-center">
          <UserGroupIcon size={wp(10)} color="#4e2b00" className="mr-2" />
          <Text className={`${textColorClass} text-2xl font-bold`}>
            {headerText}
          </Text>
        </View>

        {/* Selected players in a 3-column grid with responsive height */}
        <View className="mb-2" style={{ maxHeight: hp(25) }}>
          {selectedPlayers.length > 0 ? (
            <FlatList
              data={selectedPlayers}
              keyExtractor={(item) => item.id}
              renderItem={renderSelectedPlayer}
              numColumns={3}
              bounces={false}
            />
          ) : (
            <Text className="text-secondary mx-auto">No players selected yet</Text>
          )}
        </View>

        {/* Sear   Bar */}
        <View className="flex-row items-center mb-4 border border-secondary rounded-md bg-gray-200 px-3 py-2">
          <MagnifyingGlassIcon size={20} color="#000" className="mr-2" />
          <TextInput
            placeholder="Search players by username or email..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-black"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* If there's no search (empty) and no players returned */}
        {searchQuery.length === 0 && availablePlayers.length === 0 && (
          <View className="items-center mb-2">
            <MagnifyingGlassIcon size={wp(20)} color="#4e2b00" className="mb-2" />
            <Text className="text-secondary text-xl text-center px-6">
              Type in a username or email to find players
            </Text>
          </View>
        )}

        {/* If there IS a search but no results */}
        {searchQuery.length > 0 && availablePlayers.length === 0 && (
          <View className="flex-row items-center justify-center mb-2 space-x-2">
            <ExclamationCircleIcon size={wp(8)} color="#4e2b00" />
            <Text className="text-secondary text-xl">
              No results found for "{searchQuery}"
            </Text>
          </View>
        )}

        {/* Grid of available players */}
        <FlatList
          data={availablePlayers}
          keyExtractor={(item) => item.id}
          renderItem={renderAvailablePlayer}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, justifyContent: 'space-between' }}
        />
      </KeyboardAvoidingView>

      {/* Floating 'Next' Button */}
      <TouchableOpacity
        onPress={nextPage}
        style={{
          position: "absolute",
          bottom: wp(5),
          right: wp(5),
          paddingVertical: wp(5),
          paddingHorizontal: wp(5),
          borderRadius: 9999,
        }}
        className={`${!selectedPlayers ? "bg-light" : "bg-lightYellowOpacity"} `}
      >
        <Text className={`text-secondary font-bold text-xl`}>NEXT</Text>
      </TouchableOpacity>

    
    </SafeAreaView>
  );
}
