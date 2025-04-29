import React from 'react';
import { View, Text, Image } from 'react-native';

interface PlayerCardProps {
  username: string;
  avatar: string;
  points?: number;
  scale?: number; // Default is 1
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  username,
  avatar,
  points,
  scale = 1,
}) => {
  const avatarSize = 48 * scale;
  const nameFontSize = 16 * scale;
  const pointsFontSize = 14 * scale;
  const padding = 16 * scale;

  return (
    <View
      className="flex-row items-center bg-white rounded-xl shadow-md"
      style={{ padding, width: 288 * scale }}
    >
      <Image
        source={{ uri: avatar }}
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          marginRight: 12 * scale,
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
