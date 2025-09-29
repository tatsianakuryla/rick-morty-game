import { ClassicMorty } from './ClassicMorty/ClassicMorty';
import { LazyMorty } from './LazyMorty/LazyMorty';
import type { MortyFactory } from '../types';

export const MortyFactories = {
    classic: () => new ClassicMorty(),
    lazy: () => new LazyMorty(),
} as const satisfies Record<string, MortyFactory>;

export type MortyType = keyof typeof MortyFactories;

export const MortyPaths = {
    classic: './ClassicMorty.ts',
    lazy: './LazyMorty.ts',
} as const;

export type MortyPath = (typeof MortyPaths)[MortyType];

export const AllowedMortyPaths: ReadonlySet<string> = new Set(Object.values(MortyPaths));
