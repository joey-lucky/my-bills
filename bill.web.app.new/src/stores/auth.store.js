import {observable} from "mobx";
import {safeAPI} from "@services/index";

export class AuthStore {
    @observable userInfo = {};

    get userId(){
        return this.userInfo.id;
    }
    get userName(){
        return this.userInfo.name;
    }

    async loadUserInfo(){
        let d = await safeAPI.getUserInfo();
        this.userInfo = d.data && d.data[0] || {};
    }
}