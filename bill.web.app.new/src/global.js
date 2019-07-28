import PropTypes from "prop-types";
const useMock = process.env.USE_MOCK || false;
export const publicPath = process.env.PUBLIC_PATH ;
export const apiPath =useMock?"/mock": process.env.API_PATH;
export const filePath = process.env.FILE_PATH || "";
export const projectName = process.env.PROJECT_NAME || "";
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

const config = {
    rem:14,
};

export function getRem(){
    return config.rem;
}

function initSize() {
    const clientWidth = Math.min(document.documentElement.clientHeight*0.7, document.documentElement.clientWidth);
    let docEl = window.document.documentElement;
    document.getElementById("root").style.height = docEl.clientHeight+"px" ;
    document.getElementById("root").style.width = clientWidth+"px" ;
    config.rem = clientWidth * 100 / 1080;
    //设置rem对应的像素大小
    document.documentElement.style.fontSize = config.rem + "px";
}

initSize();
