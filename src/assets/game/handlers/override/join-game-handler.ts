import gc from "@sg/game-client-base";
import inversify from "inversify";
const { injectable, inject } = inversify;

@injectable()
export class JoinGameHandler extends gc.JoinGame.JoinGameHandler {
    async handle(toGame: string) {
        this.joinGameStore.toGame = {
            name: toGame,
        };
    }
}
