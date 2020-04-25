import {action, observable} from "mobx";

class Store {
    @observable visible = false;
    @observable text = "加载中";

    @action
    show = (text = "加载中") => {
        this.visible = true;
        this.text = text;
    };

    @action
    hide = () => {
        this.visible = false;
    };
}
export default new Store();
