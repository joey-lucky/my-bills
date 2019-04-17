export const publicPath = process.env["PUBLIC_PATH"] || "";
export const apiPath = process.env["API_PATH"] || "";

export const globalStyles = {
  container:{
      width:"100%",
      height:"100%",
      position:"relative"
  }
};

window.getBasePath = () => {
    return apiPath;
};
