import {action, computed, observable} from "mobx";
import {billTemplateAPI} from "@services";

class Store {
    @observable filterValues = {};
    @observable lastModifyDate=Date.now();

    @computed
    get queryParams(){
        return {...this.filterValues}
    }

    @action
    loadData(){
        this.lastModifyDate = Date.now();
    }

    @action
    asyncDeleteData(record){
        billTemplateAPI.destroy(record.id).then(()=>{
            this.loadData();
        });
    }
}

export default new Store();