const webpack = require("webpack");
const fs = require("fs");
const paths = require("./paths");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

let homeConfig = require("./webpack.config.home.prod");
let loginConfig = require("./webpack.config.login.prod");

function deleteFolder(path) {
    let files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

function build() {
    console.log("start build");
    let  homeCompile = webpack(homeConfig);
    new CleanWebpackPlugin([paths.resolveApp("build")], {root: paths.resolveApp(".")}).apply(homeCompile);
    new CopyWebpackPlugin([{from: 'public', to: "view", ignore: "*.html"}]).apply(homeCompile);
    homeCompile.run((err, stats) => {
        if (err && err.message) {
            console.log(err.message);
        } else {
            console.log(stats.toJson({all: false, warnings: true, errors: true}));
            console.log("home page build success");
        }
        webpack(loginConfig).run((err, stats) => {
            if (err && err.message) {
                console.log(err.message);
            } else {
                console.log("login page build success");
            }
        });
    });
}
build();
