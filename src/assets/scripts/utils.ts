import gc from "@sg/game-client-base";

export function getTeamName(teamCode: string) {
    const teamTypeText = gc.Translator.gameTranslate(`FootballCoinToss.glossary_${teamCode.toUpperCase()}`);
    if (teamTypeText.includes("FootballCoinToss.glossary_")) {
        return "";
    }

    return teamTypeText.toUpperCase();
}
