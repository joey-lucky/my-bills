const path = require("path");
const fs = require("fs");
const moment = require("moment");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const packageJson = require(resolveApp("package.json"));
const {
    homePage,
    apiHost,
    fileDirectory = "http://localhost:8080",
} = packageJson;
const publicPath = getPath(homePage);
const projectName = publicPath.split("/").pop();
const platformName = publicPath.split("/")[1];
const filePath = `/${platformName}/file`;
const apiPath = getPath(apiHost);

// url地址 http://localhost:8080/om/app -> 8080
function getPort(url) {
    return url.replace(/(\S)+\:/g, "").replace(/\/(\S)+/g, "");
}

// url地址 http://localhost:8080/om/app -> /om/app
function getPath(url) {
    return url.replace(/(\S)+\:(\d)+/g, "");
}

// url地址 http://localhost:8080/om/app -> http://localhost:8080
function getHost(url) {
    return url.replace(getPath(url), "");
}

const getServerStaticProxy = () => {
    if (!fileDirectory.startsWith("http")) {
        return [{
            from: filePath,
            to: fileDirectory
        }];
    } else {
        return [];
    }
};

const version = "v" + moment().format("YYYYMMDDHHmmss");
const pageConfig = {
    jsPath: `js/${version}.index.js`,
    cssPath: `css/${version}.[id].index.css`,
    imagePath: "img/[hash].[ext]",
    fontsPath: "fonts/[hash].[ext]",
    htmlPath: `index.html`,
    htmlTemplate: "public/index.html",
    entry: "src/index.js",
};
const serverConfig = {
    rewrites: [{from: `^${publicPath}`, to: `${publicPath}/${[pageConfig.htmlPath]}`}],
    staticProxy: getServerStaticProxy(),
    port: getPort(homePage),
    apiTarget: getHost(apiHost),
    apiPath: apiPath,
};
let paths = {
    publicPath,
    buildPath: "build",
    resolveApp,
    pageConfig,
    serverConfig,
};
paths.resolveAlias = {
    "@global": paths.resolveApp("src/global.js"),
    "@utils": paths.resolveApp("src/utils"),
    "@layouts": paths.resolveApp("src/layouts"),
    "@components": paths.resolveApp("src/components"),
    "@pages": paths.resolveApp("src/pages"),
    "@res": paths.resolveApp("src/res"),
};
paths.ENV = {// 环境变量
    PUBLIC_PATH: JSON.stringify(paths.publicPath),
    API_PATH: JSON.stringify(apiPath),
    FILE_PATH: JSON.stringify(fileDirectory.startsWith("http") ? fileDirectory : filePath),
    PROJECT_NAME: JSON.stringify(projectName),
};
console.log(JSON.stringify(paths));
module.exports = paths;
