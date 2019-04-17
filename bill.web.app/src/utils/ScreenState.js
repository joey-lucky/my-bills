import {observable} from "mobx";

export default class ScreenState {
    @observable clientWidth = 0;
    @observable clientHeight = 0;

    constructor() {
        this.initClientSize();
        window.addEventListener("resize", this.initClientSize);
        window.addEventListener("pageshow", (e) => {
            if (e.persisted) {
                this.onSizeChange();
            }
        });
    }

    initClientSize = () => {
        let docEl = document.documentElement;
        this.clientWidth = docEl.clientWidth;
        this.clientHeight = docEl.clientHeight;
    };
}

export const screenState = new ScreenState();
