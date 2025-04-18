import React, { useEffect, useState, useContext } from "react";
import { Text } from "react-native";
import { getItemFromAsyncStorage, storeItemInAsyncStorage, removeItemFromAsyncStorage } from "@/functions/asyncStorage";
import { useRouter } from "expo-router";
import { GameContext } from "@/contexts/game";

type gameStateType = 'INITIAL' | 'PLAY'

export default function GameScreen() {
  const router = useRouter();
  const [gameState, setGameState] = useState<gameStateType>('INITIAL');
  const {currentGame, setCurrentGame} = useContext(GameContext);


  if(!currentGame) {
    return <Text>Welcome to the game screen</Text>;
  }

  useEffect(() => {
    const gameRoomId = currentGame.id
    if(!gameRoomId) {
        return router.replace('/home');
    }

    joinGameRoom(gameRoomId);

    return (()=>{
        exitGameRoom(gameRoomId)
    })
  }, [currentGame]);

  const joinGameRoom = (gameId: string) => {
        console.log('Joining game room ', gameId);
        // implement connection to socket
  }

  const exitGameRoom = (gameId: string) => {
    
  }

  return <Text>Welcome to the game screen</Text>;
}