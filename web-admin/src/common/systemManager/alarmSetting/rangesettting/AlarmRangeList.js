import React from "react";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {Table} from "antd";
import {Ajax} from "../../../unit/ajax";
import AlarmRangeEditDialog from "./AlarmRangeEditDialog";

class AppState {
    columns = [
        {
            title: "所属站点",
            dataIndex: "SITE_NAME",
            key: "SITE_NAME"
        },
        {
            title: "参数名称",
            dataIndex: "POLL_NAME",
            key: "POLL_NAME"
        },
        {
            title: "浓度下限",
            dataIndex: "DENSITY_LIMIT_DOWN",
            key: "DENSITY_LIMIT_DOWN"
        },
        {
            title: "浓度上限",
            dataIndex: "DENSITY_LIMIT_UP",
            key: "DENSITY_LIMIT_UP"
        },
        {
            title: "排放量下限",
            dataIndex: "EMIS_LIMIT_DOWN",
            key: "EMIS_LIMIT_DOWN"
        },
        {
            title: "排放量上限",
            dataIndex: "EMIS_LIMIT_UP",
            key: "EMIS_LIMIT_UP"
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => (
                <span>
                    <a href="javascript:;" onClick={() => this.onEditClick(text, record)}>设置</a>
                </span>
            )
        }];
    editState = AlarmRangeEditDialog.newState();

    @observable data = [];

    constructor() {
        this.loadData();
    }

    onEditClick = (text, record) => {
        this.editState.data = record;
        this.editState.show();
    };

    loadData = () => {
        Ajax.apiPost("/systemmanager/alarmsetting/alarm/polldensity/list")
            .then((d) => {
                this.data = d.data || [];
            });
    };
}

@observer
export default class AlarmRangeList extends React.Component {
    static newState() {
        return new AppState();
    }

    _appState = new AppState();

    render() {
        const appState = this._appState;
        return (
            <div style={{marginTop: 24}}>
                <AlarmRangeEditDialog
                    state={appState.editState}
                    onSuccess={() => appState.loadData()}
                />

                <Table
                    rowKey={record => record.ID}
                    dataSource={toJS(appState.data)}
                    columns={appState.columns}
                />
            </div>
        );
    }
}
