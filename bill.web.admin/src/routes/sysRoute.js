import CommonLayout from "@layouts/CommonLayout";
import Card from "@business/sys/Card";
import User from "@business/sys/User";

const route = {
    path: "/sys",
    component: CommonLayout,
    name: "设置",
    children:[
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
    ]
};


export default route;