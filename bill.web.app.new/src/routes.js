import Home from "@pages/Home";
import Asset from "@pages/Asset";
import Invest from "@pages/Invest";
import List from "@pages/List";
import Setting from "@pages/Setting";
import Login from "@pages/Login";
import AddBill from "@pages/AddBill";
import EditBill from "@pages/EditBill";
import BillTypeList from "@pages/BillTypeList";
import BillTypeEdit from "@pages/BillTypeEdit";
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
    {
        path: "/list",
        component: List,
        name: "资产",
        functionCode: "sub-list"
    },
    {
        path: "/add-bill",
        component: AddBill,
        name: "记一笔",
        functionCode: "add-bill"
    },
    {
        path: "/bill-type-list",
        component: BillTypeList,
        name: "记一笔",
        functionCode: "add-bill"
    },
    {
        path: "/bill-type-edit",
        component: BillTypeEdit,
        name: "记一笔",
        functionCode: "add-bill"
    },
    {
        path: "/sub-list",
        component: SubList,
        name: "记一笔",
        functionCode: "add-bill"
    },
    {
        path: "/edit-bill",
        component: EditBill,
        functionCode: "EditBill"
    }
];
