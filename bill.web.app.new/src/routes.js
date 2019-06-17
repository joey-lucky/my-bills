import Home from "@pages/Home";
import Assert from "@pages/Assert";
import Invest from "@pages/Invest";
import List from "@pages/List";
import Setting from "@pages/Setting";

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
    {
        path: "/invest",
        component: Invest,
        functionCode: "home"
    },
    {
        path: "/list",
        component: List,
        functionCode: "home"
    },
    {
        path: "/setting",
        component: Setting,
        functionCode: "home"
    },
];
