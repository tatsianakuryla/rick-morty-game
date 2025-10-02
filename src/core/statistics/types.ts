import type { SwitchResponse } from '../GameLogic/gameLogic.type';

export interface RoundSummary {
    round: number;
    boxCount: number;
    isSwitched: SwitchResponse;
    isWon: boolean;
}

export interface BoxSummary {
    switchedPlayed: number;
    stayedPlayed: number;
    switchedWon: number;
    stayedWon: number;
    switchEstimate: string;
    stayEstimate: string;
    switchExact: string;
    stayExact: string;
}
