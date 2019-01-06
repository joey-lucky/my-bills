import React from "react";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {Table} from "antd";
import {DetailDialog, DetailDialogState} from "@components/DetailDialog";

class AppState extends DetailDialogState {
    @observable data = [];
}

@observer
export default class TaskListDialog extends DetailDialog {
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
        }];

    constructor(props) {
        super(props);
        this.dialogWidth = 750;
        this.title = "任务列表";
    }

    static newState() {
        return new AppState();
    }

    renderDetail() {
        const {state} = this.props;
        return (
            <div>
                <Table
                    rowKey={record => record.ID}
                    dataSource={toJS(state.data)}
                    columns={this._columns}
                />
            </div>
        );
    }
}
