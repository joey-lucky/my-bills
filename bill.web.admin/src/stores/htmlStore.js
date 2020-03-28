import {observable} from "mobx";

class Store {
    @observable pageName = "深圳市污染源在线监测平台-safa包";
    @observable projectName = "深圳市污染源在线监测平台-safa包";
    @observable version = "v2.5 beta";
}

export default new Store();
