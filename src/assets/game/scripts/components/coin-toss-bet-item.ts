import { _decorator, Label, Node, Sprite, SpriteAtlas, UIOpacity } from "cc";
import { getTeamName } from "db://assets/scripts/utils";
import { PFBetItem } from "db://shared-components/provably-fair/round-base/scripts/pf-bet-item";
import { MatchConfig } from "./commons";

const { ccclass, property } = _decorator;

@ccclass("CoinTossBetItem")
export class CoinTossBetItem extends PFBetItem {
    @property({ type: Node, override: true, visible: false })
    choice: Node = null;

    @property(Sprite)
    flag: Sprite = null;

    @property(SpriteAtlas)
    flagsAtlas: SpriteAtlas = null;

    @property(Label)
    lblTeamName: Label = null;

    match: MatchConfig = null;
    lastMatch: MatchConfig = null;

    public handleHighlightAnim(isActive: boolean) {
        this.lblTotalBet && (this.lblTotalBet.getComponent(UIOpacity).opacity = isActive ? 180 : 255);
        this.lblOwnBet && (this.lblOwnBet.getComponent(UIOpacity).opacity = isActive ? 180 : 255);
    }

    public setTeam(match: MatchConfig) {
        if (match?.home && match?.away) {
            const teamType = this.node.name;
            const teamCode = match[teamType];
            this.lblTeamName.string = getTeamName(teamCode);
            this.loadFlag(teamCode, teamType);
        }
    }

    private loadFlag(teamCode: string, teamType: string) {
        const spriteFrame = this.flagsAtlas.getSpriteFrame(teamCode.toLowerCase());
        this.flag.spriteFrame = spriteFrame ?? this.flagsAtlas.getSpriteFrame(teamType);
    }
}
