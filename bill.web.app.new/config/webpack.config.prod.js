const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const paths = require("./paths");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

let {pageConfig, publicPath, buildPath, ENV, resolveAlias, resolveApp} = paths;

let config = {
    devtool: false,
    mode: "production",
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
    externals: {
        "@antv/g2": "G2",
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: "babel-loader",
                include: resolveApp("src"),
                options: {
                    cacheDirectory: true,
                    presets: ["es2015", "react", "stage-1", "babel-polyfill"],
                    plugins: [
                        "transform-decorators-legacy",
                        "transform-runtime"
                    ]
                }
            },
            {
                test: /\.(css)$/,
                use: [MiniCssExtractPlugin.loader, {loader: 'css-loader', options: {modules: true}}]
            },
            {
                test: /\.(less)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', {
                    loader: 'less-loader',
                    options: {javascriptEnabled: true}
                }]
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
        minimize: true,
    },
    plugins: [
        new CleanWebpackPlugin([resolveApp("build")], {root: paths.resolveApp(".")}),
        new CopyWebpackPlugin([{from: "public", to: "public"}]),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production"),
                ...ENV,
            }
        }),
        new MiniCssExtractPlugin({
            chunkFilename: pageConfig.cssPath,
            filename: pageConfig.cssPath,
        }),
        new HtmlWebpackPlugin({
            PUBLIC_PATH: publicPath,
            inject: true,
            filename: pageConfig.htmlPath,
            template: paths.resolveApp(pageConfig.htmlTemplate)
        }),
        new BundleAnalyzerPlugin()
    ]
};

//
// let config = {
//     devtool: false,
//     // devtool: "source-map",
//     mode: "production",
//     entry: Object.keys(pageConfig).reduce((previousValue, pageName) => {
//         previousValue[pageName] = [
//             "babel-polyfill",
//             "whatwg-fetch",
//             resolveApp(pageConfig[pageName].entry)
//         ];
//         return previousValue;
//     }, {}),
//     // externals: {
//     //     "moment": "moment",
//     //     "react": "React",
//     //     "react-dom": "ReactDOM",
//     //     "antd-mobile":"antdMobile",
//     //     "jquery":"jQuery",
//     // },
//     externals: {
//         "BMap": "BMap",
//     },
//     output: {
//         path: paths.resolveApp(buildPath),
//         publicPath: publicPath,
//         filename: (chunkData) => {
//             let name = chunkData.chunk.name;
//             return pageConfig[name].jsPath;
//         },
//     },
//     resolve: {
//         extensions: [".js", ".jsx"],
//         alias: resolveAlias
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.(js|jsx)$/,
//                 loader: "babel-loader",
//                 // exclude: /node_modules/,
//                 exclude: [resolveApp("node_modules")],
//                 options: {
//                     // stage-1 支持成员变量
//                     presets: ["es2015", "react", "stage-1", "babel-polyfill"],
//                     plugins: [
//                         // 装饰器支持
//                         "transform-decorators-legacy",
//                         "transform-runtime",
//                         ["import", [
//                             {
//                                 "libraryName": "antd",
//                                 "libraryDirectory": "es",
//                                 "style": "less"
//                             }
//                         ]],
//                     ]
//                 }
//             },
//             {
//                 test: /\.(css)$/,
//                 use: [MiniCssExtractPlugin.loader, {loader: "css-loader", options: {modules: true}}]
//             },
//             {
//                 test: /\.(less)$/,
//                 use: [MiniCssExtractPlugin.loader, "css-loader", {
//                     loader: "less-loader",
//                     options: {javascriptEnabled: true}
//                 }]
//             },
//             {
//                 test: /\.(jpe?g|png|gif|svg)$/,
//                 loader: "file-loader",
//                 options: {
//                     publicPath: publicPath,
//                     name: "image/[hash].[ext]"
//                 },
//             }
//         ]
//     },
//     optimization: {
//         namedModules: true,
//         minimize: true,
//         mergeDuplicateChunks: true,
//     },
//     plugins: [
//         new CleanWebpackPlugin([paths.resolveApp(buildPath)], {root: paths.resolveApp("../build")}),
//         new CopyWebpackPlugin([{from: "public", to: "public"}]),
//         new webpack.HotModuleReplacementPlugin(),
//         new MiniCssExtractPlugin({
//             chunkFilename: (chunkData) => {
//                 let name = chunkData.chunk.name;
//                 return pageConfig[name].cssPath;
//             },
//             filename: (chunkData) => {
//                 let name = chunkData.chunk.name;
//                 return pageConfig[name].cssPath;
//             },
//         }),
//         new webpack.DefinePlugin({// 全局变量
//             "process.env": {
//                 NODE_ENV: JSON.stringify("production"),
//                 ...ENV,
//             }
//         }),
//         // new webpack.ContextReplacementPlugin(
//         //     /moment[/\\]locale$/,
//         //     /zh-cn/,
//         // ),
//         ...Object.keys(pageConfig).map(pageName => new HtmlWebpackPlugin({
//             PUBLIC_PATH: publicPath,
//             chunks: [pageName],
//             inject: true,
//             filename: pageConfig[pageName].htmlPath,
//             template: paths.resolveApp(pageConfig[pageName].htmlTemplate)
//         })),
//         // new BundleAnalyzerPlugin()
//     ]
// };

module.exports = config;
