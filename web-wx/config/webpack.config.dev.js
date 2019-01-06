const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const paths = require("./paths");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let {apiPath, allowedHost, port, publicPath} = paths;

module.exports = {
    devtool: "source-map",
    // devtool: false,
    mode: "development",
    entry: {
        home: paths.resolveApp("src/pages/home/index.js"),
        login: paths.resolveApp("src/pages/login/index.js")
    },
    output: {
        path: paths.resolveApp("build"),
        publicPath: publicPath,
        filename: "static/js/bundle.[name].[hash].js"
    },
    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.json'],
        alias: {
            "@global": paths.resolveApp("src/global.js"),
            "@utils": paths.resolveApp("src/utils"),
            "@asserts": paths.resolveApp("src/asserts"),
            "@components": paths.resolveApp("src/components"),
        }
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
                use: [MiniCssExtractPlugin.loader, {loader: 'css-loader', options: {modules: true}}]
            },
            {
                test: /\.(less)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', {loader: 'less-loader', options: {javascriptEnabled: true}}]
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
        contentBase: paths.resolveApp("build"),
        port: port,
        publicPath: publicPath,
        historyApiFallback: {
            rewrites: [
                {
                    from: new RegExp("^" + publicPath+"/login"),
                    to: publicPath + "/login.html"
                },
                {
                    from: new RegExp("^" + publicPath+"/home"),
                    to: publicPath + "/home.html"
                },
                {
                    from: new RegExp("^"+publicPath),
                    to: publicPath + "/login.html"
                },
            ]
        },
        disableHostCheck: true,
        open: true,
        openPage: publicPath.substr(1),
        //跨域？不能存在的。
        allowedHosts: [allowedHost],
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
                PUBLIC_PATH: JSON.stringify(publicPath),
                API_PATH: JSON.stringify(apiPath),
            }
        }),
        new MiniCssExtractPlugin({
            filename: "css/bundle.[name].[hash].css",
            chunkFilename: "css/bundle.[id].[hash].css",
        }),
        new HtmlWebpackPlugin({
            PUBLIC_PATH: publicPath,
            TITLE: "综合平台",
            chunks: ["home"],
            filename: "home.html",
            template: paths.resolveApp("public/index.html")
        }),
        new HtmlWebpackPlugin({
            PUBLIC_PATH: publicPath,
            TITLE: "登录",
            chunks: ["login"],
            filename: "login.html",
            template: paths.resolveApp("public/index.html")
        }),
    ]
};

