import {Table} from "antd";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import React from "react";
import {Ajax} from "@utils/ajax";

class AppState {
    @observable data = [];
    loadData = () => {
        Ajax.apiPost("/op/taskmanager/outofservice/list")
            .then((d) => {
                this.data = d.data || [];
            });
    };
}

@observer
export default class OutOfServiceList extends React.Component {
    _appState = new AppState();
    _columns = [
        {
            title: "站点",
            dataIndex: "SITE_ID_DESC",
            key: "SITE_ID_DESC"
        },
        {
            title: "类型",
            dataIndex: "TYPE_DESC",
            key: "TYPE_DESC"
        },
        {
            title: "开始时间",
            dataIndex: "START_TIME",
            key: "START_TIME"
        },
        {
            title: "结束时间",
            dataIndex: "END_TIME",
            key: "END_TIME"
        },
        {
            title: "原因",
            dataIndex: "CAUSE",
            key: "CAUSE"
        },
    ];

    componentDidMount(){
        this._appState.loadData();
    }

    render() {
        const state = this._appState;
        const {data} = state;
        return (
            <div style={{marginTop: 24}}>
                <Table
                    rowKey={record => record.ID}
                    dataSource={toJS(data)}
                    columns={this._columns}
                />
            </div>
        );
    }
}
