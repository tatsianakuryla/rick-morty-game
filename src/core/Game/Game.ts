import { GameState } from '../GameState/GameState';
import { GameCliArgsParser } from '../../cli/GameCliArgsParser/GameCliArgsParser';
import { type Morty } from '../../morties/Morty/Morty';
import { MortyFactoryMap } from '../../constants/constants';

export class Game {
    private _morty!: Morty;

    public init(): void {
        const gameState = new GameState(GameCliArgsParser.parse());
        this._morty = this.chooseMorty(gameState.gameStartArguments.mortyType);
    }

    private chooseMorty(mortyType: string): Morty {
        const morty = MortyFactoryMap.get(mortyType);
        if (!morty) {
            throw new Error(`Morty ${mortyType} not found!`);
        }
        return morty();
    }
}