const paths = require("./paths");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const publicPath = paths.publicPath;

module.exports = {
    // devtool: "source-map",
    devtool: false,
    mode: "production",
    entry: paths.resolveApp("src/index.js"),

    output: {
        path: paths.resolveApp("build"),
        publicPath: publicPath,
        filename: "js/bundle.[name].[hash].js"
    },

    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.json']
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
        new CleanWebpackPlugin(["build"]),
        new CopyWebpackPlugin([{from: 'public', to: "view", ignore: "*.html"}]),
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: "css/bundle.[name].[hash].css",
            chunkFilename: "css/bundle.[id].[hash].css",
        }),
        new webpack.DefinePlugin({//全局变量
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
                PUBLIC_PATH: JSON.stringify(publicPath)
            }
        }),
        new HtmlWebpackPlugin({
            PUBLIC_PATH: publicPath,
            filename: "view/index.html",
            template: paths.resolveApp("public/index.html")
        }),
    ]
};
