import type { GameConfig } from '../../shared/types';
import { GameState } from '../GameState/GameState';
import type { Morty } from '../morty/Morty/Morty';
import { MortyFactories } from '../morty/mortyRegistry';
import { GameMessages } from '../../adapters/Messenger/constants';
import { MortyRandomizer } from '../../crypto/MortyRandomizer/MortyRandomizer';
import { HmacGenerator } from '../../crypto/HmacGenerator/HmacGenerator';
import { isPositiveInteger, trimToLowerCase } from '../../shared/utils/helpers';
import {
    EXCHANGE_AGREE_ANSWER,
    KEEP_BOX_ANSWER,
    NUM_UNSET,
    STR_UNSET,
} from '../../shared/constants/constants';
import type { ExchangeResult } from './gameLogic.type';

export class GameLogic {
    public config: GameConfig;
    public state: GameState;
    private _morty: Morty;
    private _hmacKey1: string = STR_UNSET;
    private _hmacKey2: string = STR_UNSET;
    private _mortySecret1: number = NUM_UNSET;
    private _mortySecret2: number = NUM_UNSET;
    private _rickOffset1: number = NUM_UNSET;
    private _rickOffset2: number = NUM_UNSET;
    private _secondCandidateBox: number = NUM_UNSET;
    private _gunBox: number = NUM_UNSET;
    private _rickChoice: number = NUM_UNSET;

    constructor(config: GameConfig) {
        this.config = config;
        this._morty = MortyFactories[config.mortyType]();
        this.state = new GameState();
    }

    public get rickChoice(): number {
        return this._rickChoice;
    }

    public get secondCandidateBox(): number {
        return this._secondCandidateBox;
    }

    public get gunBox(): number {
        return this._gunBox;
    }

    public async start(): Promise<void> {
        this.state.currentRound++;
        await this._morty.startRound();
    }

    public initFirstCommitment(): void {
        this._hmacKey1 = this.generateOneTimeKey();
        this._mortySecret1 = this.generateMortyRandomValue(this.config.boxCount);
    }

    public initSecondCommitment(): void {
        this._hmacKey2 = this.generateOneTimeKey();
        this._mortySecret2 = this.generateMortyRandomValue(this.config.boxCount - 1);
    }

    public getFirstHmac(): string {
        return GameMessages.hmac(1, this.generateHmac(this._mortySecret1, this._hmacKey1));
    }

    public getSecondHmac(): string {
        return GameMessages.hmac(2, this.generateHmac(this._mortySecret2, this._hmacKey2));
    }

    public computeGunBox(): void {
        this._gunBox = (this._mortySecret1 + this._rickOffset1) % this.config.boxCount;
    }

    public setRickOffset1(value: number): void {
        this._rickOffset1 = value;
    }

    public setRickOffset2(value: number): void {
        this._rickOffset2 = value;
    }

    public setRickChoice(value: number): void {
        this._rickChoice = value;
    }

    public setSecondCandidateBox(value: number): void {
        this._secondCandidateBox = value;
    }

    public selectSecondCandidateBox(): void {
        if (!this.needsSecondStage(this._rickChoice, this._gunBox)) {
            this._secondCandidateBox = this._gunBox;
            return;
        }
        const candidates = this.buildCandidates(this.config.boxCount, this._rickChoice);
        this._secondCandidateBox =
            candidates.length === 0 ? this._rickChoice : this.pickByCommit(candidates);
    }

    public isWon(): boolean {
        return this._rickChoice === this._gunBox;
    }

    public isValidRickInputValue(value: string, limit: number): boolean {
        if (!isPositiveInteger(value)) return false;
        const num = Number(value);
        return num >= 0 && num < limit;
    }

    public parseExchange(input: string): ExchangeResult {
        const num = Number(input);
        if (num === EXCHANGE_AGREE_ANSWER) return 'swap';
        if (num === KEEP_BOX_ANSWER) return 'keep';
        return null;
    }

    public parseYesNo(input: string): boolean | null {
        const value = trimToLowerCase(input);
        if (value === 'y' || value === 'yes') return true;
        if (value === 'n' || value === 'no') return false;
        return null;
    }

    public getFirstSecretInfo(): string {
        return GameMessages.randomValueInfo(1, this._mortySecret1);
    }

    public getFirstKeyInfo(): string {
        return GameMessages.keyInfo(1, this._hmacKey1);
    }

    public getSecondSecretInfo(): string {
        return GameMessages.randomValueInfo(2, this._mortySecret2);
    }

    public getSecondKeyInfo(): string {
        return GameMessages.keyInfo(2, this._hmacKey2);
    }

    public getFirstRandomResultInfo(): string {
        return this.getRandomResultInfo(
            1,
            this._rickOffset1,
            this._mortySecret1,
            this.config.boxCount,
            this._gunBox,
        );
    }

    public getSecondRandomResultInfo(): string {
        return this.getRandomResultInfo(
            2,
            this._rickOffset2,
            this._mortySecret2,
            this.config.boxCount - 1,
            this.getSecondNumber(this.config.boxCount - 1),
        );
    }

    public needsSecondStage(rickChoice: number, gunBox: number): boolean {
        return rickChoice === gunBox;
    }

    public pickLowestCandidate(exclude: number): number {
        return exclude === 0 ? 1 : 0;
    }

    public resetValues(): void {
        this._hmacKey1 = STR_UNSET;
        this._hmacKey2 = STR_UNSET;
        this._mortySecret1 = NUM_UNSET;
        this._mortySecret2 = NUM_UNSET;
        this._secondCandidateBox = NUM_UNSET;
        this._gunBox = NUM_UNSET;
        this._rickChoice = NUM_UNSET;
        this._rickOffset1 = NUM_UNSET;
        this._rickOffset2 = NUM_UNSET;
    }

    private generateOneTimeKey(): string {
        return MortyRandomizer.getOneTimeKey();
    }

    private generateMortyRandomValue(max: number): number {
        return MortyRandomizer.getSecureInteger(max);
    }

    private getSecondNumber(length: number): number {
        return (this._mortySecret2 + this._rickOffset2) % length;
    }

    private generateHmac(secret: number, key: string): string {
        return HmacGenerator.getHMAC(secret, key);
    }

    private buildCandidates(boxCount: number, exclude: number): number[] {
        return Array.from({ length: boxCount }, (_, i) => i).filter((i) => i !== exclude);
    }

    private pickByCommit(candidates: number[]): number {
        const index = this.getSecondNumber(candidates.length);
        const picked = candidates[index];
        if (picked === undefined) throw new Error('Candidate index out of bounds');
        return picked;
    }

    private getRandomResultInfo(
        resultNumber: 1 | 2,
        rickOffset: number,
        secret: number,
        boxCount: number,
        result: number,
    ): string {
        return GameMessages.randomResultInfo(resultNumber, rickOffset, secret, boxCount, result);
    }
}
