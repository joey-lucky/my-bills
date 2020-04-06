import {computed, observable,action} from "mobx";
import {userAPI} from "@services";

class Store {
    @observable queryParams = {};
    @observable lastModifyDate=Date.now();

    @action
    asyncDeleteData(record){
        userAPI.destroy(record.id).then(()=>{
            this.lastModifyDate = Date.now();
        });
    }

}

export default new Store();