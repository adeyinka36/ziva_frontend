import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { CheckIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { rgbaColor } from 'react-native-reanimated/lib/typescript/Colors';
import { useAuth } from '@/contexts/auth';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type Props = {
  scale: Animated.Value;
  onAccept: () => void;
  onDecline: (userId: string) => void;
};

export default function AcceptOrDeclineInviteButtons({
  scale,
  onAccept,
  onDecline,
}: Props) {

    const {user} = useAuth();
  return (
    <Animated.View
        style={{
            transform: [{ scale }],
            position: 'absolute',
            bottom: hp(3),
            alignSelf: 'center',
            flexDirection: 'row',
            gap: wp(4),
            backgroundColor: 'rgba(0, 0, 0, 0.6)', // semi-transparent black backdrop
            padding: 10,
            borderRadius: 16,
        }}
        >
      {/* Accept Button */}
      <TouchableOpacity
        onPress={onAccept}
        className="flex-row items-center bg-yellow px-6 py-3 rounded-full mr-2"
        activeOpacity={0.85}
      >
        <CheckIcon size={wp(5)} color="#000" />
        <Text className="text-black font-bold ml-2" style={{ fontSize: wp(4) }}>
          Accept
        </Text>
      </TouchableOpacity>

      {/* Decline Button */}
      <TouchableOpacity
        onPress={()=>onDecline(user.id)}
        className="flex-row items-center bg-[red] px-6 py-3 rounded-full"
        activeOpacity={0.85}
      >
        <XMarkIcon size={wp(5)} color="#fff" />
        <Text className="text-white font-bold ml-2" style={{ fontSize: wp(4) }}>
          Decline
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
