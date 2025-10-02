import type { Morty } from '../../core/morty/Morty/Morty';
import type { MortyType } from '../../core/morty/mortyRegistry';

export interface GameConfig {
    boxCount: number;
    readonly mortyType: MortyType;
}

export type MortyFactory = () => Morty;
