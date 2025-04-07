import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { useAuth } from '@/contexts/auth';
import { GameContext } from '@/contexts/game';
import { HeaderContext } from '@/contexts/header';
import { scheduleNotification } from '@/functions/sendNotification';
import { useGameAnimation } from '@/components/gamePlay/useGameAnimation';
import PlayersGrid from '@/components/gamePlay/PlayersGrid';
import StartGameButton from '@/components/gamePlay/StartGameButton';
import ConfirmGameHeader from '@/components/gamePlay/ConfirmGameHeader';
import { PlayerType } from '@/functions/getPlayers';
import AcceptOrDeclineInviteButtons from './AcceptOrDeclineInvite';
import { useRouter } from 'expo-router';
import { initiateGame } from '@/functions/game';

type GamePlayer = PlayerType & { is_ready: boolean };

export default function ConfirmGame() {
  const { currentGame } = useContext(GameContext);
  const { setTitle } = useContext(HeaderContext);
  const { user } = useAuth();
  const [invitedAccepted, setInviteAccepted] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [ gameInitiated, setGameInitiated] = useState(false);
  const [ confirmTitle, setConfirmTitle] = useState("Start Game");
  const router = useRouter();

  const [players, setPlayers] = useState<GamePlayer[]>([]);

  const { bounceAnimations, startBtnScale } = useGameAnimation(players.length);

  useEffect(() => {
    setTitle && setTitle('Start Game');
  }, [setTitle]);

  useEffect(() => {
    setIsCreator(currentGame?.creator === user.id)
    if(players.length === 1){
        setGameInitiated(true);
        router.replace('/gameScreen')
    }
  }, [user, currentGame, players])


  useEffect(() => {
    const gamePlayers = currentGame?.players || [];

    const localPlayers = gamePlayers.map((p) => ({
      ...p,
      is_ready: p.id === user.id,
    }));

    setPlayers(localPlayers);
  }, [currentGame, user]);

  useEffect(() => {
    if (players.length > 0 && players.every((pl) => pl.is_ready)) {
      handleAllAccepted();
    }
  }, [players]);

  const handleAllAccepted = () => {
    console.log('All players are ready!');
    router.replace('/gameScreen')
    
  };

  const handleStartGame = async() => {
    if(!currentGame){
        return
    }
    await initiateGame(currentGame)
    setGameInitiated(true)
    // scheduleNotification();
   
    setConfirmTitle('Waiting')
  };

  const handleAccept = () => {
    setInviteAccepted(true);
    setConfirmTitle('Waiting for Opponents')
    setGameInitiated(true)
    // Optionally update player status or emit socket event
  };
  
  const handleDecline = (userId: string) => {
    console.log('Player declined invitation');
    setPlayers(players.filter(p=>p.id !== userId))
  };

  const inivitedPlayerNotAccceptedYet = !isCreator && !invitedAccepted && !gameInitiated;
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ConfirmGameHeader topic={currentGame?.topic?.title ?? ''} />
      {<PlayersGrid players={players} user={user} bounceAnimations={bounceAnimations} gameInitiated={gameInitiated} />}
       <StartGameButton onPress={handleStartGame} scale={startBtnScale} title={confirmTitle} gameInitiated={gameInitiated}/> 
      {inivitedPlayerNotAccceptedYet && (
        <AcceptOrDeclineInviteButtons
            scale={startBtnScale}
            onAccept={handleAccept}
            onDecline={handleDecline}
        />
        )}
    </SafeAreaView>
  );
}
