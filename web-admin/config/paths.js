const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const packageJson = require(resolveApp('package.json'));
const publicPath = packageJson.homepage.replace(/^(http|https)(\:\/\/)[\w|.|:]*/,"");
module.exports = {
    resolveApp:resolveApp,
    publicPath: publicPath,
    apiUrl:packageJson.apiUrl,
};
