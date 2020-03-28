import request from "../utils/request";
import {getApiPath} from "@global";

class RestFullApi{
    url = "";

    constructor(url) {
        this.url = url;
    }

    async show(id) {
        return await request.show(getApiPath()+this.url, id);
    }

    async index(url, params = {}) {
        return await request.index(getApiPath()+this.url, params);
    }

    async create( params) {
        return await request.create(getApiPath()+this.url, params);
    }

    async destroy(id) {
        return await request.destroy(getApiPath()+this.url, id);
    }

    async update(id, params) {
        return await request.update(getApiPath()+this.url, id, params);
    }
}

export async function login(account,password) {
    let params = {
        userName:account,
        password:password
    };
    return request.apiGet(getApiPath()+'/safe/login',params);
}

export async function getPublicKey() {
    return request.index(getApiPath() + '/get-public-key', {});
}

export const userAPI = new RestFullApi("/users");

export const billAPI = new RestFullApi("/bills");

