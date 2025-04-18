import "./../../../resources/i18n";

import gc from "@sg/game-client-base";
import { _decorator, Node, Label, Skeleton, sp } from "cc";
import { ChipFlying } from "db://shared-components/game/chip-flying/scripts/components/chip-flying";
import GameComponent from "db://shared-components/game/scripts/components/game-component";
import { startGame } from "db://shared-components/shared/scripts/startup";
import { FunctionUtils, isIOS } from "db://shared-components/shared/utils";
import Observer from "observer";
import { CoinTossWinningResult } from "./coin-toss-winning-result";
import { FlipCoin } from "./flip-coin";
import { HighlightResult } from "./highlight-result";
import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions, settings } from "../game-settings";
import { AudioUtils } from "db://shared-components/game/audios/utils";
import { MatchStore } from "../../features/match/match-store";
import { MatchConfig } from "./commons";
import { bundleManager } from "db://shared-components/shared/common-components/bundle-manager/bundle-manager";

startGame(settings.name, containerOptions, siteConfigs, settings.namespaces);
const { Rounds, Translator, RoundHistories } = gc;

const { ccclass, property } = _decorator;
const { observer, render } = Observer;

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

    private winningResult: CoinTossWinningResult = null;
    private flipCoin: FlipCoin = null;
    private highlightResult: HighlightResult = null;

    override namespace = settings.name;
    override containerOptions = containerOptions;
    isLoading = true;

    private readonly winningSounds = { head: "head", tail: "tail" };
    private readonly winningMusic = { head: "head_music", tail: "tail_music" };

    protected clientRoundId = -1;
    protected resultSoundIds: ResultSoundInfo[] = [];
    enableFixHandleFinish = true;

    @property(ChipFlying)
    chipFlying: ChipFlying = null;

    @property(Node)
    nodeAudioContainer: Node = null;

    @property(Node)
    nodePlate: Node = null;

    @property(Node)
    nodeWinning: Node = null;

    //compPlate: Plate = null;
    // protected enableFixHandleFinish = true;
    // private winningResult: WinningResult = null;
    // private soundWinChoice = ["odd", "even"];
    private currentFinish: gc.GameServiceMessage.Finish = null;
    private nextMatchSkeleton: sp.SkeletonData;
    
    private getPathAnimToss(path: string) {
        return `matches/${path}/toss/coin_toss`;
    }

    private readonly pathAnimTossDefault = this.getPathAnimToss("HOME-AWAY");
    // onLoad() {
    //     this.compPlate = this.nodePlate.getComponent(Plate);
    //     this.winningResult = this.nodeWinning.getComponent(WinningResult);
    //     super.onLoad();
    // }

    // async showResult(
    //     result: gc.GameServiceMessage.TResult,
    //     hasAnimation: boolean,
    //     settlementResult: gc.GameServiceMessage.TSettlementResult
    // ) {
    //     if (result) {
    //         this.compPlate.setDots(result as IResult);
    //         await this.compPlate.openPlate(hasAnimation);
    //         this.winningResult.setSettlementResult(settlementResult);
    //         this.winningResult.show();

    //         const winChoice = this.soundWinChoice.find((choice) => settlementResult[choice]);
    //         this.playSound(`${winChoice}_wins_${gc.Translator.getLanguageId()}`);
    //     }
    // }

    // async renderCurrentFinish(currentFinish: gc.GameServiceMessage.Finish) {
    //     this.currentFinish = currentFinish;
    //     if (!currentFinish || !this.enableFixHandleFinish) {
    //         return;
    //     }
    //     const { result, settlementResult } = currentFinish as any;

    //     if (!this.isValidResult(result, settlementResult)) {
    //         return;
    //     }
    //     if (isIOS()) {
    //         await FunctionUtils.delay(800);
    //     }

    //     this.showResult(result, true, settlementResult).then(() => {
    //         this.finishShowResult(result, settlementResult);
    //         this.chipFlying.callActionPayChips();
    //     });
    //     this.playSound(gc.Audios.AudioIds.RECEIVE_FINISH);
    // }

    // @render(RoundHistories.RoundHistoryStore, (store) => store.firstJoinGameHistory)
    // async renderStaticResult(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory) {
    //     if (!firstJoinGameHistory) {
    //         return;
    //     }
    //     const roundTime = firstJoinGameHistory.roundTime;

    //     const lastRound = firstJoinGameHistory.roundHistory as any;
    //     if (lastRound) {
    //         const { result, settlementResult } = lastRound;
    //         if (firstJoinGameHistory.animationHighlight) {
    //             if (roundTime === 0) {
    //                 await FunctionUtils.delay(1000);
    //                 if (this.currentFinish) {
    //                     return;
    //                 }
    //                 this.showResult(result, false, settlementResult);
    //             } else {
    //                 this.showResult(result, false, settlementResult);
    //             }
    //         }
    //     }
    // }

    // @render(Rounds.RoundTimeStore, (store) => store.isStartingRound)
    // disableWinNotice(isStartingRound: boolean) {
    //     isStartingRound && this.winningResult.hideQuickly();
    // }

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
    handleMatch(match: MatchConfig) {
        this.loadMatchSkeleton(match);

    }

    async loadMatchSkeleton(match: MatchConfig) {
        if (match?.home && match?.away) {
            const resourcePath = `${match?.home.toUpperCase()}-${match?.away.toUpperCase()}`;
            await this.loadResourcesAnim(resourcePath);
        }
    }

    async loadResourcesAnim(resourcePath: string) {
        const customPath = this.getPathAnimToss(resourcePath);

        try {
            const skeletonData = await this.loadSkeletonData(customPath);
            skeletonData && this.updateSkeletonData(skeletonData);
        } catch (error) {
            console.log("Not found skeleton data into path: ", resourcePath, error.message);
            const skeletonData = await this.loadSkeletonData(this.pathAnimTossDefault);
            skeletonData && this.updateSkeletonData(skeletonData);
        }
    }
    private async loadSkeletonData(path: string): Promise<sp.SkeletonData | null> {
        try {
            const skeletonData = await bundleManager.loadAssetsFromBundle<sp.SkeletonData>("resources", path, sp.SkeletonData, null);

            return (
                skeletonData ?? (await bundleManager.loadAssetsFromBundle("resources", this.pathAnimTossDefault, sp.SkeletonData, null))
            );
        } catch (error) {
            console.log("Failed to load skeleton data from path: ", path, error.message);
            return null;
        }
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
        const winOptionName = this.winningSounds[result];
        const soundId = this.getAudioKeyForLanguage(winOptionName);
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
    
            this.flipCoin.playAnim();

            this.highlightResult.hide();
            this.resultSoundIds = [];
        }
    }

    @render(gc.App.AppStore, (store) => store.isLoading)
    updateLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }

    @render(RoundHistories.RoundHistoryStore, (store) => store.firstJoinGameHistory)
    async renderStaticResult(firstJoinGameHistory: gc.RoundHistories.IFirstJoinGameHistory) {
        if (!firstJoinGameHistory) {
            return;
        }

        const { animationHighlight, roundTime, roundHistory: lastRound } = firstJoinGameHistory;
        if (lastRound && animationHighlight && roundTime > 0) {
            const { result } = lastRound;
            this.flipCoin.setStatusNode(false);
            this.highlightResult.show(result);
        }
    }

}
