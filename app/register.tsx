import React from 'react';
import { View, Text, Image } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface PlayerCardProps {
  username: string;
  avatar: string;
  points?: number;
  scale?: number;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  username,
  avatar,
  points,
  scale = 1,
}) => {
  const avatarSize = hp(6) * scale; // ~48dp base
  const nameFontSize = hp(2) * scale; // ~16dp base
  const pointsFontSize = hp(1.7) * scale; // ~14dp base
  const padding = hp(2) * scale; // ~16dp base
  const cardWidth = hp(35) * scale; // ~280dp base

  return (
    <View
      className="flex-row items-center bg-white rounded-xl shadow-md"
      style={{ padding, width: cardWidth }}
    >
      <Image
        source={{ uri: avatar }}
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          marginRight: hp(1.5) * scale,
        }}
        resizeMode="cover"
      />
      <View style={{ flex: 1 }}>
        <Text
          className="font-semibold text-gray-800"
          style={{ fontSize: nameFontSize }}
        >
          {username}
        </Text>
        {points !== undefined && (
          <Text
            className="text-gray-500 mt-1"
            style={{ fontSize: pointsFontSize }}
          >
            {points} pts
          </Text>
        )}
      </View>
    </View>
  );
};

export default PlayerCard;
