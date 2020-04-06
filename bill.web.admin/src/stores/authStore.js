import {observable} from "mobx";
import {login as apiLogin} from "@services";
import {setToken} from "@utils/request";

class Store {
    @observable userInfo = {};

    async login(account, password) {
        let d = await apiLogin(account, password);
        setToken(d.data[0].token);
        this.userInfo = d.data[0];
        return d;
    }
}
export default new Store();
