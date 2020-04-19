import request from "../utils/request";
import {getApiPath} from "@global";

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
export const userAPI = new RestFullApi(getApiPath() + "/conf/users");
export const billTypeAPI = new RestFullApi(getApiPath() + "/conf/bill-types");
export const cardAPI = new RestFullApi(getApiPath() + "/conf/cards");
export const cardTypeAPI = new RestFullApi(getApiPath() + "/conf/card-types");
export const dictTypeAPI = new RestFullApi(getApiPath() + "/conf/dict-types");
export const dictDataAPI = new RestFullApi(getApiPath() + "/conf/dict-datas");
export const billTemplateAPI = new RestFullApi(getApiPath() + "/conf/bill-templates");

// data
export const billAPI = new RestFullApi(getApiPath() + "/data/bills");


