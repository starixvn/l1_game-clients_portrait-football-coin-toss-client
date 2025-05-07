import gc from "@sg/game-client-base";
import { _decorator, Label, Node, Sprite, SpriteFrame } from "cc";
import { getTeamName } from "db://assets/scripts/utils";
import { PFBetItem } from "db://shared-components/provably-fair/round-base/scripts/pf-bet-item";
import { MatchConfig } from "./commons";
import Observer from "observer";
import { bundleManager } from "db://shared-components/shared/common-components/bundle-manager/bundle-manager";

const { ccclass, property } = _decorator;
const { render } = Observer;
@ccclass("CoinTossBetItem")
export class CoinTossBetItem extends PFBetItem {
    @property({ type: Node, override: true, visible: false })
    choice: Node = null;

    @property(Sprite)
    flag: Sprite = null;

    @property(SpriteFrame)
    flagDefault: SpriteFrame = null;

    @property(Label)
    lblTeamName: Label = null;

    match: MatchConfig = null;
    lastMatch: MatchConfig = null;

    public setTeam(match: MatchConfig) {
        if (match?.home && match?.away) {
            const teamType = this.node.name;
            const teamCode = match[teamType];
            this.lblTeamName.string = getTeamName(teamCode);
            this.loadFlag(teamCode, teamType);
        }
    }

    private async loadFlag(teamCode: string, teamType: string) {
        const spriteFrame = await bundleManager.loadAssetsFromBundle<SpriteFrame>("resources", `flags/${teamCode.toLowerCase()}/spriteFrame`, SpriteFrame, null);
        this.flag.spriteFrame = spriteFrame ?? this.flagDefault;
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isStartRound)
    handleStartRound(isStartRound: boolean) {
        if (isStartRound) {
            this.highlightAnim.active = false;
        }
    }
}
