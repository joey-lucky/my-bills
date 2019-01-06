const path = require('path');
const fs = require('fs');
const moment = require("moment");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const packageJson = require(resolveApp('package.json'));

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
    resolveApp: resolveApp,
    publicPath: getPath(packageJson.homepage),
    port: getPort(packageJson.homepage),
    homePageVersion:moment().format("YYYYMMDDHHmmss"),
    loginPageVersion:"20181217",
    allowedHost: getHost(packageJson.allowedHost),
    apiPath: getPath(packageJson.allowedHost)
};
