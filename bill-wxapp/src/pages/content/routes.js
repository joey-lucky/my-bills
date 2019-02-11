import BillAdd from "./data/BillAdd";
import BillList from "./data/BillList";
import SettingList from "./setting/SettingList";
import BillTypeList from "./setting/BillTypeList";
import CardList from "./setting/CardList";
import CardTypeList from "./setting/CardTypeList";
import CardTypeAdd from "./setting/CardTypeAdd";
import BillTypeAdd from "./setting/BillTypeAdd";
import CardAdd from "./setting/CardAdd";
import CommonLayout from "@layouts/CommonLayout";
import CardAsset from "./asset/CardAsset";

let routes = [
    {
        path: "/data",
        name: "账单数据",
        component: CommonLayout,
        children: [
            {
                path: "/bill-list",
                component: BillList,
                name: "运维管理",
            },
            {
                path: "/bill-add/:id",
                component: BillAdd,
                name: "车辆管理",
            },
        ]
    },
    {
        path: "/asset",
        name: "资产",
        component: CommonLayout,
        children: [
            {
                path: "/card",
                component: CardAsset,
                name: "银行资产",
            },
        ]
    },
    {
        path: "/setting",
        name: "设置",
        component: CommonLayout,
        children: [
            {
                path: "/setting-list",
                component: SettingList,
                name: "设置列表",
            },
            {
                path: "/bill-type-list",
                component: BillTypeList,
                name: "账单类型列表",
            },
            {
                path: "/card-list",
                component: CardList,
                name: "卡片列表",
            },
            {
                path: "/card-type-list",
                component: CardTypeList,
                name: "卡片列表",
            },
            {
                path: "/card-type-add",
                component: CardTypeAdd,
                name: "卡片类型列表",
            },
            {
                path: "/bill-type-add",
                component: BillTypeAdd,
                name: "账单类型列表",
            },
            {
                path: "/card-add",
                component: CardAdd,
                name: "卡片列表",
            },
        ]
    },
];

export default routes
