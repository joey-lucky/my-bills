const globalData = {};

let pathConfig = {
    publicPath: process.env.PUBLIC_PATH || "",
    apiPath: "",
    filePath: "",
};

export function initConfig(config = {}) {
    pathConfig = Object.assign(pathConfig, config);
}

export function getPublicPath() {
    return pathConfig.publicPath;
}

export function getApiPath() {
    return pathConfig.apiPath;
}

export function getFilePath() {
    return pathConfig.filePath;
}

export function getPlatformName() {
    return pathConfig.publicPath.split("/")[1];
}

export function getUploadPath() {
    return pathConfig.apiPath + "/upload";
}

/**
 * 保存全局变量
 */
export function setItem(key, value) {
    globalData[key] = value;
    window.localStorage.setItem("holly_cache_" + key, JSON.stringify(value));
}

/**
 * 获取全局变量
 */
export function getItem(key) {
    if (!globalData[key]) {
        let value = window.localStorage.getItem("holly_cache_" + key);
        if (value) {
            globalData[key] = JSON.parse(value);
        }
    }
    return globalData[key];
}

export function getCookie(key) {
    let cookie = document.cookie;
    //索引长度，开始索引的位置
    let indexOf = cookie.indexOf(key);
    // 如果找到了索引，就代表cookie存在,否则不存在
    if (indexOf !== -1) {
        // 把cookie_pos放在值的开始，只要给值加1即可
        //计算取cookie值得开始索引，加的1为“=”
        indexOf = indexOf + key.length + 1;
        //计算取cookie值得结束索引
        let cookie_end = cookie.indexOf(";", indexOf);
        if (cookie_end === -1) {
            cookie_end = cookie.length;
        }
        //得到想要的cookie的值
        return  cookie.substring(indexOf, cookie_end);
    }
    return "";
}