import * as React from "react";
import {Button, Col, Divider, Input, Popconfirm, Row} from "antd";
import store from "./store";
import {RemoteTable} from "@components";
import {cardAPI} from "@services";
import EditDialog from "./EditDialog";
import {observer} from "mobx-react";
import {toJS} from "mobx";
import Filter from "./Filter";

@observer
export default class Card extends React.Component {
    _columns = [
        {
            title: "名称",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "类型",
            dataIndex: "cardTypeName",
            key: "cardTypeName"
        },
        {
            title: "余额",
            dataIndex: "balance",
            key: "balance"
        },
        {
            title: "用户",
            dataIndex: "userName",
            key: "userName"
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
        store.deleteData(record);
    };

    onUpdateClick = (record) => () => {
        this._updateRef.current.show(record);
    };

    onSearch = (values) => {
        store.changeQueryParams(values);
    };

    onCreateClick = () => {
        this._createRef.current.show({});
    };

    onCreateOrUpdateSuccess = () => {
        store.loadData();
    };

    render() {
        return (
            <div className={"fill-parent"}>
                <EditDialog
                    ref={this._createRef}
                    title={"新增银行卡"}
                    loadData={cardAPI.create}
                    onFinish={this.onCreateOrUpdateSuccess}
                    successMessage={"新增成功"}
                />
                <EditDialog
                    ref={this._updateRef}
                    title={"编辑银行卡"}
                    loadData={cardAPI.update}
                    onFinish={this.onCreateOrUpdateSuccess}
                    successMessage={"编辑成功"}
                />
                <Filter
                    onFinish={this.onSearch}
                    onCreateClick={this.onCreateClick}
                />
                <RemoteTable
                    lastModifyDate={store.lastModifyDate}
                    loadData={cardAPI.index}
                    columns={this._columns}
                    pagination={{pageSize:10}}
                    params={toJS(store.queryParams)}
                />
            </div>
        );
    }
}