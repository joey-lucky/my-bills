import {observable} from "mobx";

class Store {
    @observable pageName = "账单管理后台配置";
    @observable projectName = "账单管理后台配置";
    @observable version = "v2.5 beta";
}

export default new Store();
