import { createHmac } from 'node:crypto';
import { CliErrors } from '../components/Messenger/constants';

export class HmacGenerator {
    public static getHMAC(value: number, key: string | Buffer | Uint8Array): string {
        this.validateValue(value);
        const finalKey = typeof key === 'string' ? this.keyFromHex(key) : Buffer.from(key);
        const buffer = Buffer.alloc(8);
        buffer.writeBigUInt64BE(BigInt(value), 0);
        return createHmac('sha3-256', finalKey).update(buffer).digest('hex');
    }

    private static keyFromHex(hex: string): Buffer {
        this.validateHexKey(hex);
        return Buffer.from(hex, 'hex');
    }

    private static validateHexKey(hexKey: string): void {
        const isHex = /^[0-9a-fA-F]+$/.test(hexKey) && hexKey.length % 2 === 0;
        const MIN_HEX_LEN = 64;
        if (!isHex || hexKey.length < MIN_HEX_LEN) {
            throw new TypeError(CliErrors.hmacKeyInvalid);
        }
    }

    private static validateValue(value: number): void {
        if (!Number.isInteger(value)) {
            throw new TypeError(CliErrors.hmacValueInvalid);
        }
        if (value < 0 || value > Number.MAX_SAFE_INTEGER) {
            throw new RangeError(CliErrors.hmacValueInvalid);
        }
    }
}
