import {action, computed, observable} from "mobx";
import {cardAPI} from "@services";

class Store {
    @observable queryParams = {};
    @observable lastModifyDate=Date.now();

    @action
    loadData(){
        this.lastModifyDate = Date.now();
    }

    @action
    changeQueryParams(values={}){
        this.queryParams = {...this.queryParams, ...values};
        this.loadData();
    }

    @action
    deleteData(record){
        cardAPI.destroy(record.id).then(()=>{
            this.lastModifyDate = Date.now();
        });
    }

}

export default new Store();