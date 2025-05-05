import gc from "@sg/game-client-base";
import inversify from "inversify";
import { MatchStore } from "../../features/match/match-store";
const { injectable, inject } = inversify;
@injectable()
export class FinishedShowResult extends gc.Settlements.SettlementUIHandlers.FinishedShowResult {
    @inject(MatchStore) protected readonly matchStore: MatchStore;
    @inject(gc.RoundHistories.RoundHistoryStore) private readonly footballRoundHistoryStore: gc.RoundHistories.RoundHistoryStore;

    @inject(gc.Settlements.SettlementStore) private readonly footballSettlementStore: gc.Settlements.SettlementStore;


    handle() {
        this.handleFinishedShowResult();

        const { roundId, result, settlementResult } = this.footballSettlementStore;
        const match = this.matchStore.match;
        this.footballRoundHistoryStore.insertNewRound({ roundId, result, settlementResult, match } as any);

    }
}
