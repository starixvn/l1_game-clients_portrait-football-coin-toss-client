import gc from "@sg/game-client-base";
import inversify from "inversify";
import { MatchStore } from "../../features/match/match-store";
const { injectable, inject } = inversify;
@injectable()
export class FinishedShowResult extends gc.Settlements.SettlementUIHandlers.FinishedShowResult {
    @inject(MatchStore) protected readonly matchStore: MatchStore;
    @inject(gc.RoundHistories.RoundHistoryStore) protected override readonly roundHistoryStore: gc.RoundHistories.RoundHistoryStore;
    @inject(gc.Settlements.SettlementStore) protected override readonly settlementStore: gc.Settlements.SettlementStore;


    constructor(settlementStore: gc.Settlements.SettlementStore, roundHistoryStore: gc.RoundHistories.RoundHistoryStore) {
        super(settlementStore, roundHistoryStore);
    }
    handle() {
        this.handleFinishedShowResult();

        const { roundId, result, settlementResult } = this.settlementStore;
        const match = this.matchStore.match;
        this.roundHistoryStore.insertNewRound({ roundId, result, settlementResult, match } as any);

    }
}
