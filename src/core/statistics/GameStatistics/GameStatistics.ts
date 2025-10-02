import type { SwitchResponse } from '../../GameLogic/gameLogic.type';
import type { BoxSummary, RoundSummary } from '../types';
import { roundToThreeDecPlaces } from '../../../shared/utils/helpers';
import { Table } from '../TableGenerator/Table';
import { gameLogic } from '../../../main';

export class GameStatistics {
    private readonly ESTIMATE_DEFAULT = '0.000';
    private rounds: RoundSummary[] = [];

    public accumulateRoundResults(
        currentRound: number,
        boxCount: number,
        isSwitched: SwitchResponse,
        isWon: boolean,
    ): void {
        this.rounds.push({ round: currentRound, boxCount, isSwitched, isWon });
    }

    public printSummary(): void {
        const table = new Table();
        table.print(this.getTotals(this.rounds, gameLogic.config.boxCount));
    }

    private getTotals(rounds: RoundSummary[], boxCount: number): BoxSummary {
        const switchedRounds = rounds.filter((round) => round.isSwitched);
        const stayedRounds = rounds.filter((round) => !round.isSwitched);
        const switchedPlayed = switchedRounds.length;
        const stayedPlayed = stayedRounds.length;
        const switchedWon = switchedRounds.filter((round) => round.isWon).length;
        const stayedWon = stayedRounds.filter((round) => round.isWon).length;
        const switchEstimate =
            switchedPlayed > 0
                ? roundToThreeDecPlaces(switchedWon / switchedPlayed)
                : this.ESTIMATE_DEFAULT;
        const stayEstimate =
            stayedPlayed > 0
                ? roundToThreeDecPlaces(stayedWon / stayedPlayed)
                : this.ESTIMATE_DEFAULT;
        const switchExact = roundToThreeDecPlaces((boxCount - 1) / boxCount);
        const stayExact = roundToThreeDecPlaces(1 / boxCount);

        return {
            switchedPlayed,
            stayedPlayed,
            switchedWon,
            stayedWon,
            switchEstimate,
            stayEstimate,
            switchExact,
            stayExact,
        };
    }
}
