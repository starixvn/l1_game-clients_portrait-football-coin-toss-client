import "./../../../resources/i18n";

import gc from "@sg/game-client-base";
import { _decorator, Node, Label, sp, SpriteFrame, Asset } from "cc";
import { ChipFlying } from "db://shared-components/game/chip-flying/scripts/components/chip-flying";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { startGame } from "db://shared-components/shared/scripts/startup";
import { FunctionUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
import { CoinTossWinningResult } from "./coin-toss-winning-result";
import { FlipCoin } from "./flip-coin";
import { HighlightResult } from "./highlight-result";
import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions, settings } from "../game-settings";
import { AudioUtils } from "db://shared-components/game/audios/utils";
import { MatchStore } from "../../features/match/match-store";
import { MatchConfig, IFootballCoinTossResult } from "./commons";
import { bundleManager } from "db://shared-components/shared/common-components/bundle-manager/bundle-manager";
import { CoinTossResultPercentage } from "./coin-toss-result-percentage";
import { CoinTossBetItems } from "./coin-toss-bet-items";
import { error } from "console";
import { getMatchAnimResource, loadSkeletonData } from "db://assets/scripts/utils";
import { UpdateLoadingHandler } from "../../handlers/update-loading-handler";

startGame(settings.name, containerOptions, siteConfigs, settings.namespaces);
const { Rounds, Translator, RoundHistories } = gc;

const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

type ResultSoundInfo = {
    soundId: string;
    duration: number;
};

@ccclass
@observer(settings.name)
export default class Game extends GameComponent {
    @property({ type: Label, override: true, visible: false })
    lblMinBet: Label = null;

    @property({ type: Label, override: true, visible: false })
    lblMaxBet: Label = null;

    @property({ type: Node })
    winningResultNode: Node = null;

    @property({ type: Node })
    flipCoinNode: Node = null;

    @property({ type: Node })
    highlightResultNode: Node = null;

    @property({ type: Node })
    resultPercentageNode: Node = null;

    @property({ type: Node })
    betItemsNode: Node = null;

    private winningResult: CoinTossWinningResult = null;
    private flipCoin: FlipCoin = null;
    private highlightResult: HighlightResult = null;
    private resultPercentage: CoinTossResultPercentage = null;
    private betItems: CoinTossBetItems = null;

    override namespace = settings.name;
    override containerOptions = containerOptions;
    isLoading = true;

    private readonly winningSounds = { home: "home", away: "away" };
    private readonly winningMusic = { home: "home_music", away: "away_music" };

    protected clientRoundId = -1;
    protected resultSoundIds: ResultSoundInfo[] = [];
    enableFixHandleFinish = true;

    @property(ChipFlying)
    chipFlying: ChipFlying = null;

    @property(Node)
    nodeAudioContainer: Node = null;

    private nextMatchSkeleton: sp.SkeletonData;

    match: MatchConfig = null;
    lastMatch: MatchConfig = null;

    private loadingSkeletonData = false;

    onLoad() {
        super.onLoad();
        this.fetchComponents();
        this.winningResult.hideQuickly();
        this.flipCoin.init();
    }

    fetchComponents() {
        this.winningResult = this.winningResultNode.getComponent(CoinTossWinningResult);
        this.flipCoin = this.flipCoinNode.getComponent(FlipCoin);
        this.highlightResult = this.highlightResultNode.getComponent(HighlightResult);
        this.resultPercentage = this.resultPercentageNode.getComponent(CoinTossResultPercentage);
        this.betItems = this.betItemsNode.getComponent(CoinTossBetItems);
    }

    @render(Rounds.RoundStore, (store) => store.clientRoundId)
    storeClientRoundId(clientRoundId: number) {
        this.clientRoundId = clientRoundId;
    }

    @render(Rounds.RoundTimeStore, (store) => store.isInRoundTime)
    renderInRoundTime(isInRoundTime: boolean) {
        if (isInRoundTime && !this.isLoading) {
            this.winningResult.hideQuickly();
        }
    }

    @render(MatchStore, (store) => store.match)
    async handleMatch(match: MatchConfig) {
        this.match = match;
        await this.loadMatchFlag(match);
        await this.loadMatchSkeleton(match);
        this.handleUpdateLoading();
    }

    @render(MatchStore, (store) => store.lastMatch)
    handleLastMatch(lastMatch: MatchConfig) {
        this.lastMatch = lastMatch;
    }

    @render(Rounds.RoundTimeStore, (store) => store.isWaiting)
    handleWaiting(isWaiting: boolean) {
        if (isWaiting) {
            this.setTeam();
        }
    }

    private setTeam() {
        this.resultPercentage.setTeam(this.match);
        this.betItems.setTeam(this.match);
        loadSkeletonData(getMatchAnimResource(this.match)).then((skeletonData) => {
            skeletonData && this.updateSkeletonData(skeletonData);
        });
    }

    @render(RoundHistories.RoundHistoryStore, (store) => store.joinGameHistory)
    handleJoinGame(joinGameHistory: gc.RoundHistories.IJoinGameHistory) {
        if (!joinGameHistory) {
            return;
        }
        const { roundHistory } = joinGameHistory ?? {};
        if (!roundHistory) {
            return;
        }
        this.setTeam();
    }

    private async loadMatchSkeleton(match: MatchConfig) {
        if (match?.home && match?.away) {
            await this.preloadResourcesAnim(match);
        }
    }

