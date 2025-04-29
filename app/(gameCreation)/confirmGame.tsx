import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { useAuth } from '@/contexts/auth';
import { GameContext } from '@/contexts/game';
import { HeaderContext } from '@/contexts/header';
import { useGameAnimation } from '@/components/gamePlay/useGameAnimation';
import PlayersGrid from '@/components/gamePlay/PlayersGrid';
import StartGameButton from '@/components/gamePlay/StartGameButton';
import ConfirmGameHeader from '@/components/gamePlay/ConfirmGameHeader';
import { PlayerType } from '@/functions/getPlayers';
import AcceptOrDeclineInviteButtons from '@/components/gamePlay/AcceptOrDeclineInvite';
import { useRouter } from 'expo-router';
import { createGameOnServer } from '@/functions/game';
import Toast from 'react-native-toast-message';
import { useNotification } from '@/contexts/NotificationContext';
import { sendGameAcceptedOrDeclinedNotification } from '@/functions/sendPushNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ConfirmGame() {
    const { currentGame, setCurrentGame } = useContext(GameContext);
    const { setTitle } = useContext(HeaderContext);
    const { user } = useAuth();
    const [invitedAccepted, setInviteAccepted] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const [gameInitiated, setGameInitiated] = useState(false);
    const [confirmTitle, setConfirmTitle] = useState('Start Game');
    const router = useRouter();
    const [gameCreated, setGameCreated] = useState(false);
  

    if(!currentGame?.players) return null
  
    const { bounceAnimations, startBtnScale } = useGameAnimation(currentGame.players?.length || 0);
  
    useEffect(() => {
      setTitle && setTitle('Start Game');
    
    }, [setTitle]);

  
    useEffect(() => {
      if(!currentGame?.players?.length) return
      if ( currentGame.players.every((pl) => pl.is_ready)) { 
        if((currentGame?.creator === user.id) && !gameCreated) {
          handleStartGame().then(()=>{
            router.replace('/gameScreen');
          })
        } else {
          AsyncStorage.setItem('currentGame', JSON.stringify(currentGame));
          router.replace('/gameScreen');
        }
      }
    }, [currentGame?.players]);
  
    const handleStartGame = async () => {
      if (currentGame) {
        setGameInitiated(true);
        const createdGame = await createGameOnServer(currentGame);
        setCurrentGame({...currentGame, id: createdGame.data.id});
        AsyncStorage.setItem('currentGame', JSON.stringify(currentGame));
        setConfirmTitle('Waiting');
        setGameCreated(true);
    
      }
    };
  
    const handleAccept = async () => {
      if (currentGame?.id) {
        const success = await sendGameAcceptedOrDeclinedNotification(
          user.id,
          currentGame.id,
          'accepted'
        );
        if (!success) {
          Toast.show({
            type: 'error',
            text1: 'Invite',
            text2: "Couldn't accept invite",
          });
          return;
        }
        setInviteAccepted(true);
        setConfirmTitle('Waiting for Opponents');
        setGameInitiated(true);
      }
    };
  
    const handleDecline = async (userId: string) => {
      if (currentGame?.id) {
        const success = await sendGameAcceptedOrDeclinedNotification(
          user.id,
          currentGame.id,
          'rejected'
        );
        if (!success) {
          Toast.show({
            type: 'error',
            text1: 'Invite',
            text2: "Couldn't decline invite",
          });
          return;
        }
        setCurrentGame({...currentGame, players: currentGame.players?.filter(p=>p.id !== user.id)});
      }
    };

  
    return (
      <SafeAreaView className="flex-1 bg-primary">
        {currentGame ? (
          <>
            <ConfirmGameHeader topic={currentGame.topic?.title ?? ''} />
            <PlayersGrid players={currentGame.players} bounceAnimations={bounceAnimations} />
            {(currentGame?.creator== user.id) && (
              <StartGameButton
                onPress={handleStartGame}
                scale={startBtnScale}
                title={confirmTitle}
                gameInitiated={gameInitiated}
              />
            )}
            {(!invitedAccepted && !(currentGame?.creator== user.id)) &&  (
              <AcceptOrDeclineInviteButtons
                scale={startBtnScale}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            )}
          </>
        ) : (
          // Optionally, render a loading indicator or placeholder
          <Text>Loading game data...</Text>
        )}
      </SafeAreaView>
    );
  }
  