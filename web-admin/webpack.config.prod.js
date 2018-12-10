const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let publicPath = "/web/admin";
publicPath = "";
process.env.PUBLIC_URL = publicPath;
module.exports = {
    devtool: false,
    mode: "production",
    entry:path.resolve(__dirname, "src/index.js"),
    // entry: {
    //     app: [
    //         path.resolve(__dirname, "src/index.js")
    //     ],
    //     vendor: [
    //         "react", "react-dom","antd","history"
    //         ,"mobx","mobx-react","moment","prop-types","react-router-dom"
    //     ]
    // },
    output: {
        path: path.join(__dirname, "build"),
        publicPath: publicPath,
        filename: "static/js/bundle.[name].[hash].js"
    },
    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.json']
    },
    // externals: [
    //     "react", "react-dom","antd","history"
    //     ,"mobx","mobx-react","moment","prop-types","react-router-dom"
    // ],
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
                    name: "static/image/[hash].[ext]"
                },
            }
        ]
    },
    optimization: {
        namedModules: true,
        minimize: true,
        mergeDuplicateChunks: true
    },
    plugins: [
        new CleanWebpackPlugin(["build"]),
        new CopyWebpackPlugin([{from: 'dist', to: "", ignore: "dll/"}]),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./dist/dll/manifest.json'),
        }),
        new MiniCssExtractPlugin({
            filename: "static/css/bundle.[name].[hash].css",
            chunkFilename: "static/css/bundle.[id].[hash].css",
        }),
        new HtmlWebpackPlugin({
            PUBLIC_PATH: publicPath,
            filename: "index.html",
            template: path.resolve(__dirname, "dist/index.html")
        }),
    ]
};