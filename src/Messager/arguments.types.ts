import type { DetailedError } from '../cli/constants';

export type ArgumentErrors = keyof typeof DetailedError;

export enum Speaker {
    Morty = 'Morty',
    Rick = 'Rick',
    System = 'System',
}
