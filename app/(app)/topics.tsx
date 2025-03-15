import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Link } from "expo-router";

export default function Topics() {
  const [selectedType, setSelectedType] = useState<"standard" | "custom">("standard");
  const [searchQuery, setSearchQuery] = useState("");

  // Topics using free stock images from Unsplash via URL queries.
  const standardTopics = [
    { id: "1", title: "Nature", image: { uri: "https://source.unsplash.com/800x600/?nature" } },
    { id: "2", title: "Architecture", image: { uri: "https://source.unsplash.com/800x600/?architecture" } },
    { id: "3", title: "Technology", image: { uri: "https://source.unsplash.com/800x600/?technology" } },
  ];

  const customTopics = [
    { id: "1", title: "Abstract", image: { uri: "https://source.unsplash.com/800x600/?abstract" } },
    { id: "2", title: "Patterns", image: { uri: "https://source.unsplash.com/800x600/?pattern" } },
    { id: "3", title: "Design", image: { uri: "https://source.unsplash.com/800x600/?design" } },
  ];

  const topicsToRender = selectedType === "standard" ? standardTopics : customTopics;

  // Filter topics based on the search query
  const filteredTopics = topicsToRender.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="p-4">
        {/* Search Bar */}
        <View className="mb-4 border border-secondary rounded-md">
          <TextInput
            placeholder="Search topics..."
    
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="bg-gray-200 p-3 rounded-lg"
          />
        </View>

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
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={()=>console.log('mvoing')}
                    className="mb-4"
                >
                <View style={{ position: "relative" }}>
                    <Image
                    source={item.image}
                    style={{
                        width: wp("100%"),
                        height: hp("25%"),
                        borderRadius: 10,
                    }}
                    resizeMode="cover"
                    />
                    <View className="absolute inset-0 bg-black/50 rounded-lg items-center justify-center">
                    <Text className="text-secondary text-center font-bold text-xl">
                        {item.title}
                    </Text>
                    </View>
                </View>
                </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: hp("7%") }}
            ListFooterComponent={<View style={{ height: hp("7%") }} />}
            />
      </View>
    </SafeAreaView>
  );
}
