import React from "react";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {Modal} from "antd";
import {Ajax} from "@utils/ajax";
import PageTable from "@components/PageTable";
import OpTaskEditDialog from "./OpTaskEditDialog";
import OpTaskFilter from "./OpTaskFilter";
import OpTaskDetailDialog from "./OpTaskDetailDialog";

class AppState {
    filterState = OpTaskFilter.newState();
    addState = OpTaskEditDialog.newState();
    detailState = OpTaskDetailDialog.newState();

    /**
     * 表格分页状态器
     */
    taskTableState = PageTable.newState();

    @observable data = [];

    constructor() {
        this.loadData();
    }

    loadData = () => {
        this.taskTableState.loadData(toJS(this.filterState.data));
    };

    loadDetailData = (record) => {
        const jobName = record.JOB_TYPE;
        let url = "";
        let needAlarmData = false;
        switch (jobName) {
            case "emergency":
                url = "/op/taskmanager/optask/get-emergency-list";
                break;
            case "fault":
                url = "/op/taskmanager/optask/get-fault-list";
                break;
            case "supplies":
                url = "/op/taskmanager/optask/get-supplies-list";
                break;
            case "inspect":
                url = "/op/taskmanager/optask/get-inspect-list";
                break;
            case "adjustweek":
                url = "/op/taskmanager/optask/get-adjust-week-list";
                break;
            case "overcheck":
                url = "/op/taskmanager/optask/get-over-check-list";
                needAlarmData = true;
                break;
            case "verifymonth":
                url = "/op/taskmanager/optask/get-verify-month-list";
                break;
            case "verifyquarter":
                url = "/op/taskmanager/optask/get-verify-quarter-list";
                break;
            default:
                return;
        }
        this.detailState.detailData = [];
        Ajax.apiPost(url, {TASK_ID: record.ID})
            .then((d) => {
                this.detailState.detailData = d.data || [];
                if (needAlarmData) {
                    this.loadAlarmData(this.detailState.detailData[0].ALARM_ID);
                }
            });
    };

    loadAlarmData = (alarmId) => {
        Ajax.apiPost("/alarmmanager/get-model", {ID: alarmId})
            .then((d) => {
                this.detailState.alarmData = d.data || [];
            });
    };
}

@observer
export default class TaskList extends React.Component {
    static newState() {
        return new AppState();
    }

    _appState = new AppState();
    _columns = [
        {
            title: "站点名称",
            dataIndex: "SITE_ID_DESC",
            key: "SITE_ID_DESC"
        },
        {
            title: "所属合同",
            dataIndex: "CONTRACT_ID_DESC",
            key: "CONTRACT_ID_DESC"
        },
        {
            title: "任务类型",
            dataIndex: "JOB_ID_DESC",
            key: "JOB_ID_DESC"
        },
        {
            title: "任务状态",
            dataIndex: "TASK_STATUS_DESC",
            key: "TASK_STATUS_DESC"
        },
        {
            title: "运维组",
            dataIndex: "GROUP_ID_DESC",
            key: "GROUP_ID_DESC"
        },
        {
            title: "运维人员",
            dataIndex: "FINISH_BY_DESC",
            key: "FINISH_BY_DESC"
        },
        {
            title: "开始时间",
            dataIndex: "START_TIME",
            key: "START_TIME"
        },
        {
            title: "完成时间",
            dataIndex: "FINISH_TIME",
            key: "FINISH_TIME"
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => (
                <div>
                    <a href="javascript:" onClick={() => this.onDetailClick(text, record)}>查看</a>
                </div>
            )
        }];

    onSearchClick = () => {
        this._appState.loadData();
    };

    onAddClick = () => {
        this._appState.addState.data = {};
        this._appState.addState.show();
    };

    onDetailClick = (text, record) => {
        this._appState.detailState.taskData = record;
        this._appState.detailState.visible = true;
        this._appState.loadDetailData(record);
        this._appState.loadPhotoData(record);
        this._appState.loadPositionData(record);
    };

    onAddSuccess = () => {
        Modal.success({
            title: "提示",
            content: "派发成功！",
            okText: "确定"
        });
        this._appState.loadData();
    };

    onPreviewPhotoClick = (url) => {
        const {previewPhotoState} = this._appState;
        previewPhotoState.url = url;
        previewPhotoState.visible = true;
    };

    render() {
        const state = this._appState;
        return (
            <div style={{marginTop: 24}}>
                <OpTaskDetailDialog
                    state={state.detailState}
                    onCloseClick={() => {
                        state.detailState.visible = false;
                    }}
                    onPreviewPhotoClick={this.onPreviewPhotoClick}
                />

                <OpTaskFilter
                    state={state.filterState}
                    onAddClick={this.onAddClick}
                    onSearchClick={this.onSearchClick}
                />

                <OpTaskEditDialog
                    state={state.addState}
                    dialogTitle="派发任务"
                    actionURL="/op/taskmanager/optask/create"
                    onSubmitSuccess={this.onAddSuccess}
                />
                <PageTable
                    state={state.taskTableState}
                    pageSize={30}
                    actionURL="/op/taskmanager/optask/list"
                    columns={this._columns}
                />
            </div>
        );
    }
}
