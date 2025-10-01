import type { GameConfig } from '../../types';
import { GameState } from '../GameState/GameState';
import type { Morty } from '../../morties/Morty/Morty';
import { MortyFactories } from '../../morties/mortyRegistry';
import { Messenger } from '../../components/Messenger/Messenger';
import { GameMessages } from '../../components/Messenger/constants';

export class Game {
    public config: GameConfig;
    public morty: Morty;
    public state: GameState;

    constructor(config: GameConfig) {
        this.config = config;
        this.morty = MortyFactories[config.mortyType]();
        this.state = new GameState();
    }

    public async start(): Promise<void> {
        this.state.currentRound++;
        await this.morty.startRound();
    }
}