    private async loadMatchFlag(match: MatchConfig) {
        if (match?.home && match?.away) {
            const resourcePaths = [match.home, match.away, `result-${match.home}`, `result-${match.away}`];
            const resourcePathImages = resourcePaths.map((path) => `flags/${path.toLowerCase()}/spriteFrame`);
            await this.preloadResourcesImages(resourcePathImages);
        }
    }

    private async preloadResourcesImages(resourcePathImages: string[]) {
        resourcePathImages.forEach(async (path) => {
            try {
                await bundleManager.loadAssetsFromBundle<SpriteFrame>("resources", path, SpriteFrame, null);
            } catch (error) {
                console.log("Failed to load images from path: ", path, error.message);
            }
        });
    }

    @handle(UpdateLoadingHandler)
    handleUpdateLoading() {
        console.log("handleUpdateLoading");
        this.isLoading = false;
    }

    private async preloadResourcesAnim(match: MatchConfig) {
        const pathAnimToss = getMatchAnimResource(match);
        this.loadingSkeletonData = true;

        try {
            await loadSkeletonData(pathAnimToss);
        } catch (error) {
            console.log("Not found skeleton data into path: ", pathAnimToss, error.message);
        }
        this.loadingSkeletonData = false;
    }

    private updateSkeletonData(skeletonData: sp.SkeletonData) {
        if (!this.nextMatchSkeleton) {
            this.winningResult.setSkeletonData(skeletonData);
            this.flipCoin.setSkeletonData(skeletonData);
        }

        if (skeletonData) {
            this.nextMatchSkeleton = skeletonData;
        }
    }

    async finishShowResult(result: gc.GameServiceMessage.TResult, settlementResult: gc.GameServiceMessage.TSettlementResult) {
        this.highlightResult.show(result);
        this.playWinningSound();
        super.finishShowResult(result, settlementResult);
        this.chipFlying.callActionPayChips();
        this.betItems.handleHighlightStatic({ result, settlementResult });
    }

    async showResult(result: gc.GameServiceMessage.TResult, hasAnimation: boolean) {
        if (result) {
            this.flipCoin.setStatusNode(false);
            this.loadSoundResultBeforeRead(result);
            this.winningResult.setResult(result);
            if (hasAnimation) {
                await this.winningResult.show();
            }
        }
    }

    async playWinningSound() {
        for (const resultSoundInfo of this.resultSoundIds) {
            this.playSound(resultSoundInfo.soundId);
            await FunctionUtils.delay(resultSoundInfo.duration * 1000);
        }
    }

    async loadSoundResultBeforeRead(data: gc.GameServiceMessage.TResult) {
        let isCancelLoadSounds = false;
        const maxWaitTime = 5000;
        const result = Object.keys(data).find((key) => data[key]);

        const timeoutCancelWinningSound = setTimeout(() => {
            isCancelLoadSounds = true;
        }, maxWaitTime);

        if (isCancelLoadSounds) {
            return;
        }

        const soundId = this.generateWinningKey(data as IFootballCoinTossResult);
        if (soundId) {
            const duration = await AudioUtils.getDurationClip(soundId);

            this.resultSoundIds.push({ soundId, duration });
        }
        const musicDuration = await AudioUtils.getDurationClip(this.winningMusic[result]);
        this.resultSoundIds.push({ soundId: this.winningMusic[result], duration: musicDuration });
        timeoutCancelWinningSound && clearTimeout(timeoutCancelWinningSound);
    }

    getAudioKeyForLanguage(name: string): string {
        return `${name}_${Translator.getLanguageId() || "en"}`;
    }

    async handleStartRound(isStartRound: boolean) {
        if (isStartRound) {
            super.handleStartRound(isStartRound);
            this.winningResult.hideQuickly();
            if (this.nextMatchSkeleton) {
                this.flipCoin.setSkeletonData(this.nextMatchSkeleton);
                this.flipCoin.playAnim();
                this.winningResult.setSkeletonData(this.nextMatchSkeleton);
            }

            this.highlightResult.hide();
            this.resultSoundIds = [];
            this.setTeam();
        }
    }

    @render(gc.App.AppStore, (store) => store.isLoading)
    updateLoading(isLoading: boolean) {
        console.log("updateLoading", isLoading);
        this.isLoading = isLoading;
    }

    @render(RoundHistories.RoundHistoryStore, (store) => store.firstJoinGameHistory)
    async renderStaticResult(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory) {
        if (!firstJoinGameHistory) {
            return;
        }

        this.setTeam();

        const { animationHighlight, roundTime, roundHistory: lastRound } = firstJoinGameHistory;
        if (lastRound && animationHighlight && roundTime > 0) {
            const { result } = lastRound;
            this.betItems.showLoseBG(result);
            this.flipCoin.setStatusNode(false);
            this.highlightResult.show(result);
        }
    }

    generateWinningKey(result: IFootballCoinTossResult): string {
        const key = result?.home ? "home" : "away";
        const language = Translator.getLanguageId() || "en";
        const winOptionName = this.match ? this.match[key]?.toLowerCase() : key;
        return `${winOptionName}_${language}`;
    }

    @handle(gc.Audios.AudioHandler, (handle, id: string) => handle.playSFX(id))
    playSoundSound(id: string) {
        return id;
    }
}
