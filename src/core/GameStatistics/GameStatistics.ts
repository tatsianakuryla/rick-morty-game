import type { SwitchResponse } from '../GameLogic/gameLogic.type';
import type { RoundSummary } from './gameStatistics.type';

export class GameStatistics {
    private rounds: RoundSummary[] = [];

    public accumulateRoundResults(
        currentRound: number,
        boxCount: number,
        switched: SwitchResponse,
        win: boolean,
    ): void {
        this.rounds.push({ round: currentRound, boxCount, switched, win });
    }

    public printSummary(): void {}

    private getTotals() {
        const played = this.rounds.length;
        const wins = this.rounds.filter((round) => round.win).length;
        const switches = this.rounds.filter((round) => round.switched).length;
        return { played, wins, losses: played - wins, switches };
    }
}
