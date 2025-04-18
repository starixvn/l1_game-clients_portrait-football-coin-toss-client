import inversify from "inversify";
import mobx from "mobx";
import { LastMatchConfig, MatchConfig } from "../../scripts/components/commons";

const { injectable } = inversify;

@injectable()
export class MatchStore {
    private _match: MatchConfig | null = null;
    private _lastMatch: LastMatchConfig | null = null;
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

    set lastMatch(lastMatch: LastMatchConfig) {
        this._lastMatch = lastMatch;
    }
}
