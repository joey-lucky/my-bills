import React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {Divider, Popconfirm, Table} from "antd";
import * as PropTypes from "prop-types";
import {Ajax} from "../../../unit/ajax";
import JoinFunctionAdd from "./JoinFunctionAdd";
import JoinStationAdd from "./JoinStationAdd";
import JoinUserAdd from "./JoinUserAdd";
import RoleEdit from "./RoleEdit";
import RoleDetail from "./RoleDetail";

class RoleListState {

    @observable data = [];

    getList() {
        var me = this;
        Ajax.apiPost("/systemmanager/usersafe/role/list").then(function (d) {
            me.data = d.data;
        });
    }
}

@observer
class RoleList extends React.Component {
    static propTypes = {
        state: PropTypes.any
    };

    static newState() {
        return new RoleListState();
    }

    constructor(props) {
        super(props);
        const columns = [
            {
                title: "角色名称",
                dataIndex: "NAME",
                key: "NAME"
            },
            {
                title: "角色描述",
                dataIndex: "DESCRIBE",
                key: "DESCRIBE"
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
                        <a href="javascript:;" onClick={() => this.onJoinFunctionClick(record)}>关联功能</a>
                        <Divider type="vertical"/>
                        <a href="javascript:;" onClick={() => this.onJoinStationClick(record)}>关联站点</a>
                        <Divider type="vertical"/>
                        <a href="javascript:;" onClick={() => this.onJoinUserClick(record)}>关联用户</a>
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
            joinFunctionState: JoinFunctionAdd.newState(),
            joinStationState: JoinStationAdd.newState(),
            joinUserState: JoinUserAdd.newState(),
            roleEditState: RoleEdit.newState(),
            roleListState: RoleList.newState(),
            roleDetailState: RoleDetail.newState()
        };
    }

    /**
     * 编辑点击事件，触发onEditClick事件
     * onEditClick事件需要由父组件提供
     */
    onEditClick(data) {
        this.state.roleEditState.data = data;
        this.state.roleEditState.show();
    }

    /**
     * 编辑完成事件，刷新列表
     */
    onEdited() {
        this.props.state.getList();
    }

    /**
     * 关联功能点击事件
     */
    onJoinFunctionClick(data) {
        this.state.joinFunctionState.data = {
            ID: data.ID
        };
        this.state.joinFunctionState.show();
    }

    /**
     * 关联用户点击事件
     */
    onJoinUserClick(data) {
        this.state.joinUserState.data = {
            ID: data.ID
        };
        this.state.joinUserState.show();
    }

    /**
     * 关联站点点击事件
     */
    onJoinStationClick(data) {
        this.state.joinStationState.data = {
            ID: data.ID
        };
        this.state.joinStationState.show();
    }

    /**
     * 详情点击事件
     */
    onDetailClick(record) {
        this.state.roleDetailState.data = record;
        this.state.roleDetailState.show();
    }

    /**
     * 删除点击事件
     */
    onDeleteClick(data) {
        var me = this;
        Ajax.apiPost("/systemmanager/usersafe/role/delete", {"ID": data.ID}).then(function (d) {
            me.props.state.getList();
        });
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
                <JoinFunctionAdd state={this.state.joinFunctionState}/>
                <JoinStationAdd state={this.state.joinStationState}/>
                <JoinUserAdd state={this.state.joinUserState}/>
                <RoleEdit state={this.state.roleEditState} onEdited={() => this.onEdited()}/>
                <RoleDetail state={this.state.roleDetailState}/>
                <Table rowKey={record => record.ID} dataSource={tableData} columns={this.state.columns}/>
            </div>
        );
    }
}

export default RoleList;
