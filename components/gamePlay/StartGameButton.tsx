import { Animated, TouchableOpacity, Text } from 'react-native';
import { PlayIcon, ClockIcon } from 'react-native-heroicons/solid';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default function StartGameButton({
  onPress,
  scale,
  title,
  gameInitiated,
}: {
  onPress: () => void;
  scale: Animated.Value;
  title: string;
  gameInitiated: boolean;
}) {
  const isWaiting = gameInitiated;

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
        position: 'absolute',
        bottom: hp(3),
        alignSelf: 'center',
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={isWaiting} // prevent re-triggering
        className={`flex-row items-center px-8 py-3 rounded-full ${
          isWaiting ? 'bg-yellow' : 'bg-yellow'
        }`}
        activeOpacity={0.8}
      >
        {isWaiting ? (
          <ClockIcon size={wp(5)} color="#000" />
        ) : (
          <PlayIcon size={wp(5)} color="#000" />
        )}

        <Text
          className={`font-bold ml-2 ${
            isWaiting ? 'text-black' : 'text-black'
          }`}
          style={{ fontSize: wp(4) }}
        >
          {isWaiting ? 'Waiting for players...' : title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
