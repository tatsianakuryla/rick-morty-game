import type { Morty } from '../morties/Morty/Morty';
import { ClassicMorty } from '../morties/ClassicMorty/ClassicMorty';
import { LazyMorty } from '../morties/LazyMorty/LazyMorty';

export const MIN_BOXES_QUANTITY = 3;
export const MAX_BOXES_QUANTITY = 20;
export const MortyPathMap = new Map([
    ['classic', './ClassicMorty.ts'],
    ['lazy', './LazyMorty.ts'],
]);

export const MortyFactoryMap = new Map<string, () => Morty>([
    ['classic', () => new ClassicMorty()],
    ['lazy', () => new LazyMorty()],
]);

export const AllowedMortyPaths = new Set<string>(MortyPathMap.values());
