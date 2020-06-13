const webpack = require("webpack");
const express = require("express");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const paths = require("./paths");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

let {pageConfig, publicPath, buildPath, ENV, resolveAlias, resolveApp} = paths;

let config = {
    devtool: "cheap-module-eval-source-map",
    mode: "development",
    entry: resolveApp(pageConfig.entry),
    output: {
        path: paths.resolveApp(buildPath),
        publicPath: publicPath,
        filename: pageConfig.jsPath,
    },
    resolve: {
        extensions: [".wasm", ".mjs", ".js", ".json"],
        alias: resolveAlias
    },
    externals: {},
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: "babel-loader",
                include: resolveApp("src"),
                options: {
                    cacheDirectory: true,
                }
            },
            {
                test: /\.(css)$/,
                use: ["style-loader", {loader: "css-loader", options: {modules: true}}]
            },
            {
                test: /\.(less)$/,
                use: ["style-loader", "css-loader", {loader: "less-loader", options: {javascriptEnabled: true}}]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                loader: "file-loader",
                options: {
                    publicPath: publicPath,
                    name: pageConfig.imagePath,
                },
            },
            {
                test: /\.(eot|woff2|woff|ttf)$/,
                loader: "file-loader",
                options: {
                    publicPath: publicPath,
                    name: pageConfig.fontsPath,
                },
            }
        ]
    },
    optimization: {
        namedModules: true,
        minimize: false,
        splitChunks: {
            chunks: 'all',
            maxSize: 250000,
            cacheGroups: {
                react: {
                    test: /[\\/]node_modules[\\/]react/,
                    name: 'react',
                    chunks: 'all',
                    enforce: true
                },
                mobx: {
                    test: /[\\/]node_modules[\\/]mobx/,
                    name: 'mobx',
                    chunks: 'all',
                    enforce: true
                },
                ant: {
                    test: /[\\/]node_modules[\\/]@?ant/,
                    name: 'ant',
                    chunks: 'all',
                    enforce: true
                },
                src: {
                    test: /[\\/]src[\\/]/,
                    name: 'src',
                    chunks: 'all',
                    enforce: true
                }
            }
        },
    },
    plugins: [
        new CleanWebpackPlugin([paths.resolveApp(buildPath)]),
        new CopyWebpackPlugin([{from: "public", to: "public"}]),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("development"),
                ...ENV,
            }
        }),
        new HtmlWebpackPlugin({
            PUBLIC_PATH: publicPath,
            inject: true,
            filename: pageConfig.htmlPath,
            template: paths.resolveApp(pageConfig.htmlTemplate)
        })
    ]
};

let {
    rewrites,
    staticProxy,
    port,
    apiTarget,
    apiPath,
} = paths.serverConfig;


config.devServer = {
    host: "0.0.0.0",
    hot: true,
    contentBase: resolveApp(buildPath),
    port: port,
    publicPath: publicPath,
    historyApiFallback: {
        verbose: true,
        rewrites: [
            {
                from: new RegExp("^" + publicPath),
                to: function (context) {
                    let pathname = context.parsedUrl.pathname;
                    if (/[\.]/.test(pathname)) {
                        return pathname;
                    } else {
                        return publicPath + pageConfig.htmlPath;
                    }
                }
            },
        ]
    },
    disableHostCheck: true,
    open: true,
    openPage: publicPath.substr(1),
    allowedHosts: [apiTarget],
    before(app) {
        app.use("/mock", express.static(resolveApp("mock")));
    },
    proxy: {
        [apiPath]: {
            target: apiTarget,
            secure: false,
            changeOrigin: true,
        },
    },
    useLocalIp: true,
    index: "/index.html",
};

module.exports = config;

