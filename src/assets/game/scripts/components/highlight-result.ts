import gc from "@sg/game-client-base";
import { Component, Node, _decorator } from "cc";
import { TResult } from "./coin-toss-winning-result";

const { ccclass, property } = _decorator;

@ccclass("HighlightResult")
export class HighlightResult extends Component {
    @property(Node)
    head: Node = null;

    @property(Node)
    tail: Node = null;

    protected onLoad(): void {
        this.hide();
    }

    setStatusNode(node: Node, status: boolean) {
        node && (node.active = status);
    }

    hide() {
        this.setStatusNode(this.head, false);
        this.setStatusNode(this.tail, false);
    }

    show(result: gc.GameServiceMessage.TResult) {
        const convertedResult = result as TResult;
        const isHome = convertedResult?.home;

        this.setStatusNode(this.head, isHome);
        this.setStatusNode(this.tail, !isHome);
    }
}
