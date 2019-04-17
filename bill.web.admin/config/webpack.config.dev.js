const webpack = require("webpack");
const express = require("express");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const paths = require("./paths");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

let {
    pages = [], pageVersion,
    apiPath, allowedHost, ENV, resolveAlias,
    port, publicPath, resolveApp
    , filePath, fileDirectory
} = paths;

let config = {
    // devtool: "inline-source-map",
    devtool: "cheap-module-eval-source-map",
    mode: "development",
    entry: pages.reduce((previousValue, pageName) => {
        previousValue[pageName] = [
            'babel-polyfill',
            'whatwg-fetch',
            resolveApp("src/pages/" + pageName + "/index.js")
        ];
        return previousValue;
    }, {}),
    output: {
        path: paths.resolveApp("build"),
        publicPath: publicPath,
        filename: "js/bundle.[name].[hash].js",
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
        ...pages.map(pageName => {
            return new HtmlWebpackPlugin({
                PUBLIC_PATH: publicPath,
                chunks: [pageName],
                inject: true,
                filename: "view/" + pageName + ".html",
                template: paths.resolveApp("src/pages/" + pageName + "/index.html")
            })
        })
    ]
};

config.devServer = {
    // host: "127.0.0.1",
    hot: true,
    contentBase: resolveApp("build"),
    port: port,
    publicPath: publicPath,
    historyApiFallback: {
        rewrites: [
            ...pages.map(pageName => ({
                from: new RegExp(`^${publicPath}/${pageName}`),
                to: `${publicPath}/view/${pageName}.html`
            })),
            {
                from: new RegExp("^" + publicPath),
                to: `${publicPath}/view/${pages[0]}.html`
            },
        ]
    },
    disableHostCheck: true,
    open: true,
    openPage: publicPath.substr(1),
    //跨域？不能存在的。
    allowedHosts: [allowedHost],
    before(app) {
        if (!fileDirectory.startsWith("http")) {
            app.use(filePath, express.static(fileDirectory));
        }
    },
    proxy: {
        [apiPath]: {
            target: allowedHost,
            // 因为使用的是https，会有安全校验，所以设置secure为false
            secure: false,
            // port: 80,
            // ingorePath 默认即为 false, 注释掉也可以
            // ingorePath: false,
            // changeOrigin是关键，如果不加这个就无法跳转请求
            changeOrigin: true,
        },
        [`/${paths.projectName}/upload`]: {
            target: allowedHost,
            secure: false,
            changeOrigin: true,
        }
    },
    // useLocalIp: true,
    index: "/index.html",
};

module.exports = config;

