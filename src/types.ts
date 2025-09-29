import type { Morty } from './morties/Morty/Morty';
import type { MortyType } from './morties/mortyRegistry';

export interface GameStartArguments {
    boxCount: number;
    mortyType: MortyType;
}

export type MortyFactory = () => Morty;
