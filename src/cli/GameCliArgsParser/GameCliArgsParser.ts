import { Messenger } from '../../adapters/Messenger/Messenger';
import { type GameConfig } from '../../shared/types/types';
import { MAX_BOXES_QUANTITY, MIN_BOXES_QUANTITY } from '../../shared/constants/constants';
import { getKeyByValue, isNotNegativeInteger } from '../../shared/utils/helpers';
import type { ArgumentErrors } from '../../adapters/Messenger/messenger.type';
import {
    AllowedMortyPaths,
    type MortyPath,
    MortyPaths,
    type MortyType,
} from '../../core/morty/mortyRegistry';

export class GameCliArgsParser {
    public static parse(): GameConfig {
        const boxCount = this.getBoxCount();
        const mortyType = this.getMortyType();
        return { boxCount, mortyType };
    }

    private static getBoxCount(): number {
        const boxCountArg = process.argv[2];
        if (!boxCountArg) this.exitWithError('boxesMissing');
        return this.parseBoxCount(boxCountArg);
    }

    private static parseBoxCount(boxesInput: string): number {
        if (!isNotNegativeInteger(boxesInput)) this.exitWithError('boxesWrongFormat');
        const boxCount = Number.parseInt(boxesInput, 10);
        if (
            !Number.isSafeInteger(boxCount) ||
            boxCount < MIN_BOXES_QUANTITY ||
            boxCount > MAX_BOXES_QUANTITY
        )
            this.exitWithError('boxesWrongFormat');
        return boxCount;
    }

    private static getMortyType(): MortyType {
        const mortyPathArg = process.argv[3];
        if (!mortyPathArg) this.exitWithError('mortyPathMissing');
        return this.resolveMortyType(mortyPathArg);
    }

    private static resolveMortyType(pathInput: string): MortyType {
        if (!this.isValidMortyFilePath(pathInput)) {
            this.exitWithError('mortyPathInvalid');
        }
        const mortyType = getKeyByValue(MortyPaths, pathInput);
        if (!mortyType) {
            this.exitWithError('mortyPathInvalid');
        }
        return mortyType;
    }

    private static isValidMortyFilePath(path: string): path is MortyPath {
        return AllowedMortyPaths.has(path);
    }

    private static exitWithError(errorType: ArgumentErrors): never {
        Messenger.showError(errorType);
        process.exit(1);
    }
}
