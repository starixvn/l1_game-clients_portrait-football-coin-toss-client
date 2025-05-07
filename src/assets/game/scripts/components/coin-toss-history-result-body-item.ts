import gc from "@sg/game-client-base";
import { _decorator, Label, Sprite, SpriteAtlas, SpriteFrame } from "cc";
import { BaseResultBodyItem } from "db://shared-components/game/bet-history/scripts/components/bet-history-body-item";
import { MatchConfig } from "./commons";
import { bundleManager } from "db://shared-components/shared/common-components/bundle-manager/bundle-manager";

const { ccclass, property } = _decorator;

@ccclass()
export class CoinTossHistoryResultBodyItem extends BaseResultBodyItem {
    @property(Label)
    result: Label = null;

    @property(Sprite)
    flagSprite: Sprite = null;

    @property(SpriteFrame)
    flagDefault: SpriteFrame = null;

    setData(result: gc.BetHistory.DynamicObject<object>, settlementResult: gc.BetHistory.DynamicObject<boolean>, match: MatchConfig) {
        if (!match) {
            return;
        }
        const resultKey = result.home ? "home" : "away";
        const teamCode = match[resultKey];
        bundleManager.loadAssetsFromBundle<SpriteFrame>("resources", `flags/${teamCode.toLowerCase()}/spriteFrame`, SpriteFrame, null).then( spriteFrame=>{
            this.flagSprite.spriteFrame = spriteFrame ?? this.flagDefault;
        });

        this.result.string = gc.Translator.translate(`FootballCoinToss.glossary_${teamCode}`);
    }
}
