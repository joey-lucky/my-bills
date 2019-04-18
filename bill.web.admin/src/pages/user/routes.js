import * as React from "react";
import UserLogin from "./routes/UserLogin";
import UserRegister from "./routes/UserRegister";

export default [
    {
        component: UserLogin,
        path: "/user/login",
    },
    {
        component: UserRegister,
        path: "/user/register",
    },
];