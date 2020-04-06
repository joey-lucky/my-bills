import CommonLayout from "@layouts/CommonLayout";
import User from "@components/../business/sys/User";

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
    ]

};


export default route;