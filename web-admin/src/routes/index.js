import SystemSetting from "./SystemSetting";
import UserManager from "./SystemSetting/UserManager";
import CardType from "./SystemSetting/CardType";
import Card from "./SystemSetting/Card";
import BillType from "./SystemSetting/BillType";

export default  [
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

