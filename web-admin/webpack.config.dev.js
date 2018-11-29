const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const publicPath = "/react/demo";

//路径配置
function createConfig() {
    process.env.PUBLIC_URL = publicPath;
    return {
        devtool: "source-map",
        mode: "development",
        entry: {
            app: [
                path.resolve(__dirname, "src/index.js")
            ]
        },
        output: {
            path: path.join(__dirname, "dist"),
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
                    include: path.resolve(__dirname,"src"),
                    options: {
                        //stage-1 支持成员变量
                        presets: ['es2015', 'react', "stage-1"],
                        plugins: [
                            //装饰器支持
                            "transform-decorators-legacy",
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
            host: "192.168.2.71",
            hot: true,
            contentBase: path.resolve(__dirname, "dist"),
            port: 7000,
            publicPath: publicPath,
            historyApiFallback: {
                rewrites: [{from: new RegExp("^" + publicPath), to: publicPath + "/index.html"}]
            },
            disableHostCheck: true,
            open: true,
            openPage: publicPath.substr(1),
            //跨域？不能存在的。
            allowedHosts: ["localhost:8080"],
            index: "/index.html",
        },
        optimization: {
            namedModules: true,
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new HtmlWebpackPlugin({
                PUBLIC_PATH: publicPath,
                filename: "index.html",
                template: path.resolve(__dirname, "public/index.html")
            }),
        ]
    }
}

module.exports = createConfig();
