/**
 * 大华视频工具类
 */
import {getPublicPath} from "@global";

export default class VideoUntils {

    /**
     * 判断是否IE浏览器
     * @returns {boolean}
     */
    static isIE() {
        let userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
        let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; // 判断是否IE<11浏览器
        let isEdge = userAgent.indexOf("Edge") > -1 && !isIE; // 判断是否IE的Edge浏览器
        let isIE11 = userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1;
        let obj = {};
        if (isIE) {
            let reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            let fIEVersion = parseFloat(RegExp.$1);
            obj = {isIE: true, version: fIEVersion};
            return obj;
        } else if (isEdge) {
            obj = {isIE: true, version: 12};
            return obj;
        } else if (isIE11) {
            obj = {isIE: true, version: 11};
            return obj;
        } else {
            obj = {isIE: false, version: 0};
            return obj;
        }
    }

    /**
     * 播放返回错误码
     * @param code
     * @param type
     * @returns {string}
     */
    /* static onPlayResult(code, type) {
        if (type === -1) {
            return;
        }

        if (type === 0) {// 播放状态
            switch (code) {
                case "0":
                    document.getElementById("videoAlarm").innerHTML = "提示：组帧失败，错误状态";
                    break;
                case "1":
                    document.getElementById("videoAlarm").innerHTML = "提示：内部要求关闭,如连接断开等，错误状态";
                    break;
                case "2":
                    document.getElementById("videoAlarm").innerHTML = "提示：会话已经收到Describe响应，连接建立中";
                    break;
                case "3":
                    document.getElementById("videoAlarm").innerHTML = "提示：RTSP鉴权失败，错误状态";
                    return "提示：RTSP鉴权失败，错误状态";
                case "4":
                    document.getElementById("videoAlarm").innerHTML = "提示：收到子站响应，连接成功";
                    return "提示：收到子站响应，连接成功";
                case "5":
                    document.getElementById("videoAlarm").innerHTML = "提示：录像文件回放正常结";
                    return "提示：录像文件回放正常结";
                case "6":
                    document.getElementById("videoAlarm").innerHTML = "提示：收到PAUSE响应";
                    return "提示：收到PAUSE响应";
                case "99":
                    document.getElementById("videoAlarm").innerHTML = "提示：基于503错误码的连接最大数错误，错误状态";
                    return "提示：基于503错误码的连接最大数错误，错误状态";
                case "100":
                    document.getElementById("videoAlarm").innerHTML = "提示：用户信息起始码，服务端上层传过来的信息码会在该起始码基础上累加，错误状态";
                    return "提示：用户信息起始码，服务端上层传过来的信息码会在该起始码基础上累加，错误状态";
                default:
                    document.getElementById("videoAlarm").innerHTML = "提示：异常错误";
                    return "提示：异常错误";
            }
        } else if (type === 99) {
            switch (code) {
                case "-1000":
                    document.getElementById("videoAlarm").innerHTML = "提示：HTTP交互出错或超时";
                    return "提示：HTTP交互出错或超时";
                case "OP1001":
                    document.getElementById("videoAlarm").innerHTML = "操作失败";
                    return "操作失败。";
                case "OP1007":
                    document.getElementById("videoAlarm").innerHTML = "无效的方法调用";
                    return "无效的方法调用";
                case "OP1008":
                    document.getElementById("videoAlarm").innerHTML = "appId为空";
                    return "appId为空";
                case "OP1009":
                    document.getElementById("videoAlarm").innerHTML = "权限不足，无法执行此操作";
                    return "权限不足，无法执行此操作";
                case "OP1010":
                    document.getElementById("videoAlarm").innerHTML = "应用被冻结";
                    return "应用被冻结";
                case "OP1011":
                    document.getElementById("videoAlarm").innerHTML = "当天调用接口次数已达上限";
                    return "当天调用接口次数已达上限";
                case "TK1002":
                    document.getElementById("videoAlarm").innerHTML = "token已过期或不存在，请重新获取token";
                    return "token已过期或不存在，请重新获取token";
                case "TK1003":
                    document.getElementById("videoAlarm").innerHTML = "非法token，请传入正确的token";
                    return "非法token，请传入正确的token";
                case "DV1007":
                    document.getElementById("videoAlarm").innerHTML = "设备离线";
                    return "设备离线";
                default:
                    document.getElementById("videoAlarm").innerHTML = "错误码" + code;
                    return "错误码：" + code;
            }
        }
    }*/
    static loadPlugin(fIEVersion) {
        let DEFAULT_VERSION = "8.0";  // 线上为ie8
        if (fIEVersion < parseFloat(DEFAULT_VERSION)) {// 小于ie8
            return "0";// 提示：ie版本要求ie8以上
        } else {// ie9以上
            let hasPlugin = false;
            try {
                // let comActiveX = new window.ActiveXObject("LCOPENSDKPLUGIN.LCOpenSDKPlugInCtrl.1");
                    // delete comActiveX;
                hasPlugin = true;
            } catch (e) {
                hasPlugin = false;
            }

            if (hasPlugin === false) {// 未安装插件
                window.open(getPublicPath() + "/public/plugin/LCOpenSDKPlugIn.exe");
                return "1";
            } else {
                return "2";
            }

        }
    }
}
