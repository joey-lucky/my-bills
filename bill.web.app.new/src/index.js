import "@babel/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./theme.less";

//初始化
(function () {
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;
    //rem适配设置，设置root大小
    document.getElementById("root").style.height = clientHeight + "px";
    document.getElementById("root").style.width = clientWidth + "px";
    document.documentElement.style.fontSize = clientWidth * 100 / 1080 + "px";
    //移动端软键盘挡住输入框问题解决
    window.addEventListener("resize", () => {
        const currClientHeight = document.documentElement.clientHeight;
        const {bottom} = document.activeElement.getBoundingClientRect();
        if (currClientHeight !== clientHeight && bottom > currClientHeight) {
            let scrollTop = document.documentElement.scrollTop + (bottom - currClientHeight);
            document.documentElement.scrollTo(0, scrollTop);
        }else if (currClientHeight === clientHeight) {
            document.documentElement.scrollTo(0, 0);
        }
    });
})();

ReactDOM.render(
    <App/>,
    document.getElementById("root")
);

