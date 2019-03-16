const paths = require("./paths");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let {publicPath, pageVersion, pages, apiPath, resolveApp} = paths;

let config = {
    devtool: "source-map",
    mode: "production",
    entry: pages.reduce((previousValue, pageName) => {
        previousValue[pageName] = resolveApp("src/pages/" + pageName + "/index.js");
        return previousValue;
    }, {}),
    output: {
        path: paths.resolveApp("build"),
        publicPath: publicPath,
        filename: (chunkData) => {
            return "js/bundle.[name]." + pageVersion[chunkData.chunk.name] + ".js"
        },
    },
    externals: {
        "@antv/g2": "G2",
    },
    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.json'],
        alias: {
            "@global": paths.resolveApp("src/global.js"),
            "@utils": paths.resolveApp("src/utils"),
            "@layouts": paths.resolveApp("src/layouts"),
            "@components": paths.resolveApp("src/components"),
            "@services": paths.resolveApp("src/services"),
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    //stage-1 支持成员变量
                    presets: ['es2015', 'react', "stage-1"],
                    plugins: [
                        //装饰器支持
                        "transform-decorators-legacy",
                        "transform-runtime",
                        ["import", {
                            "libraryName": "antd",
                            "libraryDirectory": "es",
                            "style": "css"
                        }]
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
                PUBLIC_PATH: JSON.stringify(publicPath),
                API_PATH: JSON.stringify(apiPath),
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
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new BundleAnalyzerPlugin()
    ]
};
module.exports = config;
