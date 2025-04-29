import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { BetItemsPolygon } from "db://shared-components/game/bets/scripts/components/bet-items-polygon";
import { MatchConfig } from "./commons";
import { CoinTossBetItem } from "./coin-toss-bet-item";

const { ccclass } = _decorator;

@ccclass("CoinTossBetItems")
export class CoinTossBetItems extends BetItemsPolygon {
    handleHighlightAnim(highLightInfo: gc.Rounds.THighlightAnim) {
        const { settlementResult, isAnim } = highLightInfo;
        if (highLightInfo?.settlementResult) {
            this.betItemComponents.forEach((betItem) => {
                const choice = betItem.node.name;
                betItem.handleHighlightAnim(!this.isWinning(+settlementResult?.[choice]) && isAnim);
            });
        }
    }

    public setTeam(match: MatchConfig) {
        this.betItemComponents.forEach((betItem) => {
            const coinTossBetItem = betItem.getComponent(CoinTossBetItem);
            coinTossBetItem.setTeam(match);
        });
    }
}
