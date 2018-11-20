import React from "react";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {Button, Divider, Layout, Popconfirm, Row, Table} from "antd";
import {Ajax} from "../../../unit/ajax";
import OpJobEditDialog from "./OpJobEditDialog";
import OpJobDetailDialog from "./OpJobDetailDialog";

class AppState {
    columns = [
        {
            title: "任务名称",
            dataIndex: "NAME",
            key: "NAME"
        },
        {
            title: "任务级别",
            dataIndex: "JOB_LEVEL_DESC",
            key: "JOB_LEVEL_DESC"
        },
        {
            title: "所属合同",
            dataIndex: "CONTRACT_ID_DESC",
            key: "CONTRACT_ID_DESC"
        },
        {
            title: "任务类别",
            dataIndex: "JOB_TYPE_DESC",
            key: "JOB_TYPE_DESC"
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => (
                <span>
                    <a href="javascript:" onClick={() => this.onEditClick(text, record)}>编辑</a>
                    <Divider type="vertical"/>
                    <a href="javascript:" onClick={() => this.onDetailClick(text, record)}>详情</a>
                    <Divider type="vertical"/>
                    <Popconfirm
                        title="确定要删除吗？" onConfirm={() => this.onDeleteClick(text, record)}
                        okText="确定" cancelText="取消"
                    >
                        <a href="javascript:;">删除</a>
                    </Popconfirm>
                </span>
            )
        }
    ];
    addState = OpJobEditDialog.newState();
    editState = OpJobEditDialog.newState();
    detailState = OpJobDetailDialog.newState();

    @observable data = [];

    constructor() {
        this.loadData();
    }

    loadData = () => {
        Ajax.apiPost("/systemmanager/operation/opjob/list")
            .then((d) => {
                this.data = d.data || [];
            });
    };

    onAddSuccess = () => {
        this.loadData();
    };

    onEditSuccess = () => {
        this.loadData();
    };

    onDeleteClick = (text, record) => {
        Ajax.apiPost("/systemmanager/operation/opjob/delete", {ID: record.ID})
            .then(() => {
                this.loadData();
            });
    };

    onEditClick = (text, record) => {
        this.editState.data = record;
        this.editState.show();
    };

    onAddClick = () => {
        this.addState.data = {};
        this.addState.show();
    };

    onDetailClick = (text, record) => {
        this.detailState.data = record;
        this.detailState.show();
    };
}

@observer
export default class OpJobList extends React.Component {
    _state = new AppState();

    render() {
        const state = this._state;
        return (
            <div style={{marginTop: 20}}>
                <OpJobEditDialog
                    state={state.addState}
                    dialogTitle="新增"
                    actionURL="/systemmanager/operation/opjob/create"
                    onSubmitSuccess={state.onAddSuccess}
                />

                <OpJobEditDialog
                    state={state.editState}
                    dialogTitle="编辑"
                    actionURL="/systemmanager/operation/opjob/update"
                    onSubmitSuccess={state.onEditSuccess}
                />

                <OpJobDetailDialog
                    state={state.detailState}
                    dialogTitle="详情"
                />

                <Layout>
                    <Row>
                        <Button
                            style={{marginLeft: 12}}
                            type="primary"
                            onClick={state.onAddClick}
                        >新增</Button>
                    </Row>

                    <Table
                        rowKey={record => record.ID}
                        dataSource={toJS(state.data)}
                        columns={state.columns}
                    />
                </Layout>
            </div>

        );
    }
}
