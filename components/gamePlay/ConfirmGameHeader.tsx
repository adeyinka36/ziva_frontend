import { View, Text } from 'react-native';
import { SparklesIcon } from 'react-native-heroicons/outline';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default function ConfirmGameHeader({ topic }: { topic: string }) {
  return (
    <View className="flex-row items-center justify-center p-4 bg-yellow rounded-b-2xl mx-4 ">
      <SparklesIcon size={wp(5)} color="#000" />
      <Text className="text-black font-bold ml-2" style={{ fontSize: wp(5) }}>
        {topic.toUpperCase() || 'NO TOPIC'}
      </Text>
    </View>
  );
}
