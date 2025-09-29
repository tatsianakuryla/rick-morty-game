import { Game } from './core/Game/Game';
import { GameCliArgsParser } from './cli/GameCliArgsParser/GameCliArgsParser';
import type { GameConfig } from './types';

const gameConfig: GameConfig = GameCliArgsParser.parse();
const game = new Game(gameConfig);
