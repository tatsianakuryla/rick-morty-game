import type { GameStartArguments } from '../../types';
import type { MortyType } from '../../morties/mortyRegistry';

export class GameState {
    private readonly _boxCount: number;
    private readonly _mortyType: MortyType;

    constructor(gameStartArguments: GameStartArguments) {
        this._boxCount = gameStartArguments.boxCount;
        this._mortyType = gameStartArguments.mortyType;
    }

    public get boxCount(): number {
        return this._boxCount;
    }

    public get mortyType(): MortyType {
        return this._mortyType;
    }
}
