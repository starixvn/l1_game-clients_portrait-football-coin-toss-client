import gc from "@sg/game-client-base";
import inversify from "inversify";
const { injectable, inject } = inversify;

@injectable()
export class GameConfigHandlers extends gc.GameConfigs.GameConfigHandlers {
    @inject(gc.GameConfigs.GameConfigStore) protected readonly gameConfigStore: gc.GameConfigs.GameConfigStore;
    @inject(gc.App.AppStore) protected readonly appStore: gc.App.AppStore;
    @inject(gc.Notices.NoticeStore) protected readonly noticeStore: gc.Notices.NoticeStore;
    @inject(gc.DisabledGame.DisabledGameStore) protected readonly disabledGameStore: gc.DisabledGame.DisabledGameStore;

    handleGameConfigs(gameConfigs: gc.GameServiceMessage.GameConfigs) {
        if (this.disabledGameStore.disabled && this.gameConfigStore.initialized) {
            this.disabledGameStore.setNoticeDisable(null);
            this.disabledGameStore.setGameStatus(false);
        }
        this.gameConfigStore.setGameConfigs(gameConfigs);
        this.noticeStore.hideNotice();
        this.disabledGameStore.isResetRoundTime = false;
    }
}

// export class GameConfigHandlers implements IMultipleHandlers {
//     constructor(
//         @inject(GameConfigStore) protected readonly gameConfigStore: GameConfigStore,
//         @inject(AppStore) protected readonly appStore: AppStore,
//         @inject(NoticeStore) protected readonly noticeStore: NoticeStore,
//         @inject(DisabledGameStore) protected readonly disabledGameStore: DisabledGameStore
//     ) {}

//     handleGameConfigs(gameConfigs: GameServiceMessage.GameConfigs) {
//         if (this.disabledGameStore.disabled && this.gameConfigStore.initialized) {
//             this.disabledGameStore.setNoticeDisable(null);
//             this.disabledGameStore.setGameStatus(false);
//         }
//         this.gameConfigStore.setGameConfigs(gameConfigs);
//         this.appStore.isLoading = false;
//         this.noticeStore.hideNotice();
//         this.disabledGameStore.isResetRoundTime = false;
//     }
