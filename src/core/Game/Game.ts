import type { GameConfig } from '../../types';
import { GameState } from '../GameState/GameState';
import type { Morty } from '../../morties/Morty/Morty';
import { MortyFactories } from "../../morties/mortyRegistry";

export class Game {
    public readonly config: GameConfig;
    public readonly morty: Morty;
    public readonly state: GameState;

    constructor(config: GameConfig) {
        this.config = config;
        this.morty = MortyFactories[config.mortyType]();
        this.state = new GameState();
    }
}
