export const MIN_BOXES_QUANTITY = 3;
export const MAX_BOXES_QUANTITY = 20;
export const MortyPathMap = new Map([
    ['classic', './ClassicMorty.ts'],
    ['lazy', './LazyMorty.ts'],
]);

export const AllowedMortyPaths = new Set<string>(MortyPathMap.values());