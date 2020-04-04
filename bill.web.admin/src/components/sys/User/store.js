import {observable} from "mobx";
import {userAPI} from "@services";

class Store {
    @observable data = [];


    async loadData(){
        let d =  userAPI.index().then();
        this.data = d.data;
    }
}

export default new Store();