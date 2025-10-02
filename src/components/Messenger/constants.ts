import {
    EXCHANGE_AGREE_ANSWER,
    KEEP_BOX_ANSWER,
    MAX_BOXES_QUANTITY,
    MIN_BOXES_QUANTITY,
} from '../../constants/constants';

export const USAGE_HELP = [
    'Usage:',
    '  npm start -- <boxCount> <mortyPath>',
    '',
    'Where:',
    `  <boxCount>  Integer in [${MIN_BOXES_QUANTITY}..${MAX_BOXES_QUANTITY}]`,
    '  <mortyPath> Path to a Morty implementation module, e.g.: ./LazyMorty.ts or ./ClassicMorty.ts',
].join('\n');

export const CliErrors = {
    boxesMissing: `Missing <boxCount> argument.\n${USAGE_HELP}`,
    boxesWrongFormat: `<boxCount> must be an integer between ${MIN_BOXES_QUANTITY} and ${MAX_BOXES_QUANTITY} (inclusive).`,
    mortyPathMissing: `Missing <mortyPath> argument.\n${USAGE_HELP}`,
    mortyPathInvalid: `The provided <mortyPath> is invalid (check the path).`,
    defaultUsage: USAGE_HELP,
    notFinite: 'Maximum must be a finite number.',
    notInteger: 'Maximum must be an integer.',
    nonPositive: 'Maximum must be > 0.',
    tooLarge: `Maximum must be ≤ Number.MAX_SAFE_INTEGER (${Number.MAX_SAFE_INTEGER}).`,
    hmacKeyInvalid:
        'Secret key must be an even-length hex string of at least 64 hex chars (32 bytes).',
    hmacValueInvalid: `Value must be a non-negative safe integer (0 ≤ value ≤ ${Number.MAX_SAFE_INTEGER}).`,
} as const;

export const GameMessages = {
    start: (boxes: number) => `Hi, Rick! I’m hiding your portal gun in one of the ${boxes} boxes.`,

    hmac: (order: 1 | 2, hmac: string) => `HMAC #${order}: ${hmac}`,

    askRickEnterValueForRandom: (rangeMax: number) =>
        `Enter your number in [0, ${rangeMax}) so you can verify I’m not cheating later.`,

    askRickGuessWhereIsGun: (rangeMax: number) =>
        `Gun is hidden. What’s your guess? [0, ${rangeMax})`,

    wrongValue: (rangeMax: number) => `Invalid input. Enter an integer in [0, ${rangeMax}).`,

    letKeepSecondBoxInGame:
        'Now we’ll generate another value to decide the second box to keep in the gameLogic.',

    askRickEnterValueForRandom2: (rangeMax: number) =>
        `Enter your second number in [0, ${rangeMax}).`,

    infoKeepTwoBoxes: (rickChosenBox: number, secondChosenBox: number) =>
        `We’re keeping box ${rickChosenBox} (your choice) and box ${secondChosenBox}.`,

    askForExchange: () =>
        `Do you want to swap boxes? Enter ${EXCHANGE_AGREE_ANSWER} to swap, or ${KEEP_BOX_ANSWER} to keep your current box.`,

    exchangeApprove: (boxNumber: number) => `Got it. You chose box ${boxNumber}.`,

    randomValueInfo: (order: 1 | 2, value: number) => `Morty’s secret #${order}: ${value}`,

    keyInfo: (order: 1 | 2, key: string) => `HMAC key #${order}: ${key}`,

    randomResultInfo: (
        order: 1 | 2,
        rickValue: number,
        mortyValue: number,
        boxes: number,
        result: number,
    ) => `Fair number #${order}: (${mortyValue} + ${rickValue}) % ${boxes} = ${result}.`,

    finalBoxNumber: (boxNumber: number) => `Final box: ${boxNumber}.`,

    winInfo: 'Congratulations! You won!',
    lostInfo: 'No luck this time. Try again!',

    askToStartNextRound: 'Start the next round? (y/n)',

    wrongExchangeValue: `Invalid input. Enter ${EXCHANGE_AGREE_ANSWER} to swap the box, or ${KEEP_BOX_ANSWER} to keep your current box.`,

    exitGame: 'Bye! GameLogic exited.',

    invalidNextRoundResponse: 'Invalid input. Enter "no" to exit or "yes" to continue.',

    secondCommitmentNotUsed:
        'The second commitment was not used because your initial choice did not match the gun. The second box was set to the gun automatically.',

    secondCommitmentNotUsedLazy: 'The second commitment was not used.',
} as const;
