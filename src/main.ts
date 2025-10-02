import { GameLogic } from './core/GameLogic/GameLogic';
import { GameCliArgsParser } from './cli/GameCliArgsParser/GameCliArgsParser';
import type { GameConfig } from './types';
import { MortyRandomizer } from './MortyRandomizer/MortyRandomizer';

const gameConfig: GameConfig = GameCliArgsParser.parse();
export const gameLogic = new GameLogic(gameConfig);
await gameLogic.start();
