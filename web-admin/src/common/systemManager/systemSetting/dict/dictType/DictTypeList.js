import React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import * as PropTypes from "prop-types";
import {Divider, Popconfirm, Table} from "antd";
import {Ajax} from "../../../../unit/ajax";

class DictTypeListState {

    @observable data = [];

    getList(keyWord) {
        var me = this;
        Ajax.apiPost("/systemmanager/systemsetting/dict/type/list-model", {"CODE%": keyWord}).then(function (d) {
            me.data = d.data;
        });
    }

    deleteDictType(data) {
        return Ajax.apiPost("/systemmanager/systemsetting/dict/type/delete", data);
    }
}

@observer
export default class DictTypeList extends React.Component {
    static propTypes = {
        onDictTypeEditClick: PropTypes.any,
        state: PropTypes.any,
        onDictDataEditClick: PropTypes.any
    };

    static newState() {
        return new DictTypeListState();
    }

    constructor(props) {
        super(props);
        const columns = [{
            title: "字典代码",
            dataIndex: "CODE",
            key: "CODE"
        },
        {
            title: "字典名称",
            dataIndex: "NAME",
            key: "NAME"
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => (
                <span>
                    <a href="javascript:;" onClick={() => this.onDictTypeEditClick(record)}>编辑</a>
                    <Divider type="vertical"/>
                    <Popconfirm
                        title="确定要删除吗？" onConfirm={() => this.onDictTypeDeleteClick(record)} okText="确定"
                        cancelText="取消"
                    >
                        <a href="javascript:;">删除</a>
                    </Popconfirm>
                    <Divider type="vertical"/>
                    <a href="javascript:;" onClick={() => this.onDictDataEditClick(record)}>字典项</a>
                </span>
                )
        }];

        this.state = {
            columns: columns
        };
    }

    onDictTypeEditClick(data) {
        this.props.onDictTypeEditClick(data);
    }

    onDictTypeDeleteClick(data) {
        this.props.state.deleteDictType(data).then(() => {
            this.props.state.getList();
        });
    }

    onDictDataEditClick(record) {
        this.props.onDictDataEditClick(record);
    }

    render() {
        var tableData = [];

        for (var i = 0; i < this.props.state.data.length; i++) {
            tableData.push(this.props.state.data[i]);
        }

        return (
            <Table rowKey={record => record.CODE} dataSource={tableData} columns={this.state.columns}/>
        );
    }
}
