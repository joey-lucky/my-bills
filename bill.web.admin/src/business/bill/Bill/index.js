import * as React from "react";
import {Divider, Popconfirm, Row} from "antd";
import store from "./store";
import {RemoteTable} from "@components";
import {billAPI} from "@services";
import EditDialog from "./EditDialog";
import {observer} from "mobx-react";
import moment from "moment";
import Filter from "./Filter";
import {toJS,action} from "mobx";

@observer
export default class Bill extends React.Component {
    _columns = [
        {
            title: "账单描述",
            dataIndex: "billDesc",
            key: "billDesc",
        },
        {
            title: "金额",
            dataIndex: "money",
            key: "money"
        },
        {
            title: "账单类型",
            dataIndex: "billTypeName",
            key: "billTypeName"
        },
        {
            title: "银行卡",
            dataIndex: "cardName",
            key: "cardName",
            render: (text, record) => record.cardUserName + " - " + record.cardName
        },
        {
            title: "时间",
            dataIndex: "dateTime",
            key: "dateTime",
            render: (text) => text && moment(text).format("YYYY-MM-DD")
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

    @action
    onSearch = (values) => {
        store.queryParams = values;
        console.log(values);
    };

    onCreateClick = () => {
        this._createRef.current.show({});
    };

    onCreateOrUpdateSuccess = () => {
        store.lastModifyDate = Date.now();
    };

    render() {
        const {queryParams, lastModifyDate} = toJS(store);
        return (
            <div className={"fill-parent"}>
                <EditDialog
                    ref={this._createRef}
                    title={"新增用户"}
                    loadData={billAPI.create}
                    onFinish={this.onCreateOrUpdateSuccess}
                />
                <EditDialog
                    ref={this._updateRef}
                    title={"编辑用户"}
                    loadData={billAPI.update}
                    onFinish={this.onCreateOrUpdateSuccess}
                />
                <Row style={{padding: 12}} gutter={12}>
                    <Filter
                        onFinish={this.onSearch}
                        onCreateClick={this.onCreateClick}
                    />
                </Row>
                <RemoteTable
                    lastModifyDate={lastModifyDate}
                    loadData={billAPI.index}
                    columns={this._columns}
                    params={queryParams}
                    pagination={{pageSize: 9}}
                />
            </div>
        );
    }
}