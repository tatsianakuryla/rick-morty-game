import { Game } from './core/Game/Game';
import { GameCliArgsParser } from './cli/GameCliArgsParser/GameCliArgsParser';
import type { GameConfig } from './types';
import { MortyRandomizer } from './MortyRandomizer/MortyRandomizer';

const gameConfig: GameConfig = GameCliArgsParser.parse();
export const game = new Game(gameConfig);
await game.start();
