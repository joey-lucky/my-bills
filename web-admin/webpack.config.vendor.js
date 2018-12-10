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
    entry: {
        vendor: [
            // "react", "react-dom",
            // "history", "react-router-dom",
            // "mobx", "mobx-react",
            // "antd","prop-types",
            "moment",
        ],
        // router: [
        //     "history", "react-router-dom"
        // ],
        // state: [
        //     "mobx", "mobx-react"
        // ],
        // ui: [
        //     "antd"
        // ],
        // tools: ["moment"],
        // lint: ["prop-types"],
    },
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: publicPath,
        filename: "static/js/dll.[name].js"
    },
    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.json']
    },
    // externals: [
    //     "react", "react-dom","antd","history"
    //     ,"mobx","mobx-react","moment","prop-types","react-router-dom"
    // ],
    // module: {
    //     rules: [
    //         {
    //             test: /\.(js|jsx)$/,
    //             loader: "babel-loader",
    //             exclude: /node_modules/,
    //             options: {
    //                 //stage-1 支持成员变量
    //                 presets: ['es2015', 'react', "stage-1"],
    //                 plugins: [
    //                     //装饰器支持
    //                     "transform-decorators-legacy",
    //                     "transform-runtime"
    //                 ]
    //             }
    //         },
    //         {
    //             test: /\.(css)$/,
    //             use: [MiniCssExtractPlugin.loader, {loader: 'css-loader', options: {modules: true}}]
    //         },
    //         {
    //             test: /\.(less)$/,
    //             use: [MiniCssExtractPlugin.loader, 'css-loader', {
    //                 loader: 'less-loader',
    //                 options: {javascriptEnabled: true}
    //             }]
    //         },
    //         {
    //             test: /\.(jpe?g|png|gif|svg)$/,
    //             loader: "file-loader",
    //             options: {
    //                 publicPath: publicPath,
    //                 name: "static/image/[hash].[ext]"
    //             },
    //         }
    //     ]
    // },
    optimization: {
        namedModules: true,
        minimize: true,
        mergeDuplicateChunks: true
    },
    plugins: [
        new CleanWebpackPlugin(["dist"]),
        new CopyWebpackPlugin([{from: 'public', to: "", ignore: "*.html"}]),
        new webpack.DllPlugin({
            context: __dirname,
            name: '[name]_[hash]',
            path: path.join(__dirname, 'dist/dll/manifest.json'),
        }),
        new HtmlWebpackPlugin({
            PUBLIC_PATH: publicPath,
            filename: "index.html",
            template: path.resolve(__dirname, "public/index.html")
        }),
    ]
};