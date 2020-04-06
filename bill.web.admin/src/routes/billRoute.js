import CommonLayout from "@layouts/CommonLayout";
import User from "@components/../business/sys/User";
import Bill from "@business/bill/Bill";

const route = {
    path: "/bill",
    component: CommonLayout,
    name: "账单管理",
    children:[
        {
            path: "/bill-list",
            component: Bill,
            name: "账单列表",
        },
    ]

};


export default route;