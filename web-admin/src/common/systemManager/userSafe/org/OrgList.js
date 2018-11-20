import React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import * as PropTypes from "prop-types";
import {Divider, Popconfirm, Table} from "antd";
import {Ajax} from "../../../unit/ajax";
import OrgEdit from "./OrgEdit";
import OrgDetail from "./OrgDetail";
import OrgAdd from "./OrgAdd";

class OrgListState {

    @observable data = [];

    getList(keyWord) {
        var me = this;
        Ajax.apiPost("/systemmanager/usersafe/org/list", {keyWord: keyWord}).then(function (d) {
            me.data = d.data;
        });
    }
}

@observer
class OrgList extends React.Component {
    static propTypes = {
        state: PropTypes.any
    };

    static newState() {
        return new OrgListState();
    }

    constructor(props) {
        super(props);
        const columns = [
            {
                title: "名称",
                dataIndex: "NAME",
                key: "NAME"
            },
            {
                title: "描述",
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
                        <a href="javascript:;" onClick={() => this.onAddChildClick(record)}>增加子项</a>
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
            orgEditState: OrgEdit.newState(),
            orgDetailState: OrgDetail.newState(),
            orgAddState: OrgAdd.newState()
        };
    }

    /**
     * 编辑点击事件
     */
    onEditClick(record) {
        this.state.orgEditState.data = record;
        this.state.orgEditState.show();
    }

    /**
     * 增加子项点击事件
     */
    onAddChildClick(record) {
        var child = {
            PARENT_ID: record.ID
        };
        this.state.orgAddState.data = child;
        this.state.orgAddState.show();
    }

    /**
     * 详情点击事件
     */
    onDetailClick(record) {
        this.state.orgDetailState.data = record;
        this.state.orgDetailState.show();
    }

    /**
     * 编辑完成事件，刷新列表
     */
    onEdited() {
        this.props.state.getList();
    }

    /**
     * 新增子项完成事件，刷新列表
     */
    onAdded() {
        this.props.state.getList();
    }

    /**
     * 删除点击事件
     */
    onDeleteClick(data) {

        var me = this;

        Ajax.apiPost("/systemmanager/usersafe/org/delete", {"ID": data.ID}).then(function (d) {
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
                <OrgEdit state={this.state.orgEditState} onEdited={() => this.onEdited()}/>
                <OrgDetail state={this.state.orgDetailState}/>
                <OrgAdd state={this.state.orgAddState} onAdded={() => this.onAdded()}/>
                <Table rowKey={record => record.ID} dataSource={tableData} columns={this.state.columns}/>
            </div>
        );
    }
}

export default OrgList;
