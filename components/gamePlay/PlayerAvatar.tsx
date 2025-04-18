import { View, Text, Image, TouchableOpacity, Animated, StyleSheet } from 'react-native';

export default function PlayerAvatar({
  player,
  index,
  bounceVal,
}: {
  player: any;
  index: number;
  bounceVal: Animated.Value;
}) {
    if (!bounceVal) return null;
  const translateY = bounceVal.interpolate({
    inputRange: [-5, 50],
    outputRange: [-5, 50],
  });

  const showOverlay = !player.is_ready;

  return (
    //if game is not initiated put dark shade overlay and hide waiting
    <Animated.View
      style={{ transform: [{ translateY }] }}
      className="items-center m-2"
    >
      <View className="w-20 h-20 rounded-full overflow-hidden bg-gray-300 mb-2 relative">
        <Image source={{ uri: player.avatar }} className="w-full h-full" resizeMode="cover" />
        {showOverlay && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: showOverlay ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{showOverlay ? 'Waiting' : ''}</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text className="text-black text-center text-base font-bold">{player.username}</Text>
    </Animated.View>
  );
}
