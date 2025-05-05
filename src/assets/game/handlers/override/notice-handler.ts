import inversify from "inversify";
const { injectable, inject } = inversify;
import gc from "@sg/game-client-base";
import { MatchStore } from "../../features/match";

@injectable()
export class NoticeHandlers extends gc.Notices.NoticeHandlers {
    @inject(MatchStore)
    protected readonly matchStore: MatchStore;

    handleNotice(notice: gc.GameServiceMessage.Notice) {
        const { gameRoundId } = notice;

        if (gameRoundId && gameRoundId !== this.roundStore.roundId) {
            return;
        }

        const isHedgeBetGroup = !!notice?.hedgeBetGroup;
        const text = isHedgeBetGroup ? this.getHedgeBetErrorMessage(notice) : gc.ErrorUtils.getErrorMessage(notice, this.getSystem());
        this.noticeStore.addWarning(text);
    }

    getHedgeBetErrorMessage(notice: gc.GameServiceMessage.Notice) {
        const { errorCode, hedgeBetGroup } = notice;
        const option = { errorCode };
        hedgeBetGroup?.forEach((choice, index) => {
            const choiceName = this.matchStore ? this.matchStore[choice] : choice;
            option[`betChoice${index + 1}`] = gc.Translator.gameTranslate(`glossary_${choiceName}`);
        });

        return gc.Translator.translate("Common.message_hedge_bet", option);
    }
}
