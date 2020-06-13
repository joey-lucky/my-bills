import PropTypes from "prop-types";

const useMock = process.env.USE_MOCK || false;
export const publicPath = process.env.PUBLIC_PATH;
export const apiPath = useMock ? "/mock" : process.env.API_PATH;
export const filePath = process.env.FILE_PATH || "";
export const projectName = process.env.PROJECT_NAME || "";
export const getUploadPath = () => "/omip/api/upload";
export const propTypes = {
    react: {
        children: PropTypes.any
    },
    routeComponent: {
        match: PropTypes.shape({
            path: PropTypes.string.isRequired,
        }),
        history: PropTypes.any,
        location: PropTypes.any
    }
};

const globalData = {};

export function getApiPath() {
    return apiPath;
}
export function getPublicPath() {
    return publicPath;
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