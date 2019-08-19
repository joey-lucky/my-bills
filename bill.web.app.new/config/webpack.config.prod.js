const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const paths = require("./paths");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

let {pageConfig, publicPath, buildPath, ENV, resolveAlias, resolveApp} = paths;
let cdnPath = "http://cdn.hjoey.com" + publicPath;
let config = {
    devtool: false,
    mode: "production",
    entry: resolveApp(pageConfig.entry),
    output: {
        path: paths.resolveApp(buildPath),
        publicPath: cdnPath,
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
                        "transform-runtime",
                        ["import", [
                            {
                                "libraryName": "antd-mobile",
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
                    publicPath: cdnPath,
                    name: pageConfig.imagePath,
                },
            },
            {
                test: /\.(eot|woff2|woff|ttf)$/,
                loader: "file-loader",
                options: {
                    publicPath: cdnPath,
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
        new webpack.ContextReplacementPlugin(
            /moment[/\\]locale$/,
            /zh-cn/,
        ),
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
        new CompressionPlugin(),
        new BundleAnalyzerPlugin()
    ]
};
module.exports = config;
