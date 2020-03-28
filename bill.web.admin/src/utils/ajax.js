import $ from "jquery";
import {getApiPath, getItem, getPublicPath, setItem} from "@global";
// 通用参数 所有的请求都会附加
let commonParams = {};

// 错误处理
let errorHandler = (xmlHttpRequest, textStatus, errorThrown) => {

};

export class Ajax {
    static setParams(params = {}) {
    }

    static setErrorHandle(handler) {
        errorHandler = handler;
    }

    static setToken(token = ""){
        setItem(getPublicPath() + "_token", token);
        // window.localStorage.setItem(getPublicPath() + "_token", token);
    }

    static getToken(){
        return getItem(getPublicPath() + "_token");
        // return window.localStorage.getItem(getPublicPath() + "_token") || "";
    }

    static apiPost(url, data = {}, isasync, dataType) {
        let completeUrl = getApiPath() + url;
        return this._post(completeUrl, data, isasync, dataType);
    }

    static apiGet(url, data, isasync, dataType) {
        let completeUrl = getApiPath() + url;
        return this._get(completeUrl, data, isasync, dataType);
    }

    static _post(url, data, isasync, dataType) {

        return this._ajax(url, data, "POST", isasync, dataType);
    }

    static _get(url, data, isasync, dataType) {

        return this._ajax(url, data, "GET", isasync, dataType);
    }

    static _ajax(url, data = {}, method = "GET", isasync, dataType) {
        let _isasync = isasync || "true";
        let myDataType = dataType || "json";
        let params = {
            ...commonParams,
            ...data,
            _token:Ajax.getToken()
        };

        /**
         * 提供取消渠道
         */
        let doCancel;

        let cancelPromise = new Promise((resolve, reject) => {
            doCancel = (reason) => {
                reject("用户取消,原因：" + reason);
            };
        });
        let promise = new Promise(function (resolve, reject) {
            $.ajax({
                url: url,
                type: method,
                data: params,
                timeout: 35000,
                dataType: myDataType,
                async: _isasync,
                beforeSend: function (request) {
                    request.setRequestHeader("TOKEN", "crsfToken");
                },
                success: function (d) {
                    if (!d.platform) {
                        resolve(d);
                        return;
                    }

                    if (d.result_flag === "SUCCESS") {
                        resolve(d);
                    } else {
                        console.log("接口返回错误信息");
                        reject(new Error(d.result_flag_dsc));
                    }

                },
                error: (xmlHttpRequest, textStatus, errorThrown) => {
                    errorHandler && errorHandler(xmlHttpRequest, textStatus, errorThrown);
                    reject(new Error(xmlHttpRequest.status));
                }
            });
        });

        let allPromise = Promise.race([promise, cancelPromise]);
        let then = allPromise.then;
        allPromise.then = (fun, err) => {
            let promise = then.call(allPromise, fun, err);
            promise.cancel = doCancel;
            return promise;
        };
        allPromise.cancel = doCancel;
        return allPromise;
    }
}

export class MockAjax {

    static apiPost(url, data, isasync, dataType) {
        return Ajax._get("http://localhost:8080/mock" + url + ".js", data, isasync, dataType);
    }

}
