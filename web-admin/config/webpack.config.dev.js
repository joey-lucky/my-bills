const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const paths = require("./paths");

const publicPath = paths.publicPath;
const apiHost = paths.apiUrl;

module.exports = {
    devtool: "inline-source-map",
    mode: "development",
    entry: {
        app: [
            paths.resolveApp("src/index.js")
        ]
    },
    output: {
        path: paths.resolveApp("dist"),
        publicPath: publicPath,
        filename: "static/js/bundle.[name].[hash].js"
    },
    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: "babel-loader",
                include: paths.resolveApp("src"),
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
                    name: "static/image/[hash].[ext]"
                },
            }
        ]
    },
    devServer: {
        // host: "127.0.0.1",
        hot: true,
        contentBase: paths.resolveApp("dist"),
        port: 8080,
        publicPath: publicPath,
        historyApiFallback: {
            rewrites: [{from: new RegExp("^" + publicPath), to: publicPath + "/index.html"}]
        },
        disableHostCheck: true,
        open: true,
        openPage: publicPath.substr(1),
        //跨域？不能存在的。
        allowedHosts: [apiHost],
        proxy: {
            "/api": {
                target: apiHost,
                // 因为使用的是https，会有安全校验，所以设置secure为false
                secure: false,
                // port: 80,
                // ingorePath 默认即为 false, 注释掉也可以
                // ingorePath: false,
                // changeOrigin是关键，如果不加这个就无法跳转请求
                changeOrigin: true,
            }
        },
        index: "/index.html",
    },
    optimization: {
        namedModules: true,

    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
                PUBLIC_PATH: JSON.stringify(publicPath)
            }
        }),
        new HtmlWebpackPlugin({
            PUBLIC_PATH: publicPath,
            filename: "index.html",
            template: paths.resolveApp("public/index.html")
        }),
    ]
};

