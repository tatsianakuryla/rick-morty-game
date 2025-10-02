import { gameLogic } from '../../main';
import { Messenger, readLine } from '../../components/Messenger/Messenger';
import { GameMessages } from '../../components/Messenger/constants';
import { Speaker } from '../../components/Messenger/messenger.type';

export abstract class Morty {
    private readonly RICK_PROMPT = `${Speaker.Rick}: `;

    public async startRound(): Promise<void> {
        gameLogic.resetValues();
        gameLogic.initFirstCommitment();
        this.showRoundIntro();
        if (!(await this.promptRick(this.handleRickOffset1))) return;
    }

    protected async promptRick(validate: (answer: string) => void | Promise<void>): Promise<boolean> {
        try {
            const answer = await readLine!.question(this.RICK_PROMPT);
            if (this.isExit(answer)) {
                this.exit();
                return false;
            }
            await validate.call(this, answer);
            return true;
        } catch (err: any) {
            if (err?.code === 'ABORT_ERR' || err?.name === 'AbortError') {
                this.exit();
                return false;
            }
            throw err;
        }
    }

    protected async hideGun(value: number): Promise<void> {
        gameLogic.setRickOffset1(value);
        gameLogic.computeGunBox();
        Messenger.showMessage(GameMessages.askRickGuessWhereIsGun(gameLogic.config.boxCount));
        if (!(await this.promptRick(this.handleRickInitialChoice))) return;
    }

    protected async handleRickOffset1(answer: string): Promise<void> {
        if (!gameLogic.isValidRickInputValue(answer, gameLogic.config.boxCount)) {
            Messenger.showMessage(GameMessages.wrongValue(gameLogic.config.boxCount));
            await this.promptRick(this.handleRickOffset1);
            return;
        }
        await this.hideGun(Number(answer));
    }

    protected async handleRickInitialChoice(answer: string): Promise<void> {
        if (!gameLogic.isValidRickInputValue(answer, gameLogic.config.boxCount)) {
            Messenger.showMessage(GameMessages.wrongValue(gameLogic.config.boxCount));
            await this.promptRick(this.handleRickInitialChoice);
            return;
        }
        gameLogic.setRickChoice(Number(answer));
        await this.initSecondCommitmentAndPrompt();
    }

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
        if (!(await this.promptRick(this.validateExchangeResponse))) return;
    }

    protected async handleRickOffset2(answer: string): Promise<void> {
        if (!gameLogic.isValidRickInputValue(answer, gameLogic.config.boxCount - 1)) {
            Messenger.showMessage(GameMessages.wrongValue(gameLogic.config.boxCount - 1));
            await this.promptRick(this.handleRickOffset2);
            return;
        }
        this.finalizeSecondStage(answer);
        await this.askForExchange();
    }

    protected finalizeSecondStage(answer: string): void {
        gameLogic.setRickOffset2(Number(answer));
        gameLogic.selectSecondCandidateBox();
        Messenger.showMessage(
            GameMessages.infoKeepTwoBoxes(gameLogic.rickChoice, gameLogic.secondCandidateBox),
        );
    }

    protected async validateExchangeResponse(answer: string) {
        const decision = gameLogic.parseExchange(answer);
        if (!decision) {
            Messenger.showMessage(GameMessages.wrongExchangeValue);
            await this.promptRick(this.validateExchangeResponse);
            return;
        }
        if (decision === 'swap') gameLogic.setRickChoice(gameLogic.secondCandidateBox);
        await this.showFinalOutcome();
    }

    protected async showFinalOutcome(): Promise<void> {
        Messenger.showMessage(GameMessages.exchangeApprove(gameLogic.rickChoice));
        this.revealCommitments();
        if (gameLogic.isWon()) {
            Messenger.showMessage(GameMessages.winInfo);
        } else {
            Messenger.showMessage(GameMessages.lostInfo);
        }
        Messenger.showMessage(GameMessages.askToStartNextRound);
        if (!(await this.promptRick(this.handlePlayAgainDecision))) return;
    }

    protected async handlePlayAgainDecision(answer: string) {
        const decision = gameLogic.parseYesNo(answer);
        if (decision === null) {
            Messenger.showMessage(GameMessages.invalidNextRoundResponse);
            await this.promptRick(this.handlePlayAgainDecision);
            return;
        }
        if (decision === false) {
            this.exit();
            return;
        }
        await gameLogic.start();
    }

    protected revealCommitments(): void {
        this.revealFirstCommitment();
        this.revealSecondCommitment();
        if (!gameLogic.needsSecondStage(gameLogic.rickChoice, gameLogic.gunBox)) {
            Messenger.showMessage(GameMessages.secondCommitmentNotUsed);
            Messenger.showMessage(GameMessages.finalBoxNumber(gameLogic.secondCandidateBox));
        }
    }

    protected showRoundIntro(): void {
        Messenger.open();
        Messenger.showMessage(`Round: ${gameLogic.state.currentRound}`);
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
        if (gameLogic.needsSecondStage(gameLogic.rickChoice, gameLogic.gunBox)) {
            Messenger.showMessage(GameMessages.finalBoxNumber(gameLogic.secondCandidateBox));
        }
    }

    protected isExit(input: string): boolean {
        return input.trim().toLowerCase() === 'exit';
    }

    protected exit(): void {
        gameLogic.resetValues();
        Messenger.showMessage(GameMessages.exitGame);
        Messenger.close();
    }
}
