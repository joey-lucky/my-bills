import {computed, observable,action} from "mobx";
import {userAPI} from "@services";

class Store {
    @observable keyword = "";
    @observable lastModifyDate=Date.now();

    @computed get queryParams(){
        return {
            "name%": this.keyword
        };
    }


    @action
    asyncDeleteData(record){
        userAPI.destroy(record.id).then(()=>{
            this.lastModifyDate = Date.now();
        });
    }

}

export default new Store();