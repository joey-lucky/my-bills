import HomePage from "./pages/HomePage";
import AddBillPage from "./pages/AddBillPage";

export default [
    {
        path: "/home",
        component: HomePage,
        name: "运维管理",
    },
    {
        path: "/add-bill",
        component: AddBillPage,
        name: "车辆管理",
    },
]
