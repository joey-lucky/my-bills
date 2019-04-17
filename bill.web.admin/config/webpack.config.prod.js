const paths = require("./paths");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

let {publicPath, pageVersion, pages, resolveApp, ENV, resolveAlias} = paths;
let config = {
    // devtool: "source-map",
    devtool: false,
    mode: "production",
    entry: pages.reduce((previousValue, pageName) => {
        previousValue[pageName] = ['babel-polyfill','whatwg-fetch',resolveApp("src/pages/" + pageName + "/index.js")];
        return previousValue;
    }, {}),
    output: {
        path: paths.resolveApp("build"),
        publicPath: publicPath,
        filename: (chunkData) => {
            return "js/bundle.[name]." + pageVersion[chunkData.chunk.name] + ".js";
        },
    },
    resolve: {
        // extensions: ['.wasm', '.mjs', '.js', '.json'],
        extensions: ['.js','.jsx'],
        alias: resolveAlias
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: "babel-loader",
                // exclude: /node_modules/,
                exclude:[resolveApp("node_modules")],
                options: {
                    //stage-1 支持成员变量
                    presets: ['es2015', 'react', "stage-1",'babel-polyfill'],
                    plugins: [
                        //装饰器支持
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
        new CleanWebpackPlugin([paths.resolveApp("build")], {root: paths.resolveApp(".")}),
        // new CopyWebpackPlugin([{from: 'public', to: "public"}]),
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            chunkFilename: (chunkData) => {
                return "css/bundle.[id]." + pageVersion[chunkData.chunk.name] + ".css";
            },
            filename: (chunkData) => {
                return "css/bundle.[id]." + pageVersion[chunkData.chunk.name] + ".css";
            },
        }),
        new webpack.DefinePlugin({//全局变量
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
                ...ENV,
            }
        }),
        // new webpack.ContextReplacementPlugin(
        //     /moment[/\\]locale$/,
        //     /zh-cn/,
        // ),
        ...pages.map(pageName => {
            return new HtmlWebpackPlugin({
                PUBLIC_PATH: publicPath,
                chunks: [pageName],
                inject: true,
                filename: "view/" + pageName + ".html",
                template: paths.resolveApp("src/pages/" + pageName + "/index.html")
            })
        }),
        // new BundleAnalyzerPlugin()
    ]
};
module.exports = config;
