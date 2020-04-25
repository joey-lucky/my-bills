import {action, observable} from "mobx";
import {billTypeAPI} from "@services";
import {deleteAllEmptyChildren} from "@utils/treeDataUtils";

class Store {
    @observable data = [];
    @observable keyword = "";

    get queryParams() {
        return {
            "keyword": this.keyword
        };
    }

    @action
    loadData() {
        billTypeAPI.index(this.queryParams).then((d) => {
           let data  = d.data || [];
            deleteAllEmptyChildren(data)
            this.data = data;
        });
    }

    @action
    asyncDeleteData(record) {
        billTypeAPI.destroy(record.id).then(() => {
            this.loadData();
        });
    }
}

export default new Store();