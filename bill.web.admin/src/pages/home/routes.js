import * as React from "react";
import UserLogin from "./routes/UserLogin";
import UserRegister from "./routes/UserRegister";

export default [
    {
        name: "登录页",
        component: UserLogin,
        path: "/user/login",
        children:[],
    },
    {
        name: "登录页",
        component: UserRegister,
        path: "/user/register",
        children:[],
    },
];