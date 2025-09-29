import type { GameStartArguments } from '../../types';

export class GameState {
    private readonly _gameStartArguments: GameStartArguments;

    constructor(gameStartArguments: GameStartArguments) {
        this._gameStartArguments = gameStartArguments;
    }

    public get gameStartArguments(): GameStartArguments {
        return this._gameStartArguments;
    }
}
