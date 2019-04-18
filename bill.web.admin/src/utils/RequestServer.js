import {apiPath, publicPath} from "@global";

const tokenKey = publicPath + "_token";

export default class RequestServer {
    static setToken(token) {
        window.localStorage.setItem(tokenKey, token);
    };

    constructor(url = "", params = {}) {
        this.url = url;
        this.params = params;
    }

    httpPost() {
        let params = {_token: this._getToken(), ...params};
        let method = "POST";
        let headers = this._getHeader();
        let body = JSON.stringify(params);
        let promise = new Promise(async (resolve, reject) => {
            try {
                let completeUrl = apiPath + url;
                let response = await fetch(completeUrl, {method, headers, body});
                let data = await response.json();
                if (data.code === "1") {
                    resolve(data);
                } else {
                    let message = data.message || "";
                    throw new Error(message);
                }
            } catch (e) {
                if (e.message.indexOf("token") !== -1) {
                    window.location.href = publicPath + "/login/"
                } else {
                    console.error(e.message);
                    reject(e.message);
                }
            }
        });
        return this._wrapPromise(promise);
    }

    httpGet() {
        let params = {_token: this._getToken(), ...params};
        let method = "GET";
        let headers = this._getHeader();
        let body = JSON.stringify(params);
        let promise = new Promise(async (resolve, reject) => {
            try {
                let completeUrl = apiPath + url;
                let response = await fetch(completeUrl, {method, headers, body});
                let data = await response.json();
                if (data.code === "1") {
                    resolve(data);
                } else {
                    let message = data.message || "";
                    throw new Error(message);
                }
            } catch (e) {
                if (e.message.indexOf("token") !== -1) {
                    window.location.href = publicPath + "/login/"
                } else {
                    console.error(e.message);
                    reject(e.message);
                }
            }
        });
        return this._wrapPromise(promise);
    }

    _getHeader() {
        const headers = new Headers();
        headers.append("Content-Type", "application/json;charset=utf-8");
        return headers;
    }

    _getToken() {
        return window.localStorage.getItem(tokenKey);
    }

    _wrapPromise(promise, timeout = 10000) {
        let timeoutFn = null;
        let cancelFn = null;
        let timeoutPromise = new Promise((resolve, reject) => {
            timeoutFn = () => {
                reject("请求超时");
            };
        });
        let cancelPromise = new Promise((resolve, reject) => {
            cancelFn = (message) => {
                reject("请求中止 " + message);
            }
        });
        let allPromise = Promise.race([promise, timeoutPromise, cancelPromise]);
        setTimeout(timeoutFn, timeout);
        allPromise.cancel = cancelFn;
        return allPromise;
    }
}