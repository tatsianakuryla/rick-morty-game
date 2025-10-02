export function isNotNegativeInteger(value: string): boolean {
    return /^\d+$/.test(value);
}

export function getKeyByValue<T extends Record<string, string>>(
    object: T,
    value: T[keyof T],
): keyof T | undefined {
    return Object.keys(object).find((k) => object[k] === value);
}

export function trimToLowerCase(str: string): string {
    return str.trim().toLowerCase();
}

function hasCode(value: unknown): value is { code: unknown } {
    return typeof value === 'object' && value !== null && 'code' in value;
}

function hasName(value: unknown): value is { name: unknown } {
    return typeof value === 'object' && value !== null && 'name' in value;
}

export function isAbortError(value: unknown): value is { code?: unknown; name?: unknown } {
    return (
        (hasCode(value) && value.code === 'ABORT_ERR') ||
        (hasName(value) && value.name === 'AbortError')
    );
}
