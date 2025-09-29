export function isPositiveInteger(value: string): boolean {
    return /^\d+$/.test(value);
}

export function getKeyByValue<T extends Record<string, string>>(
    obj: T,
    value: T[keyof T],
): keyof T | undefined {
    return Object.keys(obj).find((k) => obj[k] === value);
}
