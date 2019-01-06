import React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import * as PropTypes from "prop-types";
import {Button, Divider, Popconfirm, Table} from "antd";
import {Ajax} from "@utils/ajax";
import DictDataAdd from "./DictDataAdd";
import DictDataEdit from "./DictDataEdit";

class DictDataListState {

    @observable data = [];

    getList(dictTypeCode) {
        var me = this;
        this.DICT_TYPE_CODE = dictTypeCode;
        Ajax.apiPost("/systemmanager/systemsetting/dict/data/list", {"dictTypeCode": dictTypeCode}).then(function (d) {
            me.data = d.data;
        });
    }

}

@observer
export default class DictDataList extends React.Component {
    static propTypes = {
        state: PropTypes.any
    };

    static newState() {
        return new DictDataListState();
    }

    constructor(props) {
        super(props);
        const columns = [{
            title: "代码",
            dataIndex: "CODE",
            key: "CODE"
        },
        {
            title: "值",
            dataIndex: "VALUE",
            key: "NAME"
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => (
                <span>
                    <a href="javascript:;" onClick={() => this.onEditClick(record)}>编辑</a>
                    <Divider type="vertical"/>
                    <Popconfirm
                        title="确定要删除吗？" onConfirm={() => this.onDeleteClick(record)} okText="确定"
                        cancelText="取消"
                    >
                        <a href="javascript:;">删除</a>
                    </Popconfirm>
                    <Divider type="vertical"/>
                    <a href="javascript:;" onClick={() => this.onAddChildClick(record)}>新建子项</a>
                </span>
                )
        }];

        this.state = {
            dictDataAddState: DictDataAdd.newState(),
            dictDataEditState: DictDataEdit.newState(),
            columns: columns
        };
    }

    onDeleteClick(data) {

        var me = this;

        var dictData = {
            "DICT_TYPE_CODE": data.DICT_TYPE_CODE,
            "CODE": data.CODE
        };

        Ajax.apiPost("/systemmanager/systemsetting/dict/data/delete", dictData).then(function (d) {
            me.props.state.getList(data.DICT_TYPE_CODE);
        });
    }

    onAdded(dictTypeCode) {
        this.props.state.getList(dictTypeCode);
    }

    onAddClick() {
        var data = {
            DICT_TYPE_CODE: this.props.state.DICT_TYPE_CODE
        };
        this.state.dictDataAddState.data = data;
        this.state.dictDataAddState.show();
    }

    onEditClick(data) {
        this.state.dictDataEditState.data = data;
        this.state.dictDataEditState.show();
    }

    onAddChildClick(data) {

        var childData = {};
        childData.PARENT_ID = data.ID;
        childData.DICT_TYPE_CODE = data.DICT_TYPE_CODE;
        this.state.dictDataAddState.data = childData;
        this.state.dictDataAddState.show();
    }

    render() {
        var tableData = [];

        for (var i = 0; i < this.props.state.data.length; i++) {
            tableData.push(this.props.state.data[i]);
        }

        return (
            <div>
                <div className="tool-box">
                    <Button onClick={() => this.onAddClick()} size={"small"}>新增字典项目</Button>
                </div>
                <DictDataAdd
                    state={this.state.dictDataAddState}
                    onAdded={dictTypeCode => this.onAdded(dictTypeCode)}
                />
                <DictDataEdit
                    state={this.state.dictDataEditState}
                    onEdited={dictTypeCode => this.onAdded(dictTypeCode)}
                />
                <Table rowKey={record => record.CODE} dataSource={tableData} columns={this.state.columns}/>
            </div>
        );
    }
}
