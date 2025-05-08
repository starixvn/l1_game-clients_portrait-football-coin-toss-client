import { _decorator } from "cc";
import { ScoreboardItemState } from "db://shared-components//game/scoreboards/scripts/models/scoreboard-item-state";
import { ScoreboardItemRenderer } from "db://shared-components/game/scoreboards/scripts/renderers/scoreboard-item-renderer";
import { IResult } from "../../components/plate";
const { ccclass, property } = _decorator;
@ccclass
export class CoinTossResultRenderer extends ScoreboardItemRenderer {
    render(state?: ScoreboardItemState, images?: any[], item?: any) {
        const result = state?.data[0]?.result as IResult;

        if (!result) {
            return;
        }
    }

    reset(): void {
        this.node.active = false;
    }
}
