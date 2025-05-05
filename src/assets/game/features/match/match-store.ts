import inversify from "inversify";
import mobx from "mobx";
import { MatchConfig } from "../../scripts/components/commons";

const { injectable } = inversify;

@injectable()
export class MatchStore {
    private _match: MatchConfig | null = null;
    private _lastMatch: MatchConfig | null = null;
    private _home: string;
    private _away: string;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    get match() {
        return this._match;
    }

    set match(match: MatchConfig) {
        this._home = match?.home;
        this._away = match?.away;
        this._match = match;
    }

    get home(): string {
        return this._home;
    }

    get away(): string {
        return this._away;
    }

    get lastMatch() {
        return this._lastMatch;
    }

    set lastMatch(lastMatch: MatchConfig) {
        this._lastMatch = lastMatch;
    }
}
