import {apiPath, publicPath} from "@global";

const headers = new Headers();
headers.append("Content-Type", "application/json;charset=utf-8");
// headers.append("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
// headers.append("Content-Length", content.length.toString());
// headers.append("X-Custom-Header", "ProcessThisImmediately");


function wrapPromise(promise, timeout = 10000) {
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

const getToken = () => window.localStorage.getItem(publicPath + "_token");
export const setToken = (token) => window.localStorage.setItem(publicPath + "_token", token);

export function request(url, params = {}) {
    params = {_token: getToken(), ...params};
    let promise = new Promise(async (resolve, reject) => {
        try {
            let completeUrl = apiPath + url;
            let response = await fetch(completeUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(params)
            });
            let data = await response.json();
            if (data.code === "1") {
                resolve(data);
            } else {
                let message = data.message || "";
                throw new Error(message);
            }
        } catch (e) {
            if (e.message.indexOf("token")!==-1) {
                window.location.href=publicPath+"/login/"
            }else{
                reject(e);
            }
        }
    });
    return wrapPromise(promise);
}

