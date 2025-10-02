import { Messenger } from '../../components/Messenger/Messenger';
import { GameMessages } from '../../components/Messenger/constants';
import { gameLogic } from '../../main';
import { Morty } from '../Morty/Morty';

export class LazyMorty extends Morty {
    protected async initSecondCommitmentAndPrompt(): Promise<void> {
        if (gameLogic.rickChoice !== gameLogic.gunBox) {
            gameLogic.setSecondCandidateBox(gameLogic.gunBox);
        } else {
            const second = gameLogic.pickLowestCandidate(gameLogic.rickChoice);
            gameLogic.setSecondCandidateBox(second);
        }
        Messenger.showMessage(
            GameMessages.infoKeepTwoBoxes(gameLogic.rickChoice, gameLogic.secondCandidateBox),
        );
        await this.askForExchange();
    }

    protected revealSecondCommitment(): void {
        Messenger.showMessage(GameMessages.secondCommitmentNotUsedLazy);
    }
}
