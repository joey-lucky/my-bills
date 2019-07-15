import Home from "@pages/Home";
import Asset from "@pages/Asset";
import Invest from "@pages/Invest";
import List from "@pages/List";
import Setting from "@pages/Setting";
import Login from "@pages/Login";
import AddBill from "@pages/AddBill";
import EditBill from "@pages/EditBill";
import SubList from "@pages/SubList";

export default [
    {
        path: "/login",
        component: Login,
        name: "登录页",
        functionCode: "login"
    },
    {
        path: "/home",
        component: Home,
        name: "首页",
        functionCode: "home"
    },
    {
        path:"/add-bill",
        component: AddBill,
        name: "记一笔",
        functionCode: "add-bill"
    },
    {
        path: "/asset",
        component: Asset,
        name: "资产",
        functionCode: "asset"
    },
    {
        path: "/asset/sub-list",
        component: SubList,
        name: "资产",
        functionCode: "sub-list"
    },
    {
        path: "/invest",
        component: Invest,
        functionCode: "home"
    },
    {
        path: "/invest/sub-list",
        component: SubList,
        name: "资产",
        functionCode: "sub-list"
    },
    {
        path: "/list",
        component: List,
        functionCode: "home"
    },
    {
        path: "/list/edit-bill",
        component: EditBill,
        functionCode: "EditBill"
    },
    {
        path: "/list/add-bill",
        component: AddBill,
        functionCode: "EditBill"
    },
    {
        path: "/setting",
        component: Setting,
        functionCode: "home"
    },
];
