import { _decorator, Label, Node, UIOpacity, SpriteAtlas, Sprite } from "cc";
import { PFBetItem } from "db://shared-components/provably-fair/round-base/scripts/pf-bet-item";
import gc from "@sg/game-client-base";
import { LastMatchConfig, MatchConfig } from "./commons";
import Observer from "observer";
import { MatchStore } from "../../features/match/match-store";
import { IJoinGameHistory } from "@sg/game-client-base/dist/game/round-histories/round-history-store";
const { Rounds, Translator, RoundHistories } = gc;

const { observer, render } = Observer;

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
    lastMatch: LastMatchConfig = null;

    public handleHighlightAnim(isActive: boolean) {
        this.lblTotalBet && (this.lblTotalBet.getComponent(UIOpacity).opacity = isActive ? 180 : 255);
        this.lblOwnBet && (this.lblOwnBet.getComponent(UIOpacity).opacity = isActive ? 180 : 255);
    }

    @render(Rounds.RoundTimeStore, (store) => store.isWaiting)
    handleWaiting(isWaiting: boolean) {
        if (isWaiting) {
            this.setTeam(this.lastMatch);
        }
    }

    @render(RoundHistories.RoundHistoryStore, (store) => store.firstJoinGameHistory)
    async renderStaticResult(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory) {
        if (!firstJoinGameHistory) {
            return;
        }

        this.setTeam(this.match);
    }

    @render(RoundHistories.RoundHistoryStore, (store) => store.joinGameHistory)
    handleJoinGame(joinGameHistory: IJoinGameHistory) {
        if (!joinGameHistory) {
            return;
        }
        const { roundHistory } = joinGameHistory ?? {};
        if (!roundHistory) {
            return;
        }
        this.setTeam(this.match);
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartRound)
    handleStartRound(isStartRound: boolean) {
        if (isStartRound) {
            this.setTeam(this.match);
        }
    }

    @render(MatchStore, (store) => store.match)
    handleMatch(match: MatchConfig) {
        this.match = match;
    }

    @render(MatchStore, (store) => store.lastMatch)
    handleLastMatch(lastMatch: LastMatchConfig) {
        this.lastMatch = lastMatch;
    }

    private setTeam(match: MatchConfig) {
        if (match?.home && match?.away) {
            const teamType = this.node.name;
            const teamCode = match[teamType];
            this.lblTeamName.string = this.getTeamName(teamCode);
            this.loadFlag(teamCode, teamType);
        }
    }

    private getTeamName(teamCode: string) {
        const teamTypeText = gc.Translator.gameTranslate(`FootballCoinToss.glossary_${teamCode.toUpperCase()}`);
        if (teamTypeText.includes("FootballCoinToss.glossary_")) {
            return "";
        }

        return teamTypeText.toUpperCase();
    }

    private loadFlag(teamCode: string, teamType: string) {
        const spriteFrame = this.flagsAtlas.getSpriteFrame(teamCode.toLowerCase());
        this.flag.spriteFrame = spriteFrame ?? this.flagsAtlas.getSpriteFrame(teamType);
    }
}
