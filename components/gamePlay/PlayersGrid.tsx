import { FlatList, View } from 'react-native';
import PlayerAvatar from './PlayerAvatar';

export default function PlayersGrid({ players, user, bounceAnimations, gameInitiated}: any) {
    // if (!players?.length || !bounceAnimations.current.length) return null;



  return (
    <View className="flex-1 px-4">
      <FlatList
        data={players}
        keyExtractor={(p) => p.id}
        renderItem={({ item, index }) => {
            const bounceVal = bounceAnimations.current[index];
            return (
              <PlayerAvatar
                player={item}
                index={index}
                bounceVal={bounceVal} // 👈 Make sure this is valid
                isUser={item.id === user.id}
                gameInitiated={gameInitiated}
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
