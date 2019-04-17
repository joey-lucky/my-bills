import React from "react";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {Button, Divider, Modal, Popconfirm, Row, Table} from "antd";
import Ajax from "../../../services/Ajax";
import AddAndEditDialog from "./AddAndEditDialog";
import DetailDialog from "./DetailDialog";

class AppState {
    @observable data = [];
    addState = AddAndEditDialog.newState();
    editState = AddAndEditDialog.newState();
    detailState = DetailDialog.newState();

    asyncLoadData = () => {
        Ajax.apiPost("/table/list", {"table_name": "bc_bill_type"})
            .then((d) => {
                this.data = d.data || [];
            });
    };

    asyncDelete = (data) => {
        return Ajax.apiPost("/table/delete", {"table_name": "bc_bill_type", "id": data.id})
    };
}

@observer
export default class  BillType extends React.Component {
    _appState = new AppState();
    _columns = [
        {
            title: "类型",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => (
                <div>
                    <a href="javascript:;" onClick={() => this.onEditClick(record)}>编辑</a>
                    <Divider type="vertical"/>
                    <a href="javascript:;" onClick={() => this.onDetailClick(record)}>详情</a>
                    <Divider type="vertical"/>
                    <Popconfirm
                        title="确定要删除吗？" onConfirm={() => this.onDeleteClick(record)} okText="确定"
                        cancelText="取消"
                    >
                        <a href="javascript:;">删除</a>
                    </Popconfirm>
                </div>
            )
        }];

    componentDidMount() {
        this._appState.asyncLoadData();
    }

    onAddClick = () => {
        this._appState.addState.show();
    };

    onDeleteClick = (record) => {
        this._appState.asyncDelete(record)
            .then((d) => {
                Modal.success({
                    title: "提示",
                    content: "删除成功",
                    okText: "确定"
                });
                this._appState.asyncLoadData();
            });
    };

    onEditClick = (record) => {
        this._appState.editState.show(record);
    };

    onDetailClick = (record) => {
        this._appState.detailState.show(record);
    };

    render() {
        const appState = this._appState;
        return (
            <div>
                <Row  style={{margin:12}}>
                    <Button type={"primary"} onClick={this.onAddClick}>新增</Button>
                </Row>

                <AddAndEditDialog
                    title={"新增"}
                    state={appState.addState}
                    url={"/table/create"}
                    onSubmitSuccess={() => {
                        appState.asyncLoadData()
                    }}/>

                <AddAndEditDialog
                    title={"编辑"}
                    state={appState.editState}
                    url={"/table/update"}
                    onSubmitSuccess={() => {
                        appState.asyncLoadData()
                    }}/>

                <DetailDialog
                    title={"详情"}
                    state={appState.detailState}/>

                <Table
                    rowKey={record => record.ID}
                    dataSource={toJS(appState.data)}
                    columns={this._columns}
                />
            </div>
        );
    }
}
