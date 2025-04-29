import { useContext, useState } from "react";
import { GameContext } from "@/contexts/game";

export const useGame = () => {
    const value  = useContext(GameContext);
    if(!value) {
        throw new Error('useGame must be used inside an GameContextProvider');
    }

    return value;
}