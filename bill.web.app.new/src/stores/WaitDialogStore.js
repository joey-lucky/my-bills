import {observable} from "mobx";

export class WaitDialogStore {
    @observable visible = false;
    @observable text = "加载中";

    show(text="加载中"){
        this.visible = true;
        this.text = text;
    }

    hide(){
        this.visible = false;
    }

}
