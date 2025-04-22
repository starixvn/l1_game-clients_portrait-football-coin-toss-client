import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { ResultPercentage } from "db://shared-components/game/result-percentage/scripts/result-percentage";
const { ccclass } = _decorator;
@ccclass
export class CoinTossResultPercentage extends ResultPercentage {
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
}
