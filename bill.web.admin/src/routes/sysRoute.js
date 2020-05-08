import CommonLayout from "@layouts/CommonLayout";
import Card from "@business/sys/Card";
import User from "@business/sys/User";
import BillType from "@business/sys/BillType";
import Dict from "@business/sys/Dict";
import BillTemplate from "@business/sys/BillTemplate";

const route = {
    path: "/sys",
    component: CommonLayout,
    name: "设置",
    children:[
        {
            path: "/dict",
            component: Dict,
            name: "字典",
        },
        {
            path: "/user",
            component: User,
            name: "用户",
        },
        {
            path: "/card",
            component: Card,
            name: "银行卡",
        },
        {
            path: "/BillType",
            component: BillType,
            name: "账单类型",
        },
        {
            path: "/BillTemplate",
            component: BillTemplate,
            name: "账单模板",
        },
    ]
};

export default route;