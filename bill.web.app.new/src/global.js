import PropTypes from "prop-types";

export const publicPath = process.env.PUBLIC_PATH || "";
export const apiPath = process.env.API_PATH || "";
export const filePath = process.env.FILE_PATH || "";

export const projectName = process.env.PROJECT_NAME || "";
export const rem = document.documentElement.clientWidth * 100 / 1080;
export const getUploadPath = () => "/omip/api/upload";
export const propTypes = {
    react: {
        children: PropTypes.any
    },
    routeComponent: {
        match: PropTypes.shape({
            path: PropTypes.string.isRequired,
        }),
        history: PropTypes.any,
        location: PropTypes.any
    }
};




/**
 * 计算是 sp * 2.5 / 100
 * tooltip 12sp 小字提示
 * 14sp（桌面端13sp） 正文/按钮文字
 * 16sp（桌面端15sp） 小标题
 * 20sp Appbar文字
 * 24sp 大标题
 * 34sp/45sp/56sp/112sp 超大号文字
 * 超大号改成 +0.2rem
 */
export const fontSizes = {
    display4: "1.3rem",
    display3: "1.1rem",
    display2: "0.9rem",
    display1: "0.7rem",
    appBar: "0.5rem",
    title: "0.4rem",
    text: "0.35rem",
    tooltip: "0.3rem",
};

//设置rem对应的像素大小
document.documentElement.style.fontSize = rem + "px";
