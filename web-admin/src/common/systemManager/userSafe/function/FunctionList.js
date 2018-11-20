import React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {Divider, Popconfirm, Table} from "antd";
import * as PropTypes from "prop-types";
import {Ajax} from "../../../unit/ajax";
import FunctionEditForm from "./FunctionEdit";
import FunctionAddForm from "./FunctionAdd";
import FunctionDetail from "./FunctionDetail";
import JoinRoleAdd from "./JoinRoleAdd";

class FunctionListState {

    @observable data = [];

    getList() {
        var me = this;
        Ajax.apiPost("/systemmanager/usersafe/function/list").then(function (d) {
            me.data = d.data;
        });
    }
}

@observer
class FunctionList extends React.Component {
    static propTypes = {
        state: PropTypes.any
    };

    static newState() {
        return new FunctionListState();
    }

    constructor(props) {
        super(props);
        const columns = [
            {
                title: "功能名称",
                dataIndex: "NAME",
                key: "NAME"
            },
            {
                title: "功能代码",
                dataIndex: "CODE",
                key: "CODE"
            },
            {
                title: "操作",
                key: "action",
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" onClick={() => this.onEditClick(record)}>编辑</a>
                        <Divider type="vertical"/>
                        <a href="javascript:;" onClick={() => this.onDetailClick(record)}>详情</a>
                        <Divider type="vertical"/>
                        <a href="javascript:;" onClick={() => this.onAddChildClick(record)}>新建子项</a>
                        <Divider type="vertical"/>
                        <a href="javascript:;" onClick={() => this.onJoinRoleClick(record)}>关联角色</a>
                        <Divider type="vertical"/>
                        <Popconfirm
                            title="确定要删除吗？" onConfirm={() => this.onDeleteClick(record)} okText="确定"
                            cancelText="取消"
                        >
                            <a href="javascript:;">删除</a>
                        </Popconfirm>
                    </span>
                )
            }];

        this.state = {
            columns: columns,
            functionEditState: FunctionEditForm.newState(),
            functionDetailState: FunctionDetail.newState(),
            functionAddState: FunctionAddForm.newState(),
            joinRoleState: JoinRoleAdd.newState()
        };
    }

    /**
     * 编辑点击事件
     */
    onEditClick(record) {
        this.state.functionEditState.data = record;
        this.state.functionEditState.show();
    }

    /**
     * 编辑完成事件，刷新列表
     */
    onEdited() {
        this.props.state.getList();
    }

    /**
     * 详情点击事件
     */
    onDetailClick(record) {
        this.state.functionDetailState.data = record;
        this.state.functionDetailState.show();
    }

    /**
     * 删除点击事件
     */
    onDeleteClick(data) {

        var me = this;

        Ajax.apiPost("/systemmanager/usersafe/function/delete", {"ID": data.ID}).then(function (d) {
            me.props.state.getList(data.DICT_TYPE_CODE);
        });
    }

    /**
     * 关联角色
     */
    onJoinRoleClick(data) {
        this.state.joinRoleState.data = {
            ID: data.ID
        };
        this.state.joinRoleState.show();
    }

    /**
     * 添加子项点击事件，把被点击的记录的ID作为新建项的parent_id
     */
    onAddChildClick(record) {
        var childData = {};
        childData.PARENT_ID = record.ID;
        this.state.functionAddState.data = childData;
        this.state.functionAddState.show();
    }

    /**
     * 新增完成事件，刷新列表
     */
    onAdded() {
        this.props.state.getList();
    }

    render() {
        var tableData = [];

        if (this.props.state.data != null) {
            for (var i = 0; i < this.props.state.data.length; i++) {
                tableData.push(this.props.state.data[i]);
            }
        }

        return (
            <div>
                <FunctionEditForm state={this.state.functionEditState} onEdited={() => this.onEdited()}/>
                <FunctionDetail state={this.state.functionDetailState}/>
                <FunctionAddForm state={this.state.functionAddState} onAdded={() => this.onAdded()}/>
                <JoinRoleAdd state={this.state.joinRoleState}/>
                <Table rowKey={record => record.CODE} dataSource={tableData} columns={this.state.columns}/>
            </div>
        );
    }
}

export default FunctionList;
