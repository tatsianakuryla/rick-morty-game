import { MAX_BOXES_QUANTITY, MIN_BOXES_QUANTITY } from '../../constants/constants';

export const DefaultMessage = [
    'Usage:',
    'npm start -- <boxCount> <mortyPath>',
    '',
    'where:',
    `<boxCount> integer in [${MIN_BOXES_QUANTITY}..${MAX_BOXES_QUANTITY}]`,
    '<mortyPath> path to a Morty implementation module: ./LazyMorty.ts or ./ClassicMorty.ts',
].join('\n');

export const DetailedError = {
    boxesMissing: `Missing <boxCount> argument.\n${DefaultMessage}`,
    boxesWrongFormat: `<boxCount> must be an integer between ${MIN_BOXES_QUANTITY} and ${MAX_BOXES_QUANTITY} (inclusive).\n${DefaultMessage}`,
    mortyPathMissing: `Missing <mortyPath> argument.\n${DefaultMessage}`,
    mortyPathInvalid: `Indicated <mortyPath> is invalid (check the path).\n${DefaultMessage}`,
    default: DefaultMessage,
} as const;

export const GameMessages = {
    start: (boxes: number) =>
        `Hi, Rick! I’m gonna hide your portal gun in one of the ${boxes} boxes`,
};
