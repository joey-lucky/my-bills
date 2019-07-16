import Home from "@pages/Home";
import Asset from "@pages/Asset";
import Invest from "@pages/Invest";
import List from "@pages/List";
import Setting from "@pages/Setting";
import Login from "@pages/Login";
import AddBill from "@pages/AddBill";
import EditBill from "@pages/EditBill";
import SubList from "@pages/SubList";

let bottomRoutes = [
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
        path: "/asset",
        component: Asset,
        name: "资产",
        functionCode: "asset"
    },
    {
        path: "/invest",
        component: Invest,
        functionCode: "home"
    },
    {
        path: "/setting",
        component: Setting,
        functionCode: "home"
    },
];

const listBill =  {
    path: ["/asset/list","/list"],
    component: List,
    name: "资产",
    functionCode: "sub-list"
};

const addBill = {
    path: [...listBill.path.map(item => item + "/add-bill"),"/add-bill"],
    component: AddBill,
    name: "记一笔",
    functionCode: "add-bill"
};

const editBill = {
    path: listBill.path.map(item => item + "/edit-bill"),
    component: EditBill,
    functionCode: "EditBill"
};

export default [
    ...bottomRoutes,listBill,addBill,editBill
];
