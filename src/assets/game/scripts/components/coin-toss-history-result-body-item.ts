import gc from "@sg/game-client-base";
import { _decorator, Color, Label, Sprite, SpriteAtlas, SpriteFrame } from "cc";
import { BaseResultBodyItem } from "db://shared-components/game/bet-history/scripts/components/bet-history-body-item";
import { MatchConfig } from "./commons";

const { ccclass, property } = _decorator;

@ccclass()
export class CoinTossHistoryResultBodyItem extends BaseResultBodyItem {
    @property(Sprite)
    dot: Sprite = null;

    @property(Label)
    result: Label = null;

    // @property(SpriteFrame)
    // sprOdd: SpriteFrame = null;

    // @property(SpriteFrame)
    // sprEven: SpriteFrame = null;

    @property(SpriteAtlas)
    flagsAtlas: SpriteAtlas = null;

    @property(Sprite)
    sprFlag: Sprite = null;

    setData(result: gc.BetHistory.DynamicObject<object>, settlementResult: gc.BetHistory.DynamicObject<boolean>, match: MatchConfig) {
        if (!match) {
            return;
        }
        console.log("settlementResult", settlementResult);
        console.log("result", result);
        console.log("match", match);
        const resultKey = result.home ? "home" : "away";
        const teamCode = match[resultKey];
        this.sprFlag.spriteFrame = this.flagsAtlas.getSpriteFrame(`result-${teamCode.toLowerCase()}`);
        this.result.string = gc.Translator.translate(`FootballCoinToss.glossary_${teamCode}`);

        // let number = 0;
        // Object.keys(result).forEach((key) => {
        //     if (result[key]) {
        //         number++;
        //     }
        // });

        // this.result.string = number.toString();
        // if (number % 2) {
        //     this.dot.spriteFrame = this.sprOdd;
        //     this.result.color = Color.WHITE;
        // } else {
        //     this.dot.spriteFrame = this.sprEven;
        //     this.result.color = Color.BLACK;
        // }
    }
}
