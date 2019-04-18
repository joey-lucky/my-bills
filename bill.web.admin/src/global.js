export const publicPath = process.env.PUBLIC_PATH || "";
export const apiPath = process.env.API_PATH || "";
export const filePath = process.env.FILE_PATH || "";
export const projectName = process.env.PROJECT_NAME || "";

export const getUploadPath = () => "/" + projectName + "/upload";

