const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const paths = require("./paths");

let {pages,pageVersion,apiPath, allowedHost, port, publicPath,resolveApp} = paths;

module.exports = {
    devtool: "cheap-module-eval-source-map",
    mode: "development",
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
    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.json'],
        alias: {
            "@global": resolveApp("src/global.js"),
            "@utils": resolveApp("src/utils"),
            "@layouts": resolveApp("src/layouts"),
            "@components": resolveApp("src/components"),
            "@services": resolveApp("src/services"),
        }
    },
    // externals: dllConfig.entry.vendors,
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
                use: ["style-loader",'css-loader', {loader: 'less-loader', options: {javascriptEnabled: true}}]
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
        contentBase: resolveApp("build"),
        port: port,
        publicPath: publicPath,
        historyApiFallback: {
            rewrites: [
                ...pages.map((pageName)=>({
                    from: new RegExp("^" + publicPath+"/"+pageName),
                    to: publicPath + "/view/"+pageName+".html"
                })),
                {
                    from: new RegExp("^"+publicPath+"/"),
                    to: publicPath + "/view/login.html"
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
        // useLocalIp: true,
        index: "/index.html",
    },
    optimization: {
        namedModules: true,
        minimize: false,
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
        ...pages.map(pageName => {
            return new HtmlWebpackPlugin({
                PUBLIC_PATH: publicPath,
                chunks: [pageName],
                inject: true,
                filename: "view/" + pageName + ".html",
                template: paths.resolveApp("src/pages/" + pageName + "/index.html")
            })
        })
    ]
};

