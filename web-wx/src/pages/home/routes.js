import OpTaskList from "./op/taskmanager/optask/OpTaskList";
import TaskPlanList from "./op/taskmanager/taskplan/TaskPlanList";
import TaskCalendar from "./op/taskmanager/taskCalendar/TaskCalendar";
import OpCarReportDayList from "./op/carmanager/reportday/OpCarReportDayList";
import RealTimeCarPositionMap from "./op/carmanager/RealTimeCarPoition/RealTimeCarPositionMap";
import DictManager from "./systemmanager/systemSetting/dict/DictManager";
import EntManager from "./systemmanager/ent/setting/EntManager";
import UserManager from "./systemmanager/userSafe/user/UserManager";
import RoleManager from "./systemmanager/userSafe/role/RoleManager";
import FunctionManager from "./systemmanager/userSafe/function/FunctionManager";
import OrgManager from "./systemmanager/userSafe/org/OrgManager";

import CompanyManager from "./systemmanager/operation/company/CompanyManager";
import GroupManager from "./systemmanager/operation/group/GroupManager";
import ContractManager from "./systemmanager/operation/contract/ContractManager";
import OpJobList from "./systemmanager/operation/opjob/OpJobList";
import OpCarList from "./systemmanager/operation/car/OpCarList";

import AlarmRangeList from "./systemmanager/alarmSetting/rangesettting/AlarmRangeList";
import AlarmSettingList from "./systemmanager/alarmSetting/alarmsetting/AlarmSettingList";
import DeviceOpSettingList from "./systemmanager/operation/deviceopsetting/DeviceOpSettingList";
import OutOfServiceList from "./op/taskmanager/outofservice/OutOfServiceList";
import HomeManager from "./home/HomeManager";
import CommonLayout from "../../layouts/CommonLayout";

const homeRoute = {
    path: "/home",
    name: "综合首页",
    component: HomeManager,
    functionCode: "CAR_MANAGER_TOP",
    children: []
};

const dvRoute = {
    path: "/dv",
    name: "数据模块",
    component: CommonLayout,
    functionCode: "CAR_MANAGER_TOP",
    children: []
};

const wspRoute = {
    path: "/wsp",
    name: "业务模块",
    component: CommonLayout,
    functionCode: "CAR_MANAGER_TOP",
    children: []
};

const opRoute = {
    path: "/op",
    component: CommonLayout,
    name: "运营模块",
    functionCode: "TASK_MANAGER_TOP",
    children: [
        {
            path: "/op3task",
            component: OpTaskList,
            name: "任务查询",
            functionCode: "TASK_LIST_MENU",
        },
        {
            path: "/optaskplan",
            component: TaskPlanList,
            name: "任务计划",
            functionCode: "TASK_PLAN_MENU"
        },
        {
            path: "/taskCalendar",
            component: TaskCalendar,
            name: "任务日历",
            functionCode: "TASK_CALENDAR_MENU"
        },
        {
            path: "/outofservice",
            component: OutOfServiceList,
            name: "停产设置",
            functionCode: "TASK_PLAN_MENU"
        },
        {
            path: "/reportday",
            component: OpCarReportDayList,
            name: "日运行报表",
            functionCode: "CAR_REPORT_DAY_MENU"
        },
        {
            path: "/realTimeCarPosition",
            component: RealTimeCarPositionMap,
            name: "车辆实时位置",
            functionCode: "CAR_REAL_TIME_POSITION_MENU"
        }
    ]
};

const systemManagerRoute = {
    path: "/systemmanager",
    component: CommonLayout,
    name: "信息维护",
    functionCode: "SYSTEM_MANAGER_TOP",
    children: [
        {
            path: "/systemsetting",
            component: null,
            name: "系统设置",
            functionCode: "SYSTEM_SETTING_MENU_TOP",
            children: [
                {
                    path: "/dictsetting",
                    component: DictManager,
                    name: "字典设置",
                    functionCode: "DICT_MENU_TOP"
                }
            ]
        },
        {
            path: "/entmanager",
            component: null,
            name: "企业管理",
            functionCode: "ENT_MANAGER_TOP",
            children: [
                {
                    path: "/stationsetting",
                    component: EntManager,
                    name: "企业设置",
                    functionCode: "ENT_SETTING_TOP"

                }
            ]
        },
        {
            path: "/usersafe",
            component: null,
            name: "用户权限",
            functionCode: "USER_PERMISSION_MENU_TOP",
            children: [
                {
                    path: "/user",
                    component: UserManager,
                    name: "用户",
                    functionCode: "USER_MENU_TOP"
                },
                {
                    path: "/role",
                    component: RoleManager,
                    name: "角色",
                    functionCode: "ROLE_MENU_TOP"

                },
                {
                    path: "/fun",
                    component: FunctionManager,
                    name: "功能",
                    functionCode: "FUNCTION_MENU_TOP"
                },
                {
                    path: "/org",
                    component: OrgManager,
                    name: "组织机构",
                    functionCode: "ORG_MENU_TOP"
                }
            ]
        },
        {
            path: "/operationsetting",
            component: null,
            name: "运营设置",
            functionCode: "OPERATION_SETTING_MENU_TOP",
            children: [
                {
                    path: "/operationcompany",
                    component: CompanyManager,
                    name: "运维公司",
                    functionCode: "OPERATION_COMPANY"
                },
                {
                    path: "/operationgroup",
                    component: GroupManager,
                    name: "运维组",
                    functionCode: "OPERATION_GROUP"
                },
                {
                    path: "/jobsetting",
                    component: OpJobList,
                    name: "任务配置",
                    functionCode: "OPERATION_TASK"
                },
                {
                    path: "/operationcontract",
                    component: ContractManager,
                    name: "运维合同",
                    functionCode: "OPERATION_CONTRACT"
                },
                {
                    path: "/car",
                    component: OpCarList,
                    name: "车辆配置",
                    functionCode: "OPERATION_CAR_SETTING"
                },
                {
                    path: "/deviceopsetting",
                    component: DeviceOpSettingList,
                    name: "设备运维设置",
                    functionCode: "OPERATION_DEVICE_SETTING"
                }
            ]
        },
        {
            path: "/alarmsetting",
            component: null,
            name: "报警设置",
            functionCode: "ALARM_SETTING_MENU_TOP",
            children: [
                {
                    path: "/range",
                    component: AlarmRangeList,
                    name: "规则设置",
                    functionCode: "RANGE_SETTING"
                },
                {
                    path: "/alarm",
                    component: AlarmSettingList,
                    name: "发送设置",
                    functionCode: "SEND_SETTING"
                }
            ]
        }
    ]
};

const routes = [ opRoute, systemManagerRoute];
export default routes;
