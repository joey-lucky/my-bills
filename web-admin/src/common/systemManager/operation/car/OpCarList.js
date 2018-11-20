import React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {Button, Divider, Layout, Popconfirm, Row, Table} from "antd";
import {Ajax} from "../../../unit/ajax";
import OpCarEditDialog from "./OpCarEditDialog";
import OpCarDetailDialog from "./OpCarDetailDialog";

class AppState {
    columns = [
        {
            title: "车辆名称",
            dataIndex: "CAR_NAME",
            key: "CAR_NAME"
        },
        {
            title: "车牌号",
            dataIndex: "CAR_NO",
            key: "CAR_NO"
        },
        {
            title: "运维组",
            dataIndex: "GROUP_ID_DESC",
            key: "GROUP_ID_DESC"
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
    addState = OpCarEditDialog.newState();
    editState = OpCarEditDialog.newState();
    detailState = OpCarDetailDialog.newState();

    @observable data = [];

    constructor() {
        this.loadData();
    }

    loadData = () => {
        Ajax.apiPost("/carmanager/car/list-model")
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
        Ajax.apiPost("/carmanager/car/delete", {ID: record.ID})
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
export default class OpCarList extends React.Component {
    _state = new AppState();

    render() {
        const state = this._state;
        return (
            <div style={{marginTop: 20}}>
                <OpCarEditDialog
                    state={state.addState}
                    dialogTitle="新增"
                    actionURL="/carmanager/car/create"
                    onSubmitSuccess={state.onAddSuccess}
                />

                <OpCarEditDialog
                    state={state.editState}
                    dialogTitle="编辑"
                    actionURL="/carmanager/car/update"
                    onSubmitSuccess={state.onEditSuccess}
                />

                <OpCarDetailDialog
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
                        dataSource={state.data}
                        columns={state.columns}
                    />
                </Layout>
            </div>

        );
    }
}
