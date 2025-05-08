import gc from "@sg/game-client-base";
import { sp } from "cc";
import { bundleManager } from "db://shared-components/shared/common-components/bundle-manager/bundle-manager";
import { MatchConfig } from "../game/scripts/components/commons";

export function getTeamName(teamCode: string) {
    const teamTypeText = gc.Translator.gameTranslate(`FootballCoinToss.glossary_${teamCode.toUpperCase()}`);
    if (teamTypeText.includes("FootballCoinToss.glossary_")) {
        return "";
    }

    return teamTypeText.toUpperCase();
}

export function getPathAnimToss(path: string) {
    return `matches/${path}/toss/coin_toss`;
}

export function getMatchAnimResource(match: MatchConfig) {
    const matchResource = `${match?.home.toUpperCase()}-${match?.away.toUpperCase()}`;
    return getPathAnimToss(matchResource);
}

const pathAnimTossDefault = getPathAnimToss("HOME-AWAY");

export async function loadSkeletonData(path: string): Promise<sp.SkeletonData | null> {
    try {
        const skeletonData = await bundleManager.loadAssetsFromBundle<sp.SkeletonData>("resources", path, sp.SkeletonData, null);

        return skeletonData ?? (await bundleManager.loadAssetsFromBundle("resources", pathAnimTossDefault, sp.SkeletonData, null));
    } catch (error) {
        console.log("Failed to load skeleton data from path: ", path, error.message);
        return null;
    }
}
