const paths = require("./paths");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const express = require("express");

let {publicPath, resolveApp, ENV, resolveAlias, pageConfig, buildPath} = paths;
let config = {
    devtool: false,
    // devtool: "source-map",
    mode: "production",
    entry: Object.keys(pageConfig).reduce((previousValue, pageName) => {
        previousValue[pageName] = [
            "babel-polyfill",
            "whatwg-fetch",
            resolveApp(pageConfig[pageName].entry)
        ];
        return previousValue;
    }, {}),
    // externals: {
    //     "moment": "moment",
    //     "react": "React",
    //     "react-dom": "ReactDOM",
    //     "antd-mobile":"antdMobile",
    //     "jquery":"jQuery",
    // },
    externals: {
        "BMap": "BMap",
    },
    output: {
        path: paths.resolveApp(buildPath),
        publicPath: publicPath,
        filename: (chunkData) => {
            let name = chunkData.chunk.name;
            return pageConfig[name].jsPath;
        },
    },
    resolve: {
        extensions: [".js", ".jsx"],
        alias: resolveAlias
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: "babel-loader",
                // exclude: /node_modules/,
                exclude: [resolveApp("node_modules")],
                options: {
                    // stage-1 支持成员变量
                    presets: ["es2015", "react", "stage-1", "babel-polyfill"],
                    plugins: [
                        // 装饰器支持
                        "transform-decorators-legacy",
                        "transform-runtime",
                        ["import", [
                            {
                                "libraryName": "antd",
                                "libraryDirectory": "es",
                                "style": "less"
                            }
                        ]],
                    ]
                }
            },
            {
                test: /\.(css)$/,
                use: [MiniCssExtractPlugin.loader, {loader: "css-loader", options: {modules: true}}]
            },
            {
                test: /\.(less)$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", {
                    loader: "less-loader",
                    options: {javascriptEnabled: true}
                }]
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
        minimize: true,
        mergeDuplicateChunks: true,
    },
    plugins: [
        new CleanWebpackPlugin([paths.resolveApp(buildPath)], {root: paths.resolveApp("../build")}),
        new CopyWebpackPlugin([{from: "public", to: "public"}]),
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            chunkFilename: (chunkData) => {
                let name = chunkData.chunk.name;
                return pageConfig[name].cssPath;
            },
            filename: (chunkData) => {
                let name = chunkData.chunk.name;
                return pageConfig[name].cssPath;
            },
        }),
        new webpack.DefinePlugin({// 全局变量
            "process.env": {
                NODE_ENV: JSON.stringify("production"),
                ...ENV,
            }
        }),
        // new webpack.ContextReplacementPlugin(
        //     /moment[/\\]locale$/,
        //     /zh-cn/,
        // ),
        ...Object.keys(pageConfig).map(pageName => new HtmlWebpackPlugin({
            PUBLIC_PATH: publicPath,
            chunks: [pageName],
            inject: true,
            filename: pageConfig[pageName].htmlPath,
            template: paths.resolveApp(pageConfig[pageName].htmlTemplate)
        })),
        // new BundleAnalyzerPlugin()
    ]
};
let {
    rewrites,
    staticProxy,
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
    allowedHosts: [apiTarget],
    before(app) {
        staticProxy.forEach((item) => {
            app.use(item.from, express.static(item.to));
        });
    },
    proxy: {
        [apiPath]: {
            target: apiTarget,
            secure: false,
            changeOrigin: true,
        },
        // [apiUploadPath]:{
        //     target: apiTarget,
        //     secure: false,
        //     changeOrigin: true,
        // },
    },
    // useLocalIp: true,
    index: "/index.html",
};

module.exports = config;
