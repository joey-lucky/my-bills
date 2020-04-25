import {action, computed, observable} from "mobx";
import {billAPI} from "@services";
import {waitDialogStore} from "@stores/index";

class Store {
    @observable filterValues = {};
    @observable lastModifyDate = Date.now();

    @computed
    get queryParams() {
        let params = {...this.filterValues};
        let {dateTimeMoreThanOrEqual,dateTimeLessThanOrEqual} = params;
        if (dateTimeMoreThanOrEqual) {
            params.dateTimeMoreThanOrEqual = dateTimeMoreThanOrEqual.clone().format("YYYY-MM-DD 00:00:00")
        }
        if (dateTimeLessThanOrEqual) {
            params.dateTimeLessThanOrEqual = dateTimeLessThanOrEqual.clone().format("YYYY-MM-DD 23:59:59")
        }
        return params;
    }

    async loadData() {
        this.lastModifyDate = Date.now();
    }

    @action
    async deleteData(record) {
        try {
            waitDialogStore.show("删除中");
            await billAPI.destroy(record.id);
            await this.loadData();
            waitDialogStore.hide();
        } catch (e) {
            waitDialogStore.hide();
            throw e;
        }
    }

}

export default new Store();