const webpack = require('webpack')
const library = '[name]_lib'
const path = require('path')

var vendor = {
    entry: {
        vendors: ['react', 'react-router-dom', 'history', 'antd', 'react-dom', 'jquery', 'mobx', 'mobx-react','antd-mobile']
    },
    output: {
        filename: 'dll.js',
        path: path.resolve(__dirname, 'js/build/'),
        library: library
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, 'manifest.json'),
            name: library,
            context: __dirname
        }),
        new webpack.optimize.UglifyJsPlugin()
    ]
};

module.exports = [vendor];
