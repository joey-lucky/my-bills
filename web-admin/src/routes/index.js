import SystemSetting from "./SystemSetting";
import UserManager from "./SystemSetting/UserManager";
import CardType from "./SystemSetting/CardType";
import Card from "./SystemSetting/Card";
import BillType from "./SystemSetting/BillType";
import BillManager from "./BillManager";
import BillList from "./BillManager/BillList";

export default  [
    {
        path: "/BillManager",
        component: BillManager,
        name: "账单管理",
        functionCode: "BillManager",
        children: [
            {
                path: "/BillList",
                component: BillList,
                name: "账单列表",
                functionCode: "BillList"
            },
        ]
    },
    {
        path: "/SystemSetting",
        component: SystemSetting,
        name: "系统设置",
        functionCode: "SystemSetting",
        children: [
            {
                path: "/UserManager",
                component: UserManager,
                name: "用户管理",
                functionCode: "UserManager"
            },
            {
                path: "/CardType",
                component: CardType,
                name: "银行账户类型",
                functionCode: "CardType"
            },
            {
                path: "/BillType",
                component: BillType,
                name: "账单类型",
                functionCode: "BillType"
            },
            {
                path: "/Card",
                component: Card,
                name: "账单类型",
                functionCode: "Card"
            },
        ]
    },
];

