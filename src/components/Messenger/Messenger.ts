import { CliErrors } from './constants';
import { type ArgumentErrors, Speaker } from './messenger.type';
import { createInterface, Interface } from 'node:readline/promises';
import process from 'node:process';

export let readLine: Interface | null = null;

export class Messenger {
    public static open(prompt = ''): void {
        if (!readLine) {
            readLine = createInterface({ input: process.stdin, output: process.stdout });
            readLine.setPrompt(prompt);
        }
    }

    public static close(): void {
        if (readLine) {
            readLine.close();
            readLine = null;
        }
    }

    public static showError(errorType: ArgumentErrors = 'defaultUsage'): void {
        console.error(`${Speaker.System}: ${CliErrors[errorType]}`);
    }

    public static showMessage(text: string, speaker: Speaker = Speaker.Morty): void {
        console.log(`${speaker}: ${text}`);
    }
}
