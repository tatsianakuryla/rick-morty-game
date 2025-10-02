import { randomBytes, randomInt } from 'node:crypto';
import { CliErrors } from '../../adapters/Messenger/constants';

export class MortyRandomizer {
    public static getOneTimeKey(): string {
        return randomBytes(32).toString('hex');
    }

    public static getSecureInteger(maximum: number): number {
        this.validateMax(maximum);
        return randomInt(0, maximum);
    }

    private static validateMax(maximum: number): void {
        if (Number.isNaN(maximum) || !Number.isFinite(maximum)) {
            throw new TypeError(CliErrors.notFinite);
        }
        if (!Number.isInteger(maximum)) {
            throw new TypeError(CliErrors.notInteger);
        }
        if (maximum <= 0) {
            throw new RangeError(CliErrors.nonPositive);
        }
        if (maximum > Number.MAX_SAFE_INTEGER) {
            throw new RangeError(CliErrors.tooLarge);
        }
    }
}
