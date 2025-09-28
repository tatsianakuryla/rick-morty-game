export function isPositiveInteger(value: string): boolean {
    return /^\d+$/.test(value);
}

export function getKeyByValue(map: Map<string, string>, value: string): string | undefined {
    return [...map.entries()].find(([, v]) => v === value)?.[0];
}
