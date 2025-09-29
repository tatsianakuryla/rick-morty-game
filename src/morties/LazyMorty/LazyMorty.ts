import type { Morty } from '../Morty/Morty';

export class LazyMorty implements Morty {
    constructor() {
        console.log('It is LazyMorty');
    }
}
