const path = require('path');
const fs = require('fs');
const moment = require("moment");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const packageJson = require(resolveApp('package.json'));
const {
    homePage="http://localhost:8080/bill/front",
    apiHost="http://localhost:3000/bill/api"
} = packageJson;
const pages = fs.readdirSync(resolveApp("src/pages"))||[];
const version = "v"+moment().format("YYYYMMDDHHmmss");
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

module.exports = {
    resolveApp,
    pages,
    pageVersion,
    publicPath: getPath(homePage),
    port: getPort(homePage),
    allowedHost: getHost(apiHost),
    apiPath: getPath(apiHost),
};
