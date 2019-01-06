import React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import * as PropTypes from "prop-types";
import {Divider, Popconfirm, Table} from "antd";
import {Ajax} from "@utils/ajax";
import UserEdit from "./UserEdit";
import UserDetail from "./UserDetail";
import JoinRoleAdd from "./JoinRoleAdd";

class UserListState {

    @observable data = [];

    getList(keyWord) {
        var me = this;
        Ajax.apiPost("/systemmanager/usersafe/user/list-model", {"REAL_NAME%": keyWord}).then(function (d) {
            me.data = d.data;
        });
    }
}

@observer
class UserList extends React.Component {
    static propTypes = {
        state: PropTypes.any
    };

    static newState() {
        return new UserListState();
    }

    constructor(props) {
        super(props);
        const columns = [
            {
                title: "姓名",
                dataIndex: "REAL_NAME",
                key: "REAL_NAME"
            },
            {
                title: "账号",
                dataIndex: "ACCOUNT",
                key: "ACCOUNT"
            },
            {
                title: "组织机构",
                dataIndex: "ORG_ID_DESC",
                key: "ORG_ID_DESC"
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
                        <a href="javascript:;" onClick={() => this.onJoinRoleAddClick(record)}>关联角色</a>
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
            userEditState: UserEdit.newState(),
            userDetailState: UserDetail.newState(),
            joinRoleState: JoinRoleAdd.newState()
        };
    }

    /**
     * 编辑点击事件
     */
    onEditClick(record) {
        this.state.userEditState.data = record;
        this.state.userEditState.show();
    }

    /**
     * 详情点击事件
     */
    onDetailClick(record) {
        this.state.userDetailState.data = record;
        this.state.userDetailState.show();
    }

    /**
     * 关联角色点击事件
     */
    onJoinRoleAddClick(record) {
        this.state.joinRoleState.show(record);
    }

    /**
     * 编辑完成事件，刷新列表
     */
    onEdited() {
        this.props.state.getList();
    }

    /**
     * 删除点击事件
     */
    onDeleteClick(data) {

        var me = this;

        Ajax.apiPost("/systemmanager/usersafe/user/delete", {"ID": data.ID}).then(function (d) {
            me.props.state.getList();
        });
    }

    render() {
        console.log(this.constructor.name, "render");

        var tableData = [];

        if (this.props.state.data != null) {
            for (var i = 0; i < this.props.state.data.length; i++) {
                tableData.push(this.props.state.data[i]);
            }
        }

        return (
            <div>
                <UserEdit state={this.state.userEditState} onEdited={() => this.onEdited()}/>
                <UserDetail state={this.state.userDetailState}/>
                <JoinRoleAdd state={this.state.joinRoleState}/>
                <Table rowKey={record => record.ID} dataSource={tableData} columns={this.state.columns}/>
            </div>

        );
    }
}

export default UserList;
