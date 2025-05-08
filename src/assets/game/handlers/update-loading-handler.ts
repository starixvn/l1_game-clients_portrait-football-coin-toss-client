import gc from "@sg/game-client-base";
import inversify from "inversify";

import { IHandler } from "@sg/game-client-base/dist/shared";

const { injectable, inject } = inversify;

@injectable()
export class UpdateLoadingHandler implements IHandler<number> {
    @inject(gc.App.AppStore) protected readonly appStore: gc.App.AppStore;

    handle() {
        this.appStore.isLoading = false;
    }
}
