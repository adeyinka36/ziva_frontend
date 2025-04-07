import React, { useState, useRef, useEffect, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import axios, { AxiosError } from "axios";
import {
  CheckCircleIcon,
  PencilSquareIcon,
  InformationCircleIcon,
  ClipboardDocumentListIcon,
  ExclamationCircleIcon,
  SparklesIcon,
  CurrencyEuroIcon,
} from "react-native-heroicons/outline";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Toast from "react-native-toast-message";
import { HeaderContext } from "@/contexts/header";
import TopicCreatedOrExists from "@/components/topicCreatedOrExists";
import { getTopicOrCreateCustomTopicByTitle, CustomTopicCreationResponse } from "@/functions/getTopics";
import { useRouter } from "expo-router";
import { GameContext } from "@/contexts/game";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
export default function CustomQuizCreateScreen() {
  const { setTitle } = useContext(HeaderContext);
  const [topic, setTopic] = useState("");
  const [customTopicsLeft, setcustomTopicsLeft] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>("");

  const [createdTopic, setCreatedTopic] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const infoFade = useRef(new Animated.Value(0)).current;

  const maxQuizzes = 10;
  const progressAnim = useRef(new Animated.Value(customTopicsLeft)).current;
  const router = useRouter();
  const { currentGame, setCurrentGame } = useContext(GameContext);

  // Animate the info text on mount
  useEffect(() => {
    setTitle("Create Custom Topic");
    Animated.timing(infoFade, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, []);

  // Each time customTopicsLeft changes, animate the bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: customTopicsLeft,
      duration: 500,
      useNativeDriver: false, // for width interpolation
      easing: Easing.inOut(Easing.ease),
    }).start();
  }, [customTopicsLeft]);

  // Interpolated width from 0..10 -> '0%'..'100%'
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, maxQuizzes],
    outputRange: ["0%", "100%"],
  });
  // ----- End meter addition -----

  // Validate the topic: must be 1-19 characters
  const isValidTopic = () => topic.length > 0 && topic.length <= 19;

  const handleTopicChange = (text: string) => {
    setTopic(text);
    setShowSuccess(false);
  }

  const handleCreateQuiz = async () => {
    if (!isValidTopic()) {
      Toast.show({
        type: "error",
        text1: "Invalid Topic",
        text2: "Topic must be 1-19 characters",
      });
      return;
    }

    try {
      // Example axios request - replace with your actual API route
      const payload = { title: topic };

      setIsLoading(true);

      const createCustomTopicResponse = await getTopicOrCreateCustomTopicByTitle(topic);


     if(!createCustomTopicResponse){
      Toast.show({
        type: "error",
        text1: "Quiz Creation Failed",
        text2: "Please try again later.",
      });
      return;
     }


     const {message, ...createdOrRetrievedTopic} = createCustomTopicResponse;

     setResponseMessage(message);
     setCurrentGame({
        topic: createdOrRetrievedTopic.data,
      })
      // On success:
      setcustomTopicsLeft((prev) => prev - 1);
      setCreatedTopic(topic);
      setTopic("");

      // Show success message with fade-in
      setShowSuccess(true);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }).start();

      setIsLoading(false);

      if(createdTopic){
        Toast.show({
            type: "success",
            text1: `${createdTopic} created!`,
            text2: responseMessage,
          });
      }
      
    } catch (error: any) {
      //check axios error message and show it
      if (error instanceof AxiosError) {
        Toast.show({
          type: "error",
          text1: "Quiz Creation Failed",
          text2: error.response?.data.message,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Quiz Creation Failed",
          text2: "Please try again later.",
        });
      }
      setIsLoading(false);
    }
  };

  const handlePlay = () => {
    router.push("/selectPlayers");
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: wp(5),
            paddingVertical: wp(4),
            flexGrow: 1,
            justifyContent: "space-between",
          }}
        >
          <Animated.View
            style={{
              opacity: infoFade,
              transform: [
                {
                  translateY: infoFade.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            }}
            className="mb-4 bg-gray-200 p-4 rounded-lg"
          >
            {/* 1) How many quizzes left today */}
            <View className="flex-row items-center mb-2">
              <ClipboardDocumentListIcon size={wp(8)} color="#000" />
              <Text className="ml-2 text-black text-lg">
                {customTopicsLeft} custom topics left today.
              </Text>
            </View>

            {/* 2) How many quizzes can be created daily (assume 10) */}
            <View className="flex-row items-center mb-2">
              <InformationCircleIcon size={wp(8)} color="#000" />
              <Text className="ml-2 text-black text-lg">
              {customTopicsLeft} custom quizzes daily.
              </Text>
            </View>

            {/* 3) Max 19 chars */}
            <View className="flex-row items-center mb-2">
              <ExclamationCircleIcon size={wp(8)} color="#000" />
              <Text className="ml-2 text-black text-lg">
                Each topic name can have up to 19 characters.
              </Text>
            </View>

            {/* 4) 10 separate quizzes of 7 questions each */}
            <View className="flex-row items-center">
              <SparklesIcon size={wp(8)} color="#000" />
              <Text className="ml-2 text-black text-lg">
                Each custom topic generates 10 quizzes with 7 questions each.
              </Text>
            </View>
          </Animated.View>

          {/* Meter for how many quizzes left */}
          <View className="mb-4">
            <Text className="text-black text-center text-lg font-bold">{customTopicsLeft} topics left today</Text>
            <View className="w-full h-4 bg-[red] rounded-full mt-1 overflow-hidden"
                style={{ transform: [{ rotate: '180deg' }] }}
            >
              <Animated.View
                style={{
                  width: progressWidth,
                  backgroundColor: "#ffff00",
                  height: "100%",
                }}
              />
            </View>
          </View>
          {/* End meter */}

          <View className=" items-center justify-center">
            <View className="mb-4  border-2 border-black rounded-md p-3 w-full">
              <TextInput
                placeholder="Enter a topic"
                placeholderTextColor="#000"
                value={topic}
                onChangeText={handleTopicChange}
                style={{ height: hp(4), paddingVertical: 0, fontWeight: "bold" }}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={19}
              />
            </View>

            <TouchableOpacity
              onPress={handleCreateQuiz}
              activeOpacity={0.8}
              className="flex-row items-center justify-center bg-[yellow] rounded-full py-3 px-6 mb-4 w-full"
            >
              <PencilSquareIcon size={wp(5)} color="#000000" />
              <Text className="text-black font-bold text-lg ml-2">Create</Text>
            </TouchableOpacity>
          </View>

          {showSuccess && createdTopic && (
            <TopicCreatedOrExists
              message={responseMessage}
              gamesLeftToplay={10}
              handlePlay={handlePlay}
              fadeAnim={fadeAnim}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
