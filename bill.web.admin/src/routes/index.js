import Home from "@pages/Home";
import Login from "@pages/Login";
import sysRoute from "./sysRoute";

const loginPage = {
    path: "/login",
    component: Login,
    name: "登录",
};

const homePage = {
    path: "/home",
    component: Home,
    name: "首页",
    children:[sysRoute]
};
export default [loginPage,homePage]; // homeSingleRoute
