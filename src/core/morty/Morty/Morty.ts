import { gameLogic } from '../../../main';
import { Messenger, readLine } from '../../../adapters/Messenger/Messenger';
import { GameMessages } from '../../../adapters/Messenger/constants';
import { Speaker } from '../../../adapters/Messenger/messenger.type';
import { isAbortError } from '../../../shared/utils/helpers';

export abstract class Morty {
    private readonly RICK_PROMPT = `${Speaker.Rick}: `;

    public async startRound(): Promise<void> {
        gameLogic.initFirstCommitment();
        this.showRoundIntro();
        if (!(await this.promptRick(this.handleRickOffset1))) return;
    }

    protected async promptRick(validate: (answer: string) => Promise<void>): Promise<boolean> {
        try {
            const answer = await readLine!.question(this.RICK_PROMPT);
            if (this.isExit(answer)) {
                this.exit();
                return false;
            }
            await validate(answer);
            return true;
        } catch (error: unknown) {
            if (isAbortError(error)) {
                console.log();
                this.exit();
                return false;
            }
            throw error;
        }
    }

    protected async hideGun(value: number): Promise<void> {
        gameLogic.setRickOffset1(value);
        gameLogic.computeGunBox();
        Messenger.showMessage(GameMessages.askRickGuessWhereIsGun(gameLogic.config.boxCount));
        if (!(await this.promptRick(this.handleRickInitialChoice))) return;
    }

    protected handleRickOffset1 = async (answer: string): Promise<void> => {
        if (!gameLogic.isValidRickInputValue(answer, gameLogic.config.boxCount)) {
            Messenger.showMessage(GameMessages.wrongValue(gameLogic.config.boxCount));
            await this.promptRick(this.handleRickOffset1);
            return;
        }
        await this.hideGun(Number(answer));
    };

    protected handleRickInitialChoice = async (answer: string): Promise<void> => {
        if (!gameLogic.isValidRickInputValue(answer, gameLogic.config.boxCount)) {
            Messenger.showMessage(GameMessages.wrongValue(gameLogic.config.boxCount));
            await this.promptRick(this.handleRickInitialChoice);
            return;
        }
        gameLogic.setRickChoice(Number(answer));
        gameLogic.setInitialRickChoice(Number(answer));
        await this.initSecondCommitmentAndPrompt();
    };

    protected async initSecondCommitmentAndPrompt(): Promise<void> {
        gameLogic.initSecondCommitment();
        this.showSecondCommitmentPrompt();
        if (!(await this.promptRick(this.handleRickOffset2))) return;
    }

    protected showSecondCommitmentPrompt(): void {
        Messenger.showMessage(GameMessages.letKeepSecondBoxInGame);
        Messenger.showMessage(gameLogic.getSecondHmac());
        Messenger.showMessage(
            GameMessages.askRickEnterValueForRandom2(gameLogic.config.boxCount - 1),
        );
    }

    protected async askForExchange(): Promise<void> {
        Messenger.showMessage(GameMessages.askForExchange());
        if (!(await this.promptRick(this.validateSwitchResponse))) return;
    }

    protected handleRickOffset2 = async (answer: string): Promise<void> => {
        if (!gameLogic.isValidRickInputValue(answer, gameLogic.config.boxCount - 1)) {
            Messenger.showMessage(GameMessages.wrongValue(gameLogic.config.boxCount - 1));
            await this.promptRick(this.handleRickOffset2);
            return;
        }
        this.finalizeSecondStage(answer);
        await this.askForExchange();
    };

    protected finalizeSecondStage(answer: string): void {
        gameLogic.setRickOffset2(Number(answer));
        gameLogic.selectSecondCandidateBox();
        Messenger.showMessage(
            GameMessages.infoKeepTwoBoxes(gameLogic.rickChoice, gameLogic.secondCandidateBox),
        );
    }

    protected validateSwitchResponse = async (answer: string) => {
        const decision = gameLogic.parseExchange(answer);
        if (decision === null) {
            Messenger.showMessage(GameMessages.wrongExchangeValue);
            await this.promptRick(this.validateSwitchResponse);
            return;
        }
        gameLogic.setSwitchResponse(decision);
        if (decision) {
            gameLogic.setRickChoice(gameLogic.secondCandidateBox);
        }
        await this.showFinalOutcome();
    };

    protected async showFinalOutcome(): Promise<void> {
        Messenger.showMessage(GameMessages.exchangeApprove(gameLogic.rickChoice));
        this.revealCommitments();
        if (gameLogic.isWon()) {
            Messenger.showMessage(GameMessages.winInfo);
        } else {
            Messenger.showMessage(GameMessages.lostInfo);
        }
        gameLogic.finishRound();
        Messenger.showMessage(GameMessages.askToStartNextRound);
        if (!(await this.promptRick(this.handlePlayAgainDecision))) return;
    }

    protected handlePlayAgainDecision = async (answer: string) => {
        const decision = gameLogic.parseYesNo(answer);
        if (decision === null) {
            Messenger.showMessage(GameMessages.invalidNextRoundResponse);
            await this.promptRick(this.handlePlayAgainDecision);
            return;
        } else if (!decision) {
            this.exit();
            return;
        }
        await gameLogic.start();
    };

    protected revealCommitments(): void {
        this.revealFirstCommitment();
        if (gameLogic.needsSecondStage(gameLogic.initialRickChoice, gameLogic.gunBox)) {
            this.revealSecondCommitment();
        } else {
            Messenger.showMessage(GameMessages.secondCommitmentNotUsed);
        }
    }

    protected showRoundIntro(): void {
        Messenger.open();
        Messenger.showMessage(`Round: ${gameLogic.currentRound}`);
        Messenger.showMessage(GameMessages.start(gameLogic.config.boxCount));
        Messenger.showMessage(gameLogic.getFirstHmac());
        Messenger.showMessage(GameMessages.askRickEnterValueForRandom(gameLogic.config.boxCount));
    }

    protected revealFirstCommitment(): void {
        Messenger.showMessage(gameLogic.getFirstSecretInfo());
        Messenger.showMessage(gameLogic.getFirstKeyInfo());
        Messenger.showMessage(gameLogic.getFirstRandomResultInfo());
        Messenger.showMessage(GameMessages.finalBoxNumber(gameLogic.gunBox));
    }

    protected revealSecondCommitment(): void {
        Messenger.showMessage(gameLogic.getSecondSecretInfo());
        Messenger.showMessage(gameLogic.getSecondKeyInfo());
        Messenger.showMessage(gameLogic.getSecondRandomResultInfo());
        Messenger.showMessage(GameMessages.finalBoxNumber(gameLogic.secondCandidateBox));
    }

    protected isExit(input: string): boolean {
        return input.trim().toLowerCase() === 'exit';
    }

    protected exit(): void {
        gameLogic.endGame();
        Messenger.showMessage(GameMessages.exitGame);
        Messenger.close();
    }
}
