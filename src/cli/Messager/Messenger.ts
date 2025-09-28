import { type ArgumentErrors, Speaker } from '../arguments.types';
import { DetailedError, GameMessages } from '../constants';

export class Messenger {
    public static showError(errorType: ArgumentErrors = 'default'): void {
        console.error(`${Speaker.System}: ${DetailedError[errorType]}`);
    }

    public static showStartMessage(boxCount: number): void {
        console.log(`${Speaker.Morty}: ${GameMessages.start(boxCount)}`);
    }
}
