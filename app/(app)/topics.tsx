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
import { useRouter } from "expo-router";
import { GameType } from "@/types/game";
import { useAuth } from "@/contexts/auth";
import { GameContext } from "@/contexts/game";
import { SparklesIcon } from "react-native-heroicons/outline";

/** For reference: the shape of your Topics response */
interface TopicsResponse {
  _links: {
    self: string;
    next: string | null;
    prev: string | null;
  };
  data: Topic[];
}

export default function Topics() {
  const { user } = useAuth();
  const { currentGame, setCurrentGame } = useContext(GameContext);
  const router = useRouter();

  // Decide initial segment based on currentGame.topic
  const initialType: "standard" | "custom" = currentGame?.topic?.is_custom
    ? "custom"
    : "standard";

  const [selectedType, setSelectedType] = useState<"standard" | "custom">(initialType);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(currentGame?.topic ?? null);

  // The main list of topics we display
  const [topics, setTopics] = useState<Topic[]>([]);

  // For custom topics pagination:
  // We'll store the "next" link from the API response instead of a numeric page
  const [customNextUrl, setCustomNextUrl] = useState<string | null>(null);

  // We'll control whether more data is available and if we're currently loading
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  /**
   * Utility: deduplicate topics by lowercased title
   */
  function deduplicateTopics(topicsArr: Topic[]): Topic[] {
    const uniqueMap = new Map<string, Topic>();
    for (const t of topicsArr) {
      const key = t.title?.toLowerCase() ?? "";
      uniqueMap.set(key, t);
    }
    return Array.from(uniqueMap.values());
  }

  /**
   * 1) Whenever `selectedType` or `searchQuery` changes, we reset and fetch new data.
   */
  useEffect(() => {
    // Clear old topics
    setTopics([]);
    // Reset the "next" link for custom
    setCustomNextUrl(null);
    setHasMore(true);
    setLoadingMore(false);

    if (selectedType === "standard") {
      // 1) Standard topics => fetch once
      fetchTopics().then((res) => {
        if (res?.data) {
          const deduped = deduplicateTopics(res.data);
          setTopics(deduped);
          // 'standard' doesn't rely on pagination from the server
          // so "hasMore" can remain false if you'd like, or remain true if no infinite scroll needed
          // but let's do "no infinite scroll for standard"
          setHasMore(false);
        }
      });
    } else {
      // 2) Custom topics => call fetchCustomTopics(searchQuery) for the first page
      fetchCustomTopics(searchQuery).then((res) => {
        if (res?.data) {
          // Add them
          const deduped = deduplicateTopics(res.data);
          setTopics(deduped);

          // If there's a next link, store it. Otherwise, setHasMore(false)
          const nextLink = res._links?.next;
          if (nextLink) {
            setCustomNextUrl(nextLink);
          } else {
            setHasMore(false);
          }
        }
      });
    }
  }, [selectedType, searchQuery]);

  /**
   * 2) For custom topics, if there's a _links.next, we load more data from that URL.
   */
  const loadMoreCustomTopics = async () => {
    if (selectedType !== "custom") return;
    if (!hasMore || !customNextUrl || loadingMore) return;

    setLoadingMore(true);
    try {
      // We'll just fetch from the nextLink directly
      const response = await fetch(customNextUrl);
      // parse as JSON
      const res: TopicsResponse = await response.json();

      if (res?.data) {
        const merged = [...topics, ...res.data];
        const deduped = deduplicateTopics(merged);
        setTopics(deduped);

        if (res._links?.next) {
          setCustomNextUrl(res._links.next);
        } else {
          setCustomNextUrl(null);
          setHasMore(false);
        }
      }
    } catch (error) {
      console.log("Error loading more custom topics:", error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  /**
   * 3) handleTopicSelection: select a topic + update currentGame
   */
  const handleTopicSelection = (topic: Topic) => {
    if (!topic) return;
    setSelectedTopic(topic);
    setSelectedType(topic.is_custom ? "custom" : "standard");

    let currGame = {...currentGame}
    currGame.topic = topic

    setCurrentGame(currGame);
  };

  /**
   * 4) NEXT button => build an updated game, push to selectPlayers
   */
  const nextPageHandler = () => {
    if (!selectedTopic) return;
    const updatedGame: GameType = {
      creator: user?.id ?? "",
      topic: {
        id: selectedTopic.id,
        is_custom: !!selectedTopic.is_custom,
        title: selectedTopic.title ?? "",
        image: selectedTopic.image ?? "",
        description: selectedTopic.description ?? "",
      },
    };
    if (currentGame?.players) {
      updatedGame.players = currentGame.players;
    }

    setCurrentGame(updatedGame);
    router.push("/selectPlayers");
  };

  /**
   * 5) Filter standard topics locally by searchQuery
   *    For custom, the server query does the filtering, so we just show `topics`.
   */
  let filteredTopics = topics;
  if (selectedType === "standard") {
    const lowerQ = searchQuery.toLowerCase();
    filteredTopics = topics.filter((t) =>
      t.title?.toLowerCase().includes(lowerQ)
    );
  }

  /**
   * 6) If we have a selectedTopic, only show it in the list if it matches the current segment
   *    i.e. if (selectedTopic.is_custom && selectedType==='custom') or
   *         (!selectedTopic.is_custom && selectedType==='standard').
   */
  if (selectedTopic) {
    const isCustomTopic = !!selectedTopic.is_custom;
    const correctType = isCustomTopic ? "custom" : "standard";
    if (correctType === selectedType) {
      // Check if it's missing
      const lowerSelected = selectedTopic.title?.toLowerCase() ?? "";
      const existsInList = filteredTopics.some(
        (t) => (t.title?.toLowerCase() ?? "") === lowerSelected
      );
      if (!existsInList) {
        filteredTopics = [selectedTopic, ...filteredTopics];
      }
    }
  }

  // Helper for highlighting the current selection
  const isTopicSelected = (item: Topic) => {
    if (!selectedTopic) return false;
    if (selectedTopic?.id === item?.id) return true;
    const selLower = selectedTopic.title?.toLowerCase() ?? "";
    const itemLower = item.title?.toLowerCase() ?? "";
    return selLower === itemLower;
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="p-4 flex-1">
        {/* Search Bar */}
        <View className="mb-4 border border-secondary rounded-md">
          <TextInput
            placeholder="Search topics..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="bg-gray-200 p-3 rounded-lg"
            autoCapitalize="none"
          />
        </View>

        {/* Selected Topic Prompt */}
        <View className="self-start flex-row bg-yellow rounded-lg py-2 px-3 mb-4 justify-center items-center">
          <SparklesIcon size={wp(5)} color="#000000" />
          <Text className="ml-2 text-black text-[20px] font-semibold">
            {selectedTopic?.title
              ? selectedTopic.title.toUpperCase()
              : "CHOOSE A TOPIC"}
          </Text>
        </View>

        {/* Segment Toggle */}
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

        {/* Topics List */}
        <FlatList
          data={filteredTopics}
          keyExtractor={(item) => item?.id?.toString()}
          renderItem={({ item }) => {
            const isSelected = isTopicSelected(item);
            return (
              <TouchableOpacity onPress={() => handleTopicSelection(item)}>
                <View style={{ position: "relative", marginBottom: 16 }}>
                  <Image
                    source={{ uri: item.image ?? "" }}
                    style={{
                      width: wp("100%"),
                      height: hp("25%"),
                      borderRadius: 10,
                    }}
                    resizeMode="cover"
                  />
                  {/* Title Overlay */}
                  <View className="absolute inset-0 bg-black/50 rounded-lg items-center justify-center">
                    <Text className="text-white text-center font-bold text-xl">
                      {item.title}
                    </Text>
                  </View>

                  {/* Selected Overlay + Tick */}
                  {isSelected && (
                    <View className="absolute inset-0 bg-black/30 rounded-lg">
                      <View className="absolute bottom-2 right-2 bg-secondary p-2 rounded-full">
                        <Text className="text-white font-bold">✓</Text>
                      </View>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingBottom: hp("12%") }}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          // We only do infinite scroll if it's custom & we have more to load
          onEndReached={selectedType === "custom" ? loadMoreCustomTopics : undefined}
        />

        {/* NEXT Button */}
        <TouchableOpacity
          onPress={nextPageHandler}
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
          <Text className="text-secondary font-bold text-xl">NEXT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
