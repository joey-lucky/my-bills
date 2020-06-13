import request from "../utils/request";
import {getApiPath} from "@global";
import {apiGet} from "@utils/request";

class RestFullApi {
    url = "";

    constructor(url) {
        this.url = url;
    }

    show = async (id) => {
        return await request.show(this.url, id);
    };

    index = async (params = {}) => {
        return await request.index(this.url, params);
    };

    create = async (params) => {
        return await request.create(this.url, params);
    };

    destroy = async (id) => {
        return await request.destroy(this.url, id);
    };

    update = async (params) => {
        return await request.update(this.url, params.id, params);
    };
}

export async function login(account, password) {
    let params = {
        userName: account,
        password: password
    };
    return request.apiGet(getApiPath() + '/safe/login', params);
}

export async function getPublicKey() {
    return request.index(getApiPath() + '/get-public-key', {});
}

// conf
export const userAPI = new RestFullApi(getApiPath() + "/user");
export const billTypeAPI = new RestFullApi(getApiPath() + "/bill-type");
export const cardAPI = new RestFullApi(getApiPath() + "/card");
export const cardTypeAPI = new RestFullApi(getApiPath() + "/card-type");
export const dictTypeAPI = new RestFullApi(getApiPath() + "/dict-type");
export const dictDataAPI = new RestFullApi(getApiPath() + "/dict-data");
export const billTemplateAPI = new RestFullApi(getApiPath() + "/bill-template");
// data
export const billAPI = new RestFullApi(getApiPath() + "/bill");

export const homeAPI = {
    getCurrTotal: function () {
        return apiGet(getApiPath() + '/app/home/get-curr-total', {});
    },
};

export const statBillMAPI = {
    getMonthStatList: function (params) {
        return apiGet(getApiPath() + '/stat-bill-m/get-group-by-month-list', params);
    },

    getSumStatList: function (params) {
        return apiGet(getApiPath() + '/stat-bill-m/get-sum-data', params);
    },
}