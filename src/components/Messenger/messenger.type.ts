import type { CliErrors } from './constants';

export type ArgumentErrors = keyof typeof CliErrors;

export enum Speaker {
    Morty = 'Morty',
    Rick = 'Rick',
    System = 'System',
}
