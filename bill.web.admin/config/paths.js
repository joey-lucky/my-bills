const path = require('path');
const fs = require('fs');
const moment = require("moment");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const packageJson = require(resolveApp('package.json'));
const {homePage, apiHost,} = packageJson;

const publicPath = getPath(homePage);
const buildPath ="build";
const apiPath = getPath(apiHost);

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

function getServerRewrites(publicPath) {
    const pages = fs.readdirSync(resolveApp("src/pages/")) || [];
    let result = pages.map(pageName => ({
        from: `^${publicPath}/${pageName}`,
        to: `${publicPath}/view/${pageName}.html`
    }));
    result.push({
        from: `^${publicPath}`,
        to: `${publicPath}/view/home.html`,
    });
    return result;
}

//获取页面相关配置 {home:{},login:{}}
function getPageConfig() {
    const version = "v" + moment().format("YYYYMMDDHHmmss");
    const pages = fs.readdirSync(resolveApp("src/pages/" )) || [];
    return pages.reduce((pre, pageName) => {
        let pageRoot = `src/pages/${pageName}`;
        pre[pageName] = {
            jsPath: `js/${pageName}.${version}.bundle.js`,
            cssPath: `css/${pageName}.${version}.[id].bundle.css`,
            htmlPath: `view/${pageName}.html`,
            htmlTemplate: pageRoot + "/index.html",
            entry: pageRoot + "/index.js",
        };
        return pre;
    }, {});
}

let paths = {
    server: {
        rewrites: getServerRewrites(publicPath),
        port: getPort(homePage),
        apiTarget: getHost(apiHost),
        apiPath: apiPath,
    },
    pageConfig: getPageConfig(),
    buildPath,
    resolveApp,
    publicPath,
    port: getPort(homePage),
    allowedHost: getHost(apiHost),
};

console.log(JSON.stringify(paths));
paths.resolveAlias = {
    "@global": paths.resolveApp("src/global.js"),
    "@utils": paths.resolveApp("src/utils"),
    "@layouts": paths.resolveApp("src/layouts"),
    "@components": paths.resolveApp("src/components"),
};
paths.ENV = {//环境变量
    PUBLIC_PATH: JSON.stringify(paths.publicPath),
    API_PATH: JSON.stringify(apiPath),
};
module.exports = paths;
