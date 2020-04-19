import {notification} from 'antd';
import {getItem, getPublicPath, setItem} from "@global";
import {extend} from "umi-request";

const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};

const request = extend({
    useCache:false,
});

const errorHandler = (error) => {
    const {response} = error;
    if (response && response.status) {
        const errorText = codeMessage[response.status] || response.statusText;
        const {status, url} = response;

        notification.error({
            message: `请求错误 ${status}: ${url}`,
            description: errorText,
        });
    } else if (!response) {
        notification.error({
            description: error.message || '您的网络发生异常，无法连接服务器',
            message: '网络异常',
        });
    }
    return response;
};

function getHeaders() {
    return {
        "Content-Type": "application/json;charset=utf-8",
        "Authorization": "Bearer " + getToken()
    };
}

export function getToken() {
    return getItem(getPublicPath() + "_token");
}

export function setToken(token = "") {
    setItem(getPublicPath() + "_token", token);
}

async function commonFetch(url, params = {}, method) {
    try {
        params = {
            ...params,
        };
        let requestParams = {
            method: method,
            headers: getHeaders(),
            data: JSON.stringify(params)
        };
        if (method === "GET") {
            delete requestParams.data;
            requestParams.params = params
        }
        let data = await request(url, requestParams);
        if (data.code === "1") {
            return data;
        } else {
            let message = data.message || "";
            throw new Error(message);
        }
    } catch (e) {
        errorHandler(e);
        throw e;
    }
}

async function show(url, id) {
    return await commonFetch(url + "/" + id, {}, "GET");
}

async function index(url, params = {}) {
    return await commonFetch(url, params, "GET");
}

async function create(url, params) {
    return await commonFetch(url, params, "POST");
}

async function destroy(url, id) {
    return await commonFetch(url + "/" + id, {}, "DELETE");
}

async function update(url, id, params) {
    return await commonFetch(url + "/" + id, params, "PUT");
}

async function apiGet(url, params) {
    return await commonFetch(url, params, "GET");
}

export default {
    show: show,
    index: index,
    create: create,
    destroy: destroy,
    update: update,
    apiGet: apiGet,
};
