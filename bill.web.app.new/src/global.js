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
