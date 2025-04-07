import { CheckCircleIcon } from "react-native-heroicons/outline";
import { Animated, TouchableOpacity, Text } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";


export type TopicCreatedOrExistsProps = {
  message: string;
  handlePlay: () => void;
  fadeAnim: Animated.Value;
  gamesLeftToplay: number;
};

export default function TopicCreatedOrExists({ message, gamesLeftToplay, handlePlay, fadeAnim }: TopicCreatedOrExistsProps) {
  return (
    <Animated.View
              style={{
                opacity: fadeAnim,
              }}
              className="bg-[green] rounded-lg p-4 items-center justify-center"
            >
              <CheckCircleIcon size={wp(8)} color="#00ff00" />
              <Text className="text-yellow text-center font-bold mt-2">{message}</Text>
              <Text className="text-yellow mt-1">
                You have {gamesLeftToplay} games to play on this topic.
              </Text>

              <TouchableOpacity
                onPress={handlePlay}
                activeOpacity={0.8}
                className="bg-[yellow] rounded-full py-2 px-6 mt-3 flex-row items-center"
              >
                <Text className="text-black font-bold text-lg">Play</Text>
              </TouchableOpacity>
        </Animated.View>
  );
}