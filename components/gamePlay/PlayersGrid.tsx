import { FlatList, View, Text } from 'react-native';
import PlayerAvatar from './PlayerAvatar';
import { Animated } from 'react-native';

export default function PlayersGrid({ players, bounceAnimations }: any) {
   
    if (!Array.isArray(players) || !Array.isArray(bounceAnimations)) {
      return <Text>Loading...</Text>;
    }
  
    return (
      <View className="flex-1 px-4">
        <FlatList
          data={players}
          keyExtractor={(p) => p.id}
          renderItem={({ item, index }) => {
            const bounceVal = bounceAnimations[index] ?? new Animated.Value(0);
            return (
              <PlayerAvatar
                player={item}
                index={index}
                bounceVal={bounceVal}
              />
            );
          }}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
          }}
        />
      </View>
    );
  }
  
