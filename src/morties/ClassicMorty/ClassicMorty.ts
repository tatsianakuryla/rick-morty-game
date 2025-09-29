import type { Morty } from '../Morty/Morty';

export class ClassicMorty implements Morty {
    constructor() {
        console.log('It is ClassicMorty');
    }
}
