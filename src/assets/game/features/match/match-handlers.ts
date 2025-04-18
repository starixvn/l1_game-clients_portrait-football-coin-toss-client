import gc from "@sg/game-client-base";
import inversify from "inversify";
import { MatchConfig } from "../../scripts/components/commons";
import { MatchStore } from "./match-store";
export type MatchHistory = gc.RoundHistories.RoundHistory & {
    match: MatchConfig;
};
const { injectable, inject } = inversify;

@injectable()
export class MatchHandler implements gc.Shared.IMultipleHandlers {
    @inject(MatchStore) protected readonly store: MatchStore;

    handleUpdateMatch(match: MatchConfig) {
        this.store.match = match;
    }

    handleLastMatch(roundHistories: MatchHistory[]) {
        if (roundHistories && roundHistories.length > 0) {
            const { match, roundId } = roundHistories[0];
            const lastMatch = {
                home: match?.home,
                away: match?.away,
                roundId,
            };
            this.store.lastMatch = lastMatch;
        }
    }

    eventHandleList: gc.Shared.IHandler<any, any>[] = [
        {
            name: "match",
            handle: this.handleUpdateMatch,
        },
        {
            name: "roundHistory",
            handle: this.handleLastMatch,
        },
    ];
}
