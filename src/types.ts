import type { Morty } from './morties/Morty/Morty';
import type { MortyType } from './morties/mortyRegistry';

export interface GameConfig {
    readonly boxCount: number;
    readonly mortyType: MortyType;
}

export type MortyFactory = () => Morty;
