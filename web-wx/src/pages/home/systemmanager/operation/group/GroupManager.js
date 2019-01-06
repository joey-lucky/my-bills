import React from "react";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {Button, Col, Divider, Input, Modal, Popconfirm, Row, Table} from "antd";
import {Ajax} from "@utils/ajax";
import GroupDetailDialog from "./GroupDetailDialog";
import JoinUserDialog from "./JoinUserDialog";
import JoinSiteDialog from "./JoinSiteDialog";
import GroupEditDialog from "./GroupEditDialog";

const Search = Input.Search;

class AppState {
    joinSiteState = JoinSiteDialog.newState();
    groupDetailState = GroupDetailDialog.newState();
    joinUserState = JoinUserDialog.newState();
    groupAddState = GroupEditDialog.newState();
    groupEditState = GroupEditDialog.newState();

    @observable groupList = [];
}

@observer
export default class GroupManager extends React.Component {
    _state = new AppState();

    _columns = [
        {
            title: "名称",
            dataIndex: "NAME",
            key: "NAME"
        },
        {
            title: "所属公司",
            dataIndex: "OPMC_ID_DESC",
            key: "OPMC_ID"
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
                    <Divider type="vertical"/>
                    <a href="javascript:;" onClick={() => this.onJoinUserClick(record)}>关联组员</a>
                    {
                        (record.GROUP_TYPE === "01" || record.GROUP_TYPE === "02") &&
                        (<React.Fragment>
                                <Divider type="vertical"/>
                                < a href="javascript:;" onClick={() => this.onJoinSiteClick(text, record)}>关联站点</a>
                            </React.Fragment>
                        )
                    }
                </div>
            )
        }
    ];

    componentDidMount() {
        this.loadGroupList();
    }

    onAddClick = () => {
        this._state.groupAddState.data = {};
        this._state.groupAddState.show();
    };

    onSearchClick = (value) => {
        this.loadGroupList(value);
    };

    onEditClick(record) {
        this._state.groupEditState.data = record;
        this._state.groupEditState.show();
    }

    onDeleteClick(data) {
        Ajax.apiPost("/systemmanager/operation/group/delete", {"ID": data.ID})
            .then((d) => {
                if (d.result_flag === "SUCCESS") {
                    Modal.success({
                        title: "提示",
                        content: "删除成功！",
                        okText: "确定"
                    });
                } else {
                    Modal.error({
                        title: "提示",
                        content: "删除失败！",
                        okText: "确定"
                    });
                }
                this.loadGroupList();
            });
    }

    onDetailClick(record) {
        this._state.groupDetailState.data = record;
        this._state.groupDetailState.show();
    }

    onJoinUserClick(record) {
        this._state.joinUserState.show(record);
    }

    onJoinSiteClick(text, record) {
        this._state.joinSiteState.show(record);
    }

    onAddSuccess = () => {
        Modal.success({
            title: "提示",
            content: "保存成功！",
            okText: "确定"
        });
        this.loadGroupList();
    };

    onEditSuccess = () => {
        Modal.success({
            title: "提示",
            content: "编辑成功！",
            okText: "确定"
        });
        this.loadGroupList();
    };

    onJoinSiteSuccess = () => {
        this.loadGroupList();
    };

    onJoinUserSuccess = () => {
        this.loadGroupList();
    };

    loadGroupList = (name = "") => {
        Ajax.apiPost("/systemmanager/operation/group/list", {NAME: name})
            .then((d) => {
                this._state.groupList = d.data || [];
            });
    };

    render() {
        return (
            <div className="fill-parent">
                <GroupEditDialog
                    state={this._state.groupAddState}
                    dialogTitle="新增运维组"
                    actionURL="/systemmanager/operation/group/create"
                    onSubmitSuccess={this.onAddSuccess}
                />

                <GroupEditDialog
                    state={this._state.groupEditState}
                    dialogTitle="编辑运维组"
                    actionURL="/systemmanager/operation/group/update"
                    onSubmitSuccess={this.onEditSuccess}
                />

                <GroupDetailDialog
                    dialogTitle="运维组详情"
                    state={this._state.groupDetailState}
                />

                <JoinUserDialog
                    state={this._state.joinUserState}
                    dialogTitle="关联用户"
                    actionURL="/systemmanager/operation/group/update"
                    onSubmitSuccess={this.onJoinUserSuccess}
                />

                <JoinSiteDialog
                    state={this._state.joinSiteState}
                    dialogTitle="关联站点"
                    actionURL="/systemmanager/operation/group/update"
                    onSubmitSuccess={this._state.onJoinSiteSuccess}
                />

                <Row type="flex" justify="space-around" style={{height: 50}} align="middle">
                    <Col span={6}>
                        <Search
                            placeholder="查询关键字"
                            enterButton={true}
                            onSearch={this.onSearchClick}
                        />
                    </Col>
                    <Col span={8} offset={10}>
                        <Button onClick={this.onAddClick}>
                            新增
                        </Button>
                    </Col>
                </Row>

                <Table
                    rowKey={record => record.ID}
                    dataSource={toJS(this._state.groupList)}
                    columns={this._columns}
                />
            </div>
        );
    }
}

