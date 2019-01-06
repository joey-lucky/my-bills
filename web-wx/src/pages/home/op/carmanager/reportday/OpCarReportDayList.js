import React from "react";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {Modal, Table} from "antd";
import {Ajax} from "@utils/ajax";
import OpCarReportDayFilter from "./OpCarReportDayFilter";

class AppState {
    filterState = OpCarReportDayFilter.newState();

    @observable data = [];

    constructor() {
        this.loadData();
    }

    loadData = () => {
        Ajax.apiPost("/op/carmanager/carreportday/list", toJS(this.filterState.data))
            .then((d) => {
                let data = d.data || [];
                this.data = data;
            });
    };
}

@observer
export default class OpCarReportDayList extends React.Component {
    static newState() {
        return new AppState();
    }

    _appState = new AppState();
    _columns = [
        {
            title: "车牌号",
            dataIndex: "CAR_ID_DESC",
            key: "CAR_ID_DESC"
        },
        {
            title: "运维组",
            dataIndex: "GROUP_ID_DESC",
            key: "GROUP_ID_DESC"
        },
        {
            title: "记录时间",
            dataIndex: "DATATIME",
            key: "DATATIME"
        },
        {
            title: "出行时间",
            dataIndex: "START_TIME",
            key: "START_TIME"
        },
        {
            title: "回归时间",
            dataIndex: "STOP_TIME",
            key: "STOP_TIME"
        },
        {
            title: "时长(分钟)",
            dataIndex: "RUN_TIME",
            key: "RUN_TIME"
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => (
                <div>
                    <a href="javascript:" onClick={() => this.onDetailClick(text, record)}>查看</a>
                </div>
            )
        }];

    onSearchClick = () => {
        this._appState.loadData();
    };

    onAddClick = () => {

    };

    onDetailClick = (text, record) => {

    };

    onAddSuccess = () => {
        Modal.success({
            title: "提示",
            content: "派发成功！",
            okText: "确定"
        });
        this._appState.loadData();
    };

    render() {
        const state = this._appState;
        return (
            <div style={{marginTop: 24}}>
                <OpCarReportDayFilter
                    state={state.filterState}
                    onAddClick={this.onAddClick}
                    onSearchClick={this.onSearchClick}
                />

                <Table
                    rowKey={record => record.ID}
                    dataSource={toJS(state.data)}
                    columns={this._columns}
                />
            </div>
        );
    }
}
