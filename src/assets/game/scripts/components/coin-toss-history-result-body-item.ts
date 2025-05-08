import gc from "@sg/game-client-base";
import { _decorator, Label, Sprite, SpriteAtlas } from "cc";
import { BaseResultBodyItem } from "db://shared-components/game/bet-history/scripts/components/bet-history-body-item";
import { MatchConfig } from "./commons";

const { ccclass, property } = _decorator;

@ccclass()
export class CoinTossHistoryResultBodyItem extends BaseResultBodyItem {
    @property(Label)
    result: Label = null;

    @property(SpriteAtlas)
    flagsAtlas: SpriteAtlas = null;

    @property(Sprite)
    flagSprite: Sprite = null;

    setData(result: gc.BetHistory.DynamicObject<object>, settlementResult: gc.BetHistory.DynamicObject<boolean>, match: MatchConfig) {
        if (!match) {
            return;
        }
        const resultKey = result.home ? "home" : "away";
        const teamCode = match[resultKey];
        this.flagSprite.spriteFrame = this.flagsAtlas.getSpriteFrame(`result-${teamCode.toLowerCase()}`);
        this.result.string = gc.Translator.translate(`FootballCoinToss.glossary_${teamCode}`);
    }
}
