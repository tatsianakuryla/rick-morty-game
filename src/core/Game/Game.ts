import { GameState } from '../GameState/GameState';
import { GameCliArgsParser } from '../../cli/GameCliArgsParser/GameCliArgsParser';
import { type Morty } from '../../morties/Morty/Morty';
import { MortyFactories, type MortyType } from '../../morties/mortyRegistry';

export class Game {
    private readonly _morty: Morty;
    private _state: GameState;

    constructor() {
        this._state = new GameState(GameCliArgsParser.parse());
        this._morty = this.createMorty(this._state.mortyType);
    }

    public get morty(): Morty {
        return this._morty;
    }

    private createMorty(mortyType: MortyType): Morty {
        const morty = MortyFactories[mortyType];
        if (!morty) {
            throw new Error(`Morty ${mortyType} not found!`);
        }
        return morty();
    }
}
