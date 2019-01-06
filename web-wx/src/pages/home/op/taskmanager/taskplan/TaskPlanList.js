import {Divider, Modal, Popconfirm, Table} from "antd";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import React from "react";
import {Ajax} from "@utils/ajax";
import TaskPlanEditDialog from "./TaskPlanEditDialog";
import TaskPlanFilter from "./TaskPlanFilter";
import TaskPlanSiteListDialog from "./TaskPlanSiteListDialog";

class AppState {
    filterState = TaskPlanFilter.newState();
    editState = TaskPlanEditDialog.newState();
    addState = TaskPlanEditDialog.newState();
    listState = TaskPlanSiteListDialog.newState();
    @observable data = [];

    constructor() {
        this.loadData();
    }

    loadData = () => {
        Ajax.apiPost("/op/taskmanager/optaskplan/list", this.filterState.data)
            .then((d) => {
                this.data = d.data || [];
            });
    };

    showTaskPlanDetail = (plan) => {
        Ajax.apiPost("/op/taskmanager/optaskplan/get-model", {ID: plan.ID})
            .then((d) => {
                let data = [];

                if (d.data[0] && d.data[0].relationModelMap && d.data[0].relationModelMap.BC_SITE) {
                    data = d.data[0].relationModelMap.BC_SITE;
                }

                this.listState.data = data || [];
                this.listState.show();
            });
    };

    stopPlan = (record) => {
        Ajax.apiPost("/op/taskmanager/optaskplan/stop", {ID: record.ID})
            .then((d) => {
                this.loadData();
            });
    }
}

@observer
export default class TaskPlanList extends React.Component {
    static newState() {
        return new AppState();
    }

    _appState = new AppState();
    _columns = [
        {
            title: "计划名称",
            dataIndex: "NAME",
            key: "NAME"
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
            title: "计划状态",
            dataIndex: "PLAN_STATUS_DESC",
            key: "PLAN_STATUS_DESC"
        },
        {
            title: "任务周期",
            dataIndex: "TASK_CYCLE_DESC",
            key: "TASK_CYCLE_DESC"
        },
        {
            title: "开始时间",
            dataIndex: "START_TIME",
            key: "START_TIME"
        },
        {
            title: "截止时间",
            dataIndex: "END_TIME",
            key: "END_TIME"
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => {
                let stopOperation = (<span />);
                if (record.PLAN_STATUS !== "3") {
                    stopOperation = (
                        <span>
                            <Divider type="vertical" />
                            <Popconfirm
                                title="确定要终止吗？"
                                onConfirm={() => this.onStopPlan(text, record)}
                                okText="确定"
                                cancelText="取消"
                            >
                                <a href="javascript:">终止</a>
                            </Popconfirm>
                        </span>
                    );
                }

                return (
                    <div>
                        <a href="javascript:" onClick={() => this.onDetailClick(text, record)}>查看站点</a>
                        <Divider type="vertical" />
                        <a href="javascript:" onClick={() => this.onEditClick(text, record)}>编辑</a>
                        {
                            stopOperation
                        }
                    </div>
                );
            }
        }
    ];

    onStopPlan = (text, record) => {
        const state = this._appState;
        state.stopPlan(record);
    };

    onSearchClick = () => {
        const state = this._appState;
        state.loadData();
    };

    onAddClick = () => {
        const addState = this._appState.addState;
        addState.show();
    };

    onEditClick = (text, record) => {
        let editState = this._appState.editState;
        editState.show(record);
    };

    onDetailClick = (text, record) => {
        this._appState.showTaskPlanDetail(record);
    };

    onAddSuccess = () => {
        Modal.success({
            title: "提示",
            content: "新增成功！",
            okText: "确定"
        });
        const state = this._appState;
        state.loadData();
    };

    onEditSuccess = () => {
        Modal.success({
            title: "提示",
            content: "编辑成功！",
            okText: "确定"
        });
        const state = this._appState;
        state.loadData();
    };

    render() {
        const state = this._appState;
        const {data, addState, listState, editState} = state;
        return (
            <div style={{marginTop: 24}}>
                <TaskPlanFilter
                    state={state.filterState}
                    onSearchClick={this.onSearchClick}
                    onAddClick={this.onAddClick}
                />

                <TaskPlanSiteListDialog
                    state={listState}
                    dialogTitle="计划站点"
                />

                <TaskPlanEditDialog
                    state={addState}
                    dialogTitle="制定计划"
                    actionURL="/op/taskmanager/optaskplan/create"
                    onSubmitSuccess={this.onAddSuccess}
                />

                <TaskPlanEditDialog
                    state={editState}
                    dialogTitle="制定计划"
                    actionURL="/op/taskmanager/optaskplan/update"
                    onSubmitSuccess={this.onEditSuccess}
                />

                <Table
                    rowKey={record => record.ID}
                    dataSource={toJS(data)}
                    columns={this._columns}
                />
            </div>
        );
    }
}
