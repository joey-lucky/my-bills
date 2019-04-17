const path = require('path');
const fs = require('fs');
const moment = require("moment");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const packageJson = require(resolveApp('package.json'));
const {
    homePage = "http://localhost:8080/omip/front",
    apiHost = "http://localhost:8080/omip/api",
    fileDirectory = "http://localhost:8080",
    name="",
} = packageJson;
const pages = fs.readdirSync(resolveApp("src/pages")) || [];
const version = "v" + moment().format("YYYYMMDDHHmmss");
const pageVersion = pages.reduce((pre, pageName) => {
    pre[pageName] = version;
    return pre;
}, {});

//url地址 http://localhost:8080/om/front -> 8080
function getPort(url) {
    return url.replace(/(\S)+\:/g, "").replace(/\/(\S)+/g, "");
}

//url地址 http://localhost:8080/om/front -> /om/front
function getPath(url) {
    return url.replace(/(\S)+\:(\d)+/g, "");
}

//url地址 http://localhost:8080/om/front -> http://localhost:8080
function getHost(url) {
    return url.replace(getPath(url), "");
}

let filePath = "/" + getPath(homePage).split("/")[1] + "/file";

const paths = {
    resolveApp,
    pages,
    pageVersion,
    publicPath: getPath(homePage),
    port: getPort(homePage),
    allowedHost: getHost(apiHost),
    apiPath: getPath(apiHost),
    fileDirectory,
    filePath,
    projectName:name,
};

paths.ENV = {//环境变量
    PUBLIC_PATH: JSON.stringify(paths.publicPath),
    API_PATH: JSON.stringify(paths.apiPath),
    FILE_PATH: JSON.stringify(fileDirectory.startsWith("http")? fileDirectory : filePath),
    PROJECT_NAME: JSON.stringify(name),
};

paths.resolveAlias = {
    "@global": paths.resolveApp("src/global.js"),
    "@utils": paths.resolveApp("src/utils"),
    "@layouts": paths.resolveApp("src/layouts"),
    "@components": paths.resolveApp("src/components"),
    "@pages": paths.resolveApp("src/pages"),
    "@routes": paths.resolveApp("src/routes"),
};

module.exports = paths;
