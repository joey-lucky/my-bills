const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const paths = require("./paths");
const CopyWebpackPlugin = require("copy-webpack-plugin");

let {pageConfig, buildPath, ENV, resolveAlias, publicPath, resolveApp,} = paths;


let config = {
    // devtool: "inline-source-map",
    devtool: "cheap-module-eval-source-map",
    mode: "development",
    entry: Object.keys(pageConfig).reduce((previousValue, pageName) => {
        previousValue[pageName] =  resolveApp(pageConfig[pageName].entry);
        return previousValue;
    }, {}),
    output: {
        path: paths.resolveApp(buildPath),
        publicPath: publicPath,
        filename: (chunkData) => {
            let name = chunkData.chunk.name;
            return pageConfig[name].jsPath;
        },
    },
    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.json'],
        alias: resolveAlias
    },
    // externals: dllConfig.entry.vendors,
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: "babel-loader",
                include: paths.resolveApp("src"),
                options: {
                    cacheDirectory: true,
                    //stage-1 支持成员变量
                    presets: ['es2015', 'react', "stage-1", 'babel-polyfill'],
                    plugins: [
                        //装饰器支持
                        "transform-decorators-legacy",
                        "transform-runtime"
                    ]
                }
            },
            {
                test: /\.(css)$/,
                use: ["style-loader", {loader: 'css-loader', options: {modules: true}}]
            },
            {
                test: /\.(less)$/,
                use: ["style-loader", 'css-loader', {loader: 'less-loader', options: {javascriptEnabled: true}}]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                loader: "file-loader",
                options: {
                    publicPath: publicPath,
                    name: "image/[hash].[ext]"
                },
            }
        ]
    },

    optimization: {
        namedModules: true,
        minimize: false,
    },

    plugins: [
        new CopyWebpackPlugin([{from: 'public', to: "public"}]),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
                ...ENV,
            }
        }),
        ...Object.keys(pageConfig).map(pageName => {
            return new HtmlWebpackPlugin({
                PUBLIC_PATH: publicPath,
                chunks: [pageName],
                inject: true,
                filename: pageConfig[pageName].htmlPath,
                template: paths.resolveApp(pageConfig[pageName].htmlTemplate)
            })
        }),
    ]
};

let {
    rewrites,
    port,
    apiTarget,
    apiPath,
} = paths.server;


config.devServer = {
    // host: "127.0.0.1",
    hot: true,
    contentBase: resolveApp(buildPath),
    port: port,
    publicPath: publicPath,
    historyApiFallback: {
        rewrites: rewrites.map(item => ({
            from: new RegExp(item.from),
            to: item.to
        }))
    },
    disableHostCheck: true,
    open: true,
    openPage: publicPath.substr(1),
    //跨域？不能存在的。
    allowedHosts: [apiTarget],
    before(app) {

    },
    proxy: {
        [apiPath]: {
            target: apiTarget,
            secure: false,
            changeOrigin: true,
        },
    },
    // useLocalIp: true,
    index: "/index.html",
};

module.exports = config;

