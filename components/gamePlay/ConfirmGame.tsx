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
import AcceptOrDeclineInviteButtons from './AcceptOrDeclineInvite';
import { useRouter } from 'expo-router';
import { initiateGame } from '@/functions/game';
import { GameType } from '@/types/game';
import Toast from 'react-native-toast-message';
import { useLocalSearchParams } from 'expo-router';
import { useNotification } from '@/contexts/NotificationContext';
import { setParams } from 'expo-router/build/global-state/routing';
import { setNativeProps } from 'react-native-reanimated';
import { sendGameAcceptedOrDeclinedNotification } from '@/functions/sendPushNotification';


export default function ConfirmGame() {
    const { currentGame, setCurrentGame } = useContext(GameContext);
    const { setTitle } = useContext(HeaderContext);
    const { user } = useAuth();
    const [invitedAccepted, setInviteAccepted] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const [gameInitiated, setGameInitiated] = useState(false);
    const [confirmTitle, setConfirmTitle] = useState('Start Game');
    const router = useRouter();
    const { notificationData } = useNotification();
  
    // Initialize players state with an empty array or currentGame.players if available
    const [players, setPlayers] = useState<PlayerType[]>(currentGame?.players || []);
  
    const { bounceAnimations, startBtnScale } = useGameAnimation(players.length);
  
    useEffect(() => {
      setTitle && setTitle('Start Game');
    }, [setTitle]);
  
    useEffect(() => {
      if (currentGame) {
        setIsCreator(currentGame.creator === user.id);
        if (players.length === 1) {
          setGameInitiated(true);
          router.replace('/gameScreen');
        }
      }
    }, [user, currentGame, players]);
  
    useEffect(() => {
      if (notificationData?.game_id === currentGame?.id) {
        const type = notificationData?.type;
        const playerId = notificationData?.accepting_player_id;
  
        if (type === 'game_invite_accepted' && playerId) {
          setPlayers((prevPlayers) =>
            prevPlayers.map((player) =>
              player.id === playerId ? { ...player, is_ready: true } : player
            )
          );
        }
  
        if (type === 'game_invite_rejected' && playerId) {
          setPlayers((prevPlayers) =>
            prevPlayers.filter((player) => player.id !== playerId)
          );
        }
      }
    }, [notificationData, currentGame]);
  
    useEffect(() => {
      if (players.length > 0 && players.every((pl) => pl.is_ready)) {
        router.replace('/gameScreen');
      }
    }, [players]);
  
    const handleStartGame = async () => {
      if (currentGame) {
        const createdGame = await initiateGame(currentGame);
        setCurrentGame({ ...currentGame, id: createdGame.id });

        setGameInitiated(true);
        setConfirmTitle('Waiting');
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
        router.replace('/gameScreen');
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
        setPlayers(players.filter((p) => p.id !== userId));
      }
    };

  
    return (
      <SafeAreaView className="flex-1 bg-primary">
        {currentGame ? (
          <>
            <ConfirmGameHeader topic={currentGame.topic?.title ?? ''} />
            <PlayersGrid players={players} bounceAnimations={bounceAnimations} />
            {isCreator && (
              <StartGameButton
                onPress={handleStartGame}
                scale={startBtnScale}
                title={confirmTitle}
                gameInitiated={gameInitiated}
              />
            )}
            {(!invitedAccepted && !isCreator) &&  (
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
  