import {action, computed, observable} from "mobx";
import {dictDataAPI} from "@services";

class Store {
    @observable typeCode = "";
    @observable keyword = "";
    @observable data = [];

    @computed get queryParams() {
        return {
            "typeCode": this.typeCode,
            "keyword": this.keyword,
        };
    }

    @action
    loadData() {
        dictDataAPI.index(this.queryParams).then((d) => {
            let data = d.data || [];
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
        dictDataAPI.destroy(record.id).then(() => {
            this.loadData();
        });
    }
}

export default new Store();