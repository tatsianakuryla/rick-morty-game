import type { BoxSummary } from '../types';
import AsciiTable from 'ascii-table';

export class Table {
    private _table;

    constructor() {
        this._table = new AsciiTable('GAME STATS');
    }

    public print(summary: BoxSummary): void {
        this._table.setHeading('Game results', 'Rick switched', 'Rick stayed');
        this._table.addRow('Rounds', summary.switchedPlayed, summary.stayedPlayed);
        this._table.addRow('Wins', summary.switchedWon, summary.stayedWon);
        this._table.addRow('P (estimate)', summary.switchEstimate, summary.stayEstimate);
        this._table.addRow('P (exact)', summary.switchExact, summary.stayExact);
        console.log(this._table.toString());
    }
}
