import inversify from "inversify";
import mobx from "mobx";
import { MatchConfig } from "../../scripts/components/commons";

const { injectable } = inversify;

@injectable()
export class MatchStore {
    private _match: MatchConfig | null = null;
    private _lastMatch: MatchConfig | null = null;
    constructor() {
        mobx.makeAutoObservable(this);
    }

    get match() {
        return this._match;
    }

    set match(match: MatchConfig) {
        this._match = match;
    }

    get lastMatch() {
        return this._lastMatch;
    }

    set lastMatch(lastMatch: MatchConfig) {
        this._lastMatch = lastMatch;
    }
}
