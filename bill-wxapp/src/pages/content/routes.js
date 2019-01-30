import AddBill from "./bill/AddBill";
import BillList from "./bill/BillList";

let data = [
    {
        path: "/bill-list",
        component: BillList,
        name: "运维管理",
    },
    {
        path: "/add-bill",
        component: AddBill,
        name: "车辆管理",
    },
];

export default [data]
