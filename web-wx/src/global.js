export const publicPath = process.env["PUBLIC_PATH"] || "";
const apiPath = process.env["API_PATH"] || "";
window.getBasePath = () => {
    return apiPath;
};
