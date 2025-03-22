import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { fetchCustomTopics, fetchTopics, Topic } from "@/functions/getTopics";
import { getCurrentGame } from "@/functions/game";
import { GameContext } from "@/contexts/game";
import { router, useRouter } from "expo-router";
import { GameType } from "@/types/game";;
import { useAuth } from "@/contexts/auth";
export default function Topics() {
  const [selectedType, setSelectedType] = useState<"standard" | "custom" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const { user } = useAuth();

  const [topics, setTopics] = useState<Topic[]>([]);

  const [customPage, setCustomPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const {currentGame, setCurrentGame} = useContext(GameContext);
  const router = useRouter();

  useEffect(() => {
    setTopics([]);
    setCustomPage(1);
    setHasMore(true);

    const presentSelectedType = currentGame?.topic?.is_custom ? "custom" : "standard"
    if(currentGame?.topic){
        setSelectedTopic(currentGame.topic)
        setSelectedType(selectedType ? selectedType : presentSelectedType)
    }

    // setSelectedTopic( selectedTopic ? selectedTopic : null);  

    if (selectedType === "standard") {
      fetchTopics().then((res) => {
        if (res) {
          setTopics(res.data);
        }
      });
    } else {
      fetchCustomTopics(searchQuery, 1).then((res) => {
        if (res) {
          setTopics(res.data);
          if (!res._links.next) {
            setHasMore(false);
          }
        }
      });
    }
    if(currentGame?.topic){
      topics.push(currentGame.topic)
    }

  }, [selectedType, searchQuery]);

  const loadMoreCustomTopics = async () => {
    if (selectedType !== "custom" || loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = customPage + 1;
    const res = await fetchCustomTopics(searchQuery, nextPage);
    if (res) {
      setTopics((prev) => [...prev, ...res.data]);
      setCustomPage(nextPage);
      if (!res._links.next) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }
    setLoadingMore(false);
  };

  const nextPage = async () => {
    
    if (!selectedTopic) {
        return
    }

    let currentGameCopyUpdated: GameType = {
      creator: user.id,
      topic: {
        id: selectedTopic.id,
        is_custom: selectedTopic.is_custom,
        title: selectedTopic.title,
        image: "",
        description: ""
      }
    }
    if(currentGame?.players){
      currentGameCopyUpdated.players = currentGame?.players
    }

    setCurrentGame(currentGameCopyUpdated)    
    router.push("/selectPlayers");
  };

  const filteredTopics =
    selectedType === "standard"
      ? topics.filter((topic) =>
          topic.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : topics;

  return (
    <SafeAreaView className="flex-1 bg-primary">
      {/* Main Container */}
      <View className="p-4 flex-1">
        
        {/* Search Bar */}
        <View className="mb-4 border border-secondary rounded-md">
          <TextInput
            placeholder="Search topics..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="bg-gray-200 p-3 rounded-lg"
          />
        </View>

        {/* Prompt (switches to selected topic name) */}
        <Text className="text-secondary text-[25px] font-semibold mb-4 text-center">
          {selectedTopic ? selectedTopic.title : "Choose A Topic"}
        </Text>

        {/* Toggle Section */}
        <View className="flex-row justify-center mb-4">
          <TouchableOpacity
            onPress={() => setSelectedType("standard")}
            className={`px-4 py-2 rounded-l-full ${
              selectedType === "standard" ? "bg-secondary" : "bg-gray-300"
            } border border-secondary`}
          >
            <Text
              className={`font-bold ${
                selectedType === "standard" ? "text-primary" : "text-gray-700"
              }`}
            >
              Standard
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedType("custom")}
            className={`px-4 py-2 rounded-r-full ${
              selectedType === "custom" ? "bg-secondary" : "bg-gray-300"
            } border border-secondary`}
          >
            <Text
              className={`font-bold ${
                selectedType === "custom" ? "text-primary" : "text-gray-700"
              }`}
            >
              Custom
            </Text>
          </TouchableOpacity>
        </View>

        {/* FlatList of Topic Images */}
        <FlatList
          data={filteredTopics}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isSelected = selectedTopic?.id === item.id;
            return (
              <TouchableOpacity
                onPress={() => setSelectedTopic(item)}
                className="mb-4"
              >
                <View style={{ position: "relative" }}>
                  <Image
                    source={{ uri: item.image }}
                    style={{
                      width: wp("100%"),
                      height: hp("25%"),
                      borderRadius: 10,
                    }}
                    resizeMode="cover"
                  />
                  {/* Default overlay for title */}
                  <View className="absolute inset-0 bg-black/50 rounded-lg items-center justify-center">
                    <Text className="text-white text-center font-bold text-xl">
                      {item.title}
                    </Text>
                  </View>

                  {/* If selected, show a subtle overlay + tick in bottom-right */}
                  {isSelected && (
                    <View className="absolute inset-0 bg-white/10 rounded-lg">
                      <View className="absolute bottom-2 right-2 bg-secondary p-2 rounded-full">
                        <Text className="text-white font-bold">✓</Text>
                      </View>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp("12%") }}
          onEndReached={selectedType === "custom" ? loadMoreCustomTopics : undefined}
          onEndReachedThreshold={0.5}
        />

        {/* Floating 'Next' Button */}
        <TouchableOpacity
          onPress={nextPage}
          disabled={!selectedTopic}
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 9999,
          }}
          className={`${!selectedTopic ? "bg-light" : "bg-yellow"}`}
        >
          <Text className={`text-secondary font-bold text-xl`}>NEXT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
