import type { SwitchResponse } from '../GameLogic/gameLogic.type';

export interface RoundSummary {
    round: number;
    boxCount: number;
    switched: SwitchResponse;
    win: boolean;
}
