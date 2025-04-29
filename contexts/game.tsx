import { createContext } from "react";
import { GameType } from "@/types/game";

interface GameContextType {
  currentGame: GameType | undefined;
  setCurrentGame: (game: GameType | undefined) => void;
}

export const GameContext = createContext<GameContextType>({
  currentGame: {},
  setCurrentGame: () => {},
});
