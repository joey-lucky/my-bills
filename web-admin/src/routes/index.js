import SystemSetting from "./SystemSetting";
import UserManager from "./SystemSetting/UserManager";

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
        ]
    },
];

