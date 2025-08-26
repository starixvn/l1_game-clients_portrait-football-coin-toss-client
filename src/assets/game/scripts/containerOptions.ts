import gc from "@sg/game-client-base";
import { LogStore } from "db://shared-components/game/scripts/stores/log-store";
import { sharedContainer } from "../../scripts/shared-container";
import * as Match from "../features/match";
import { FinishedShowResult, NoticeHandlers } from "../handlers/override";
import { settings } from "./game-settings";


export const containerOptions: gc.IContainerOptions = {
    globalContainer: sharedContainer,
    onContainerCreated: (container) => {
        container.bind(gc.GameConfigs.GameSetting).toConstantValue(settings);
        container.bind(gc.Settlements.SettlementUIHandlers.FinishedShowResult).to(FinishedShowResult);
        container.bind(gc.Notices.NoticeHandlers).to(NoticeHandlers);
        container.bind(LogStore).to(LogStore);
    },

    features: [Match, gc.BetDetailsNew, gc.RoundBasePF, ...gc.defaultFeatures],
};
