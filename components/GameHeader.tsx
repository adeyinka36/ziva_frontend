import React from 'react';
import { ScrollView, View, Image } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface GameHeaderComponentProps {
  players: { id: string; avatar: string }[];
  avatarScale?: number;
}

const GameHeaderComponent: React.FC<GameHeaderComponentProps> = ({
  players,
  avatarScale = 1,
}) => {
  const avatarSize = hp(6) * avatarScale;
  const spacing = hp(1.5);

  return (
    <View className="bg-white py-3 px-4">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {players.map((player) => (
          <Image
            key={player.id}
            source={{ uri: player.avatar }}
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              marginRight: spacing,
            }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default GameHeaderComponent;
