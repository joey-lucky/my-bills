import React from "react";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {Button, Divider, Layout, Modal, Popconfirm, Row, Table} from "antd";
import AlarmSettingEditDialog from "./AlarmSettingEditDialog";
import {Ajax} from "@utils/ajax";

class AppState {
    columns = [
        {
            title: "所属站点",
            dataIndex: "SITE_ID_DESC",
            key: "SITE_ID_DESC"
        },
        {
            title: "参数名称",
            dataIndex: "POLL_CODE_DESC",
            key: "POLL_CODE_DESC"
        },
        {
            title: "发送类型",
            dataIndex: "ALARM_TYPE_DESC",
            key: "ALARM_TYPE_DESC"
        },
        {
            title: "发送周期",
            dataIndex: "TIME_CYCLE_DESC",
            key: "TIME_CYCLE_DESC"
        },
        {
            title: "用户",
            dataIndex: "USER_ID_DESC_S",
            key: "USER_ID_DESC_S"
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => (
                <span>
                    <Popconfirm
                        title="确定要删除吗？" onConfirm={() => this.onDeleteClick(text, record)} okText="确定"
                        cancelText="取消"
                    >
                        <a href="javascript:void(0);">删除</a>
                    </Popconfirm>
                    <Divider type="vertical"/>
                    <a href="javascript:void(0);" onClick={() => this.onEditClick(text, record)}>设置</a>
                </span>
            )
        }];
    addState = AlarmSettingEditDialog.newState();
    editState = AlarmSettingEditDialog.newState();

    @observable data = [];

    constructor() {
        this.loadData();
    }

    onEditClick = (text, record) => {
        this.editState.data = record;
        this.editState.show();
    };

    onAddClick = () => {
        this.addState.data = {};
        this.addState.show();
    };

    onDeleteClick = (text, record) => {
        Ajax.apiPost("/systemmanager/alarmsetting/alarm/alarmplan/delete", {ID: record.ID})
            .then(() => {
                Modal.success({
                    title: "提示",
                    content: "删除成功！",
                    okText: "确定"
                });
                this.loadData();
            });
    };

    onAddSuccess = () => {
        this.loadData();
    };

    loadData = () => {
        Ajax.apiPost("/systemmanager/alarmsetting/alarm/alarmplan/list")
            .then((d) => {
                this.data = d.data || [];
            });
    };
}


@observer
export default class AlarmSettingList extends React.Component {
    appState = new AppState();

    render() {
        const appState = this.appState;
        return (
            <div>
                <AlarmSettingEditDialog
                    state={appState.addState}
                    dialogTitle="新增"
                    actionURL="/systemmanager/alarmsetting/alarm/alarmplan/create"
                    onSubmitSuccess={appState.onAddSuccess}
                />

                <AlarmSettingEditDialog
                    state={appState.editState}
                    dialogTitle="编辑"
                    actionURL="/systemmanager/alarmsetting/alarm/alarmplan/update"
                    onSubmitSuccess={appState.onEditSuccess}
                />

                <Layout style={{marginTop: 24}}>
                    <Row>
                        <Button
                            style={{marginLeft: 12}}
                            type="primary"
                            onClick={appState.onAddClick}
                        >新增</Button>
                    </Row>

                    <Table
                        rowKey={record => record.ID}
                        dataSource={toJS(appState.data)}
                        columns={appState.columns}
                    />
                </Layout>
            </div>
        );
    }
}
