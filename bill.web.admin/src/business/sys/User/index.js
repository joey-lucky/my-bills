import * as React from "react";
import {Button, Col, Divider, Input, Popconfirm, Row} from "antd";
import store from "./store";
import {RemoteTable} from "@components";
import {userAPI} from "@services";
import EditDialog from "./EditDialog";
import {observer} from "mobx-react";

@observer
export default class User extends React.Component {
    _columns = [
        {
            title: "头像",
            dataIndex: "pic",
            key: "pic",
            render: function (text, record) {
                return (
                    <img src={text}/>
                );
            }
        },
        {
            title: "用户名",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "登录名",
            dataIndex: "loginName",
            key: "loginName"
        },
        {
            title: "企业微信",
            dataIndex: "bussWX",
            key: "bussWX"
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => (
                <div>
                    <a href="javascript:" onClick={this.onUpdateClick(record)}>编辑</a>
                    <Divider type="vertical"/>
                    <Popconfirm
                        title="确定要删除吗？" onConfirm={this.onDeleteClick(record)} okText="确定"
                        cancelText="取消"
                    >
                        <a href="javascript:;">删除</a>
                    </Popconfirm>
                </div>
            )
        },
    ];
    _updateRef = React.createRef();
    _createRef = React.createRef();

    componentDidMount() {
    }

    onDeleteClick = (record) => () => {
        store.asyncDeleteData(record);
    };

    onUpdateClick = (record) => () => {
        this._updateRef.current.show(record);
    };

    onSearch = (value) => {
        store.keyword = value;
    };

    onCreateClick = () => {
        this._createRef.current.show({});
    };

    render() {
        return (
            <div className={"fill-parent"}>
                <EditDialog
                    ref={this._createRef}
                    title={"新增用户"}
                    loadData={userAPI.create}
                />
                <EditDialog
                    ref={this._updateRef}
                    title={"新增用户"}
                    loadData={userAPI.update}
                />
                <Row style={{padding: 12}} gutter={12}>
                    <Col span={6}>
                        <Input.Search
                            onSearch={this.onSearch}/>
                    </Col>
                    <Col span={4}>
                        <Button
                            type={"primary"}
                            onClick={this.onCreateClick}
                        >新增</Button>
                    </Col>
                </Row>
                <RemoteTable
                    lastModifyDate={store.lastModifyDate}
                    loadData={userAPI.index}
                    columns={this._columns}
                />
            </div>
        );
    }
}