import React from "react";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {Divider, Modal, Popconfirm, Row, Table} from "antd";
import Ajax from "../../../services/Ajax";

class AppState {
    @observable data = [];

    asyncLoadData = () => {
        Ajax.apiPost("/table/list", {"table_name": "bc_user"})
            .then((d) => {
                this.data = d.data || [];
            });
    };

    asyncDelete = (data) => {
        return Ajax.apiPost("/table/delete", {"table_name": "bc_user","id":data.id})
    };
}

@observer
export default class UserManager extends React.Component {
    _appState = new AppState();
    _columns = [
        {
            title: "用户名",
            dataIndex: "user_name",
            key: "user_name"
        },
        {
            title: "登录账号",
            dataIndex: "login_name",
            key: "login_name"
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

    onEditClick = (record) => {

    };
    onDetailClick = (record) => {

    };


    onDeleteClick = (record) => {
        this._appState.asyncDelete(record)
            .then((d)=>{
                Modal.success({
                    title: "提示",
                    content: "删除成功",
                    okText: "确定"
                });
                this._appState.asyncLoadData();
            });
    };

    componentDidMount() {
        this._appState.asyncLoadData();
    }

    render() {
        const appState = this._appState;
        return (
            <div style={{marginTop: 24}}>
                <Row>

                </Row>

                <Table
                    rowKey={record => record.ID}
                    dataSource={toJS(appState.data)}
                    columns={this._columns}
                />
            </div>
        );
    }
}
