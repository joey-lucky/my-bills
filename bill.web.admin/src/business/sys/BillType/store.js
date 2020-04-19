import {action, observable} from "mobx";
import {billTypeAPI} from "@services";

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
            data.forEach(item => {
                if (item.children && item.children.length === 0) {
                    delete item.children;
                }
            });
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