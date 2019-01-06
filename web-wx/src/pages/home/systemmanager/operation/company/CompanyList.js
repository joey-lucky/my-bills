import React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {Divider, Modal, Popconfirm, Table} from "antd";
import * as PropTypes from "prop-types";
import {Ajax} from "@utils/ajax";
import CompanyEdit from "./CompanyEdit";
import CompanyDetail from "./CompanyDetail";

class CompanyListState {

    @observable data = [];

    getList(name) {
        var me = this;
        Ajax.apiPost("/systemmanager/operation/company/list", {NAME: name}).then(function (d) {
            me.data = d.data;
        });
    }
}

@observer
class CompanyList extends React.Component {
    static propTypes = {
        state: PropTypes.any
    };

    static newState() {
        return new CompanyListState();
    }

    constructor(props) {
        super(props);
        const columns = [{
            title: "公司名称",
            dataIndex: "NAME",
            key: "NAME"
        },
        {
            title: "公司性质",
            dataIndex: "NATURE_OF_BUSINESS_DESC",
            key: "NATURE_OF_BUSINESS"
        },
        {
            title: "公司地址",
            dataIndex: "ADDRESS",
            key: "ADDRESS"
        },
        {
            title: "联系电话",
            dataIndex: "TEL",
            key: "TEL"
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
            companyEditState: CompanyEdit.newState(),
            companyDetailState: CompanyDetail.newState()
        };
    }

    /**
     * 编辑点击事件
     */
    onEditClick(record) {
        this.state.companyEditState.data = record;
        this.state.companyEditState.show();
    }

    /**
     * 详情点击事件
     */
    onDetailClick(record) {
        this.state.companyDetailState.data = record;
        this.state.companyDetailState.show();
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

        Ajax.apiPost("/systemmanager/operation/company/delete", {"ID": data.ID}).then(function (d) {
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
                <CompanyEdit state={this.state.companyEditState} onEdited={() => this.onEdited()}/>
                <CompanyDetail state={this.state.companyDetailState}/>
                <Table rowKey={record => record.ID} dataSource={tableData} columns={this.state.columns}/>
            </div>

        );
    }
}

export default CompanyList;
