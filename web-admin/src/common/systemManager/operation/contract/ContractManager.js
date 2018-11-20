import React from "react";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {Button, Col, Divider, Input, Popconfirm, Row, Table} from "antd";
import {Ajax} from "../../../unit/ajax";
import ContractAdd from "./ContractAdd";
import ContractEdit from "./ContractEdit";
import ContractDetail from "./ContractDetail";
import JoinStationDialog from "./JoinStationDialog";

const Search = Input.Search;

class AppState {
    columns = [
        {
            title: "合同名称",
            dataIndex: "NAME",
            key: "NAME"
        },
        {
            title: "合同编号",
            dataIndex: "CONTRACT_NO",
            key: "CONTRACT_NO"
        },
        {
            title: "甲方",
            dataIndex: "CUSTOMERS_NAME",
            key: "CUSTOMERS_NAME"
        },
        {
            title: "合同时间",
            dataIndex: "CONTRACT_START_DATE",
            key: "CONTRACT_START_DATE"
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
                    <a href="javascript:" onClick={() => this.onJoinStationClick(text, record)}>关联站点</a>
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

    addState = ContractAdd.newState();
    editState = ContractEdit.newState();
    detailState = ContractDetail.newState();
    joinStationState = JoinStationDialog.newState();

    @observable data = [];

    constructor() {
        this.loadData();
    }

    loadData = () => {
        Ajax.apiPost("/systemmanager/operation/contract/list-model")
            .then((d) => {
                this.data = d.data || [];
            });
    };

    onAdded = () => {
        this.loadData();
    };

    onEditSuccess = () => {
        this.loadData();
    };

    onJoinStationClick = (record) => {
        this.joinStationState.data = record;
        this.joinStationState.show();
    }

    onDeleteClick = (text, record) => {
        Ajax.apiPost("/systemmanager/operation/contract/delete", {ID: record.ID})
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
export default class ContractManager extends React.Component {

    _state = new AppState();

    render() {
        return (
            <div>
                <Row type="flex" justify="space-around" style={{height: 50}} align="middle">
                    <Col span={6}>
                        <Search
                            placeholder="查询关键字"
                            enterButton
                            onSearch={value => this.onSearch(value)}
                        />
                    </Col>
                    <Col span={8} offset={10}>
                        <Button onClick={() => this._state.onAddClick()}>新增</Button>
                    </Col>
                </Row>
                <ContractAdd state={this._state.addState} onAdded={() => this._state.onAdded()}/>
                <ContractEdit state={this._state.editState} onAdded={() => this._state.onAdded()}/>
                <JoinStationDialog state={this._state.joinStationState}/>
                <ContractDetail state={this._state.detailState}/>
                <div>
                    <Table
                        rowKey={record => record.ID}
                        dataSource={toJS(this._state.data)}
                        columns={this._state.columns}
                    />
                </div>
            </div>
        );
    }
}
