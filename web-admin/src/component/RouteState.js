// import {observable} from "mobx";
//
//
// export default class RouteState {
//     allRoutes = [
//         {
//             path: "/taskmanager",
//             component: TaskManager,
//             name: "运维管理",
//             functionCode: "TASK_MANAGER_TOP",
//             children: [
//                 {
//                     path: "/optask",
//                     component: OpTaskList,
//                     name: "任务查询",
//                     functionCode: "TASK_LIST_MENU"
//                 },
//                 {
//                     path: "/optaskplan",
//                     component: TaskPlanList,
//                     name: "任务计划",
//                     functionCode: "TASK_PLAN_MENU"
//                 },
//                 {
//                     path: "/taskCalendar",
//                     component: TaskCalendar,
//                     name: "任务日历",
//                     functionCode: "TASK_CALENDAR_MENU"
//                 },
//                 {
//                     path: "/outofservice",
//                     component: OutOfServiceList,
//                     name: "停产设置",
//                     functionCode: "TASK_PLAN_MENU"
//                 },
//             ]
//         },
//         {
//             path: "/carmanager",
//             component: CarManager,
//             name: "车辆管理",
//             functionCode: "CAR_MANAGER_TOP",
//             children: [
//                 {
//                     path: "/reportday",
//                     component: OpCarReportDayList,
//                     name: "日运行报表",
//                     functionCode: "CAR_REPORT_DAY_MENU"
//                 },
//                 {
//                     path: "/realTimeCarPosition",
//                     component: RealTimeCarPositionMap,
//                     name: "车辆实时位置",
//                     functionCode: "CAR_REAL_TIME_POSITION_MENU"
//                 }
//             ]
//         },
//         {
//             path: "/systemmanager",
//             component: SystemManager,
//             name: "系统设置",
//             functionCode: "SYSTEM_MANAGER_TOP",
//             children: [
//                 {
//                     path: "/systemsetting",
//                     component: null,
//                     name: "系统设置",
//                     functionCode: "SYSTEM_SETTING_MENU_TOP",
//                     children: [
//                         {
//                             path: "/dictsetting",
//                             component: DictManager,
//                             name: "字典设置",
//                             functionCode: "DICT_MENU_TOP"
//                         }
//                     ]
//                 },
//                 {
//                     path: "/entmanager",
//                     component: null,
//                     name: "企业管理",
//                     functionCode: "ENT_MANAGER_TOP",
//                     children: [
//                         {
//                             path: "/stationsetting",
//                             component: EntManager,
//                             name: "企业设置",
//                             functionCode: "ENT_SETTING_TOP"
//
//                         }
//                     ]
//                 },
//                 {
//                     path: "/usersafe",
//                     component: null,
//                     name: "用户权限",
//                     functionCode: "USER_PERMISSION_MENU_TOP",
//                     children: [
//                         {
//                             path: "/user",
//                             component: UserManager,
//                             name: "用户",
//                             functionCode: "USER_MENU_TOP"
//                         },
//                         {
//                             path: "/role",
//                             component: RoleManager,
//                             name: "角色",
//                             functionCode: "ROLE_MENU_TOP"
//
//                         },
//                         {
//                             path: "/fun",
//                             component: FunctionManager,
//                             name: "功能",
//                             functionCode: "FUNCTION_MENU_TOP"
//                         },
//                         {
//                             path: "/org",
//                             component: OrgManager,
//                             name: "组织机构",
//                             functionCode: "ORG_MENU_TOP"
//                         }
//                     ]
//                 },
//                 {
//                     path: "/operationsetting",
//                     component: null,
//                     name: "运营设置",
//                     functionCode: "OPERATION_SETTING_MENU_TOP",
//                     children: [
//                         {
//                             path: "/operationcompany",
//                             component: CompanyManager,
//                             name: "运维公司",
//                             functionCode: "OPERATION_COMPANY"
//                         },
//                         {
//                             path: "/operationgroup",
//                             component: GroupManager,
//                             name: "运维组",
//                             functionCode: "OPERATION_GROUP"
//                         },
//                         {
//                             path: "/jobsetting",
//                             component: OpJobList,
//                             name: "任务配置",
//                             functionCode: "OPERATION_TASK"
//                         },
//                         {
//                             path: "/operationcontract",
//                             component: ContractManager,
//                             name: "运维合同",
//                             functionCode: "OPERATION_CONTRACT"
//                         },
//                         {
//                             path: "/car",
//                             component: OpCarList,
//                             name: "车辆配置",
//                             functionCode: "OPERATION_CAR_SETTING"
//                         },
//                         {
//                             path: "/deviceopsetting",
//                             component: DeviceOpSettingList,
//                             name: "设备运维设置",
//                             functionCode: "OPERATION_DEVICE_SETTING"
//                         }
//                     ]
//                 },
//                 {
//                     path: "/alarmsetting",
//                     component: null,
//                     name: "报警设置",
//                     functionCode: "ALARM_SETTING_MENU_TOP",
//                     children: [
//                         {
//                             path: "/range",
//                             component: AlarmRangeList,
//                             name: "规则设置",
//                             functionCode: "RANGE_SETTING"
//                         },
//                         {
//                             path: "/alarm",
//                             component: AlarmSettingList,
//                             name: "发送设置",
//                             functionCode: "SEND_SETTING"
//                         }
//                     ]
//                 }
//             ]
//         }
//     ];
//
//     @observable routeData = [];
//
//     filterRoute(userData) {
//         const data = userData[0];
//         if (data.USER_ACCOUNT !== "admin") {
//             const functions = data.FUNCTIONS;
//             const functionSet = new Set();
//             functions.forEach((item) => {
//                 functionSet.add(item.CODE);
//             });
//             this.routeData = this._getHasFunctionList(this.allRoutes, functionSet);
//         } else {
//             this.routeData = this.allRoutes;
//         }
//     }
//
//     _getHasFunctionList(list, functionSet) {
//         if (list && list.length > 0) {
//             // 筛选出符合条件的路由
//             const data = list.filter(item => functionSet.has(item.functionCode));
//             // 处理子路由
//             data.forEach((item) => {
//                 item.children = this._getHasFunctionList(item.children, functionSet);
//             });
//             return data;
//         }
//         return [];
//     }
// }
//
