import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import { getTeamName } from "db://assets/scripts/utils";
import { ResultPercentage } from "db://shared-components/game/result-percentage/scripts/result-percentage";
import { MatchConfig } from "./commons";

const { ccclass, property } = _decorator;
@ccclass
export class CoinTossResultPercentage extends ResultPercentage {
    @property({ type: Label })
    lblTeamHome: Label = null;

    @property({ type: Label })
    lblTeamAway: Label = null;

    calculateWinPercentage(originalChoices: string[], roundHistory: gc.RoundHistories.RoundHistory[]): Record<string, number> {
        const count = super.calculateWin(originalChoices, roundHistory);
        const total = roundHistory.length;

        const calculatePercentage = (value: number) => Math.round((value * 100) / total);

        // Initialize the percentage object
        const percentage: Record<string, number> = {};

        // Calculate odd and even percentages
        const homeValue = calculatePercentage(count["home"]);
        const awayValue = 100 - homeValue;

        // Assign calculated values to percentage object
        percentage["home"] = homeValue;
        percentage["away"] = awayValue;

        return percentage;
    }

    public setTeam(match: MatchConfig) {
        if (match?.home && match?.away) {
            this.lblTeamHome.string = getTeamName(match.home);
            this.lblTeamAway.string = getTeamName(match.away);
        }
    }
}
