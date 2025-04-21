export enum BetChoice {
    Away = "away",
    Home = "home",
}
export class MatchConfig {
    home: string;
    away: string;
}

export class LastMatchConfig extends MatchConfig {
 }
