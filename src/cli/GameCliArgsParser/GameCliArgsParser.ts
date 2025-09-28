import { Messenger } from '../Messager/Messenger';
import type { ArgumentErrors } from '../arguments.types';
import type { GameStartArguments } from '../../types';
import {
    AllowedMortyPaths,
    MAX_BOXES_QUANTITY,
    MIN_BOXES_QUANTITY, MortyPathMap,
} from '../../constants/constants';
import {getKeyByValue, isPositiveInteger} from '../../utils/helpers';

export class GameCliArgsParser {
    public static parse(): GameStartArguments {
        const boxCount = this.getBoxCount();
        const mortyType = this.getMortyType();
        this.success(boxCount);
        return { boxCount, mortyType };
    }

    private static getBoxCount(): number {
        const boxCountArg = process.argv[2];
        if (!boxCountArg) this.exitWithError('boxesMissing');
        return this.parseBoxCount(boxCountArg);
    }

    private static parseBoxCount(boxesInput: string): number {
        if (!isPositiveInteger(boxesInput)) this.exitWithError('boxesWrongFormat');
        const boxCount = Number.parseInt(boxesInput, 10);
        if (
            !Number.isSafeInteger(boxCount) ||
            boxCount < MIN_BOXES_QUANTITY ||
            boxCount > MAX_BOXES_QUANTITY
        )
            this.exitWithError('boxesWrongFormat');
        return boxCount;
    }

    private static getMortyType(): string {
        const mortyPathArg = process.argv[3];
        if (!mortyPathArg) this.exitWithError('mortyPathMissing');
        return this.resolveMortyType(mortyPathArg);
    }

    private static resolveMortyType(pathInput: string): string {
        if (!this.isValidMortyFilePath(pathInput)) {
            this.exitWithError('mortyPathInvalid');
        }
        const mortyType = getKeyByValue(MortyPathMap, pathInput);
        if (!mortyType) {
            this.exitWithError('mortyPathInvalid');
        }
        return mortyType;
    }

    private static isValidMortyFilePath(path: string): boolean {
        return AllowedMortyPaths.has(path);
    }

    private static success(boxCount: number): void {
        Messenger.showStartMessage(boxCount);
    }

    private static exitWithError(errorType: ArgumentErrors): never {
        Messenger.showError(errorType);
        process.exit(1);
    }
}
