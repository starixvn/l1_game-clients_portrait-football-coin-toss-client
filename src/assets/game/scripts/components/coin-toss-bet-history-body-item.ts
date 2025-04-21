import gc from "@sg/game-client-base";
import { _decorator, Button, instantiate, Label, Node, Prefab } from "cc";
import { BetHistoryNewBodyItem } from "db://shared-components/game/bet-history-new/scripts/bet-history-new-body-item";
import { BetHistoryBodyItemType } from "db://shared-components/game/bet-history/scripts/components/bet-history-body-item";
import CoinTossBetHistoryBetOption from "./coin-toss-bet-history-bet-option";
import { CoinTossHistoryResultBodyItem } from "./coin-toss-history-result-body-item";
const { ccclass, property } = _decorator;

const { DateTimeUtils, FormatUtils } = gc;
export type CoinTossBetHistoryLog = gc.BetHistory.BetHistoryLog & {
    match: {
        home: string;
        away: string;
    };
    home: number;
    away: number;
};
@ccclass
export class CoinTossBetHistoryBodyItem extends BetHistoryNewBodyItem {
    @property({ type: Label, override: true, visible: false })
    lblTime: Label = null;

    @property({ type: Label, override: true, visible: false })
    lblTotalStake: Label = null;

    @property({ type: Button, override: true, visible: false })
    btnRound: Button = null;

    @property(Node)
    betOption: Node = null;

    @property(Prefab)
    betPrefab: Prefab = null;

    setData(data: BetHistoryBodyItemType) {
        super.setData(data);
        const { time, settlementResult, freeBet, odds, result, match } = data.betHistoryLog as CoinTossBetHistoryLog;
        if (time) {
            const date = DateTimeUtils.getStringDate(time);
            const hour = DateTimeUtils.getStringHourByTime(time);
            this.lblDate && (this.lblDate.string = date);
            this.lblHour && (this.lblHour.string = hour);
        }

        if (settlementResult) {
            Object.keys(settlementResult).forEach((choice) => {
                const node = instantiate(this.betPrefab);
                const option = node.getComponent(CoinTossBetHistoryBetOption);
                let stake = data.betHistoryLog[choice];
                if (+stake > 0) {
                    stake = freeBet ? 0 : stake;
                    const odd = this.getFormatOdd(odds[choice]?.toString(), data?.fractionalOddsFormat);
                    option.handleBetOptionItem(choice, odd, FormatUtils.numberWithCommas(stake), match);
                    option.highlightForWinning(settlementResult[choice]);
                    this.betOption.addChild(node);
                }
            });
        }

        if (match) {
            //TODO: update match data
        }

        if (data.resultPrefab) {
            this.result.removeAllChildren();
            const bodyRow = instantiate(data.resultPrefab);
            bodyRow.getComponent(CoinTossHistoryResultBodyItem)?.setData(result, settlementResult, match);
            this.result.addChild(bodyRow);

            //TODO: update result data

            // if (resultPrefab) {
            //     const bodyRow = instantiate(resultPrefab);
            //     const { result, settlementResult } = betHistoryLog;
            //     bodyRow.getComponent(BaseResultBodyItem)?.setData(result as gc.BetHistory.DynamicObject<object>, settlementResult);
            //     this.result.addChild(bodyRow);
            // }
        }
    }
}
