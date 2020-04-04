import request from "../utils/request";
import {getApiPath} from "@global";

class RestFullApi {
    url = "";

    constructor(url) {
        this.url = url;
    }

    show = async (id) => {
        return await request.show(getApiPath() + this.url, id);
    };

    index = async (url, params = {}) => {
        return await request.index(getApiPath() + this.url, params);
    };

    create = async (params) => {
        return await request.create(getApiPath() + this.url, params);
    };

    destroy = async (id) => {
        return await request.destroy(getApiPath() + this.url, id);
    };

    update = async (id, params) => {
        return await request.update(getApiPath() + this.url, id, params);
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

export const userAPI = new RestFullApi(getApiPath() + "/conf/users");

export const billAPI = new RestFullApi(getApiPath() + "/conf/bills");

