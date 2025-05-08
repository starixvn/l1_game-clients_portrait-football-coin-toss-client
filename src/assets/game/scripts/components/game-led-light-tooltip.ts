import gc from "@sg/game-client-base";
import { _decorator, Color, UITransform } from "cc";
import { getTeamName } from "db://assets/scripts/utils";
import { LedLightTooltipAlignment } from "db://shared-components/game/led-light/scripts/components/led-light-tooltip-alignment";
import { MatchHistory } from "../../features/match";
import { BetChoice } from "./commons";

const { ccclass } = _decorator;

enum ColorResult {
    home = "#032A98",
    away = "#C50D0D",
}

@ccclass()
export class GameLedLightToolTip extends LedLightTooltipAlignment {
    public setTooltipInfo(ledLightInfo: MatchHistory) {
        const match = ledLightInfo.match;
        const roundIdText = `#${ledLightInfo.roundId}`;
        this.roundId.string = roundIdText;
        const winChoice = this.findWinningChoice(ledLightInfo);
        const name = match?.[winChoice] ? getTeamName(match[winChoice]) : gc.Translator.gameTranslate(`glossary_${winChoice}`);
        this.result.string = name;
        this.result.color = new Color(ColorResult[winChoice]);

        const backgroundTransform = this.background.getComponent(UITransform);
        if (backgroundTransform) {
            const letterWidth = 18;
            const roundIdWidth = roundIdText.length * letterWidth;
            let backgroundWidth = (name?.length || 9) * letterWidth;
            backgroundWidth = backgroundWidth > roundIdWidth ? backgroundWidth : roundIdWidth;
            backgroundTransform.width = backgroundWidth;
        }

        this.showTooltip();
    }

    protected findWinningChoice(ledLightInfo: gc.RoundHistories.RoundHistory): string {
        const choices = [BetChoice.Away, BetChoice.Home];
        return choices.find((choice) => ledLightInfo.settlementResult[choice]) || "";
    }
}
