import {action, computed, observable} from "mobx";
import {dictTypeAPI} from "@services";

class Store {
    @observable keyword = "";
    @observable lastModifyDate=Date.now();

    @computed get queryParams(){
        return {
            "keyword": this.keyword
        };
    }

    @action
    loadData(){
        this.lastModifyDate = Date.now();
    }

    @action
    asyncDeleteData(record){
        dictTypeAPI.destroy(record.id).then(()=>{
            this.loadData();
        });
    }
}

export default new Store();