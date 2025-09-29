import { DetailedError, GameMessages } from './constants';
import { type ArgumentErrors, Speaker } from './messanger.type';

export class Messenger {
    public static showError(errorType: ArgumentErrors = 'default'): void {
        console.error(`${Speaker.System}: ${DetailedError[errorType]}`);
    }

    public static showStartMessage(boxCount: number): void {
        console.log(`${Speaker.Morty}: ${GameMessages.start(boxCount)}`);
    }

    public static infoMessage(text: string): void {
        console.log(`${Speaker.Morty}: ${text}`);
    }
}
