import gc from "@sg/game-client-base";
import { _decorator, Color, Component, Label } from "cc";
import { MatchConfig } from "./commons";

const { property, ccclass } = _decorator;

@ccclass
export default class CoinTossBetHistoryBetOption extends Component {
    @property(Label)
    choice: Label = null;

    @property(Label)
    stake: Label = null;

    protected convertChoiceData(choice: string): string {
        let betChoice = "";
        const choiceData = ["home", "away"];
        const choiceStr = ["glossary_home", "glossary_away"];
        choiceData.forEach((item, index) => {
            if (choice === item) {
                betChoice = choiceStr[index];
            }
        });
        return betChoice;
    }

    handleBetOptionItem(choice: string, odd: string, stake: string, match: MatchConfig) {
        const teamCode = match[choice];

        const translateTeam = `glossary_${teamCode}`;
        this.choice.string = `${gc.Translator.gameTranslate(translateTeam)}\n@ ${odd}`;
        this.stake.string = stake;
    }

    highlightForWinning(win: boolean) {
        const color = win ? Color.YELLOW : Color.WHITE;
        this.choice.color = color;
        this.stake.color = color;
    }
}
