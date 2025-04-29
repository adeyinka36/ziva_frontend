import React, { useEffect, useState, useContext, useCallback } from "react";
import { Text } from "react-native";
import { useRouter } from "expo-router";
import { GameContext } from "@/contexts/game";
import { initiateGameOnSocket } from "@/functions/game";
import useSocket from "@/hooks/useSocket";
import { useAuth } from "@/contexts/auth";
import { GameQuestionType } from "@/types/game";
import GameFlowManager from "@/Screens/GamFlow/GameFlowManager";
import GameOverScreen from "@/Screens/GamFlow/GameOverScreen";

type GameState = 'INITIAL' | 'PLAY';

export default function GameScreen() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>('INITIAL');
  const { currentGame, setCurrentGame } = useContext(GameContext);
  const socket = useSocket();
  const { user } = useAuth();
  const [ gameQuestion, setGameQuestion] = useState<GameQuestionType|undefined>();
  const [gameWinner, setGameWinner] = useState<string|null>(null)
  const [gameOver, setGameOver] = useState(false);
  

  if(!currentGame?.id) {
    return null
  } 

  const gameId = currentGame?.id

  useEffect(() => {
    if (!currentGame?.id || !socket) return;
  
    const joinedGameId = currentGame.id; // 📦 capture ID once
  
    joinGameRoom(joinedGameId);
  
    return () => {
        console.log('Cleaning up, leaving room:', joinedGameId);
        exitGameRoom(joinedGameId);
      
        setTimeout(() => {
          setCurrentGame(undefined);
          router.replace('/home');
        }, 2000); // 300ms wait to allow emit
      };
  }, [currentGame?.id, socket]);
  
  


  
  const joinGameRoom = useCallback(async (gameId: string) => {
    if (!socket) return; 
  
    const gameInitializationResponse = await initiateGameOnSocket(gameId);
  
    if (gameInitializationResponse) {
      socket.emit("join_game", {
        gameId,
        playerId: user.id,
      });
  
      socket.on("player_joined", (data: any) => {
        console.log(`Player joined room ${gameId}`, data);
      });


      socket.on("game_question", (data: GameQuestionType)=>{
          setGameQuestion(data);
      })

      socket.on("game_ended", (data: any)=>{
        console.log("game ended data---->", data)
        setGameOver(true);
        setGameWinner(data.gameWinner.winnerId)
      })


    }
  }, [gameId, socket, user.id]); // ✅ added `socket` and `user.id`
  

  const exitGameRoom = useCallback((id: string) => {
    if (!socket) return;
  
    if (!socket.connected) {
      return;
    }
  
    socket.emit('leave_game', {
      gameId: id,
      playerId: user.id,
      username: user.username,
    }, () => {
      setCurrentGame(undefined);
      router.replace('/home');
    });
  }, [socket, user.id, user.username]);

  if(gameOver) return <GameOverScreen didWin={user.id==gameWinner}/>
  


  return (
    gameQuestion ? 
    <GameFlowManager question={gameQuestion}/> : 
    <Text>Welcome to the game screen {currentGame?.id }</Text>
  )

}
