import {Ajax} from "@utils/ajax";
import * as React from "react";

export default class LogUrl {
    static   _urlList = {};
    static   _log = true;
    static   _currPath = "";
    static   _extraInfo;

    static init(history) {
        this._currPath = history.location.pathname;
        history.listen((location, action) => {
            if (this._log) {
                let extra = this._extraInfo && this._extraInfo(this._currPath) || "";
                console.log("LogUrl", extra, "页面地址：" + this._currPath, "使用的api：\n" + Object.keys(this._urlList).map(item => "/api" + item).join(","))
            }
            this._currPath = location.pathname;
            this._urlList = {};
        });
    }

    static enableLog(enable = false) {
        this._log = enable;
        if (enable) {
            if (!Ajax._apiPostTemp) {
                Ajax._apiPostTemp = Ajax.apiPost;
            }
            Ajax.apiPost = (url, ...args) => {
                this._urlList[url] = url;
                return Ajax._apiPostTemp(url, ...args);
            };
        } else {
            if (Ajax._apiPostTemp) {
                Ajax.apiPost = Ajax._apiPostTemp;
            }
        }
    }

    static setExtraInfo(extra) {
        this._extraInfo = extra;
    }
}
