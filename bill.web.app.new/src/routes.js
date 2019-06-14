import Home from "@pages/Home";
import Assert from "@pages/Assert";

export default [
    {
        path: "/home",
        component: Home,
        name: "首页",
        functionCode: "home"
    },
    {
        path: "/asset",
        component: Assert,
        name: "资产",
        functionCode: "Assert"
    },
];
