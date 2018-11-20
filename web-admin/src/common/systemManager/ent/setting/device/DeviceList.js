import React from "react";
import {autorun, observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {withRouter} from "react-router-dom";
import * as PropTypes from "prop-types";
import {Button, Divider, Layout, Modal, Popconfirm, Row, Table} from "antd";
import {Ajax} from "../../../../unit/ajax";
import {entListState} from "../EntManager";
import DeviceEditDialog from "./DeviceEditDialog";
import DeviceDetailDialog from "./DeviceDetailDialog";

class AppState {
    @observable data = [];
    deviceAddState = DeviceEditDialog.newState();
    deviceEditState = DeviceEditDialog.newState();
    deviceDetailState = DeviceDetailDialog.newState();

    constructor() {
        console.log("constructor");
        autorun(() => {
            if (entListState.ent) {
                this.loadDeviceData(entListState.ent.ID);
            }
        });
    }

    loadDeviceData = (entId) => {
        Ajax.apiPost("/systemmanager/ent/setting/device/list", {ENT_ID: entId})
            .then((d) => {
                this.data = d.data || [];
            });
    };
}

@withRouter
@observer
export default class DeviceList extends React.Component {
    static propTypes = {
        state: PropTypes.any,
        history: PropTypes.any
    };

    static newState() {
        return new AppState();
    }

    _columns = [
        {
            title: "所属站点",
            dataIndex: "SITE_ID_DESC",
            key: "SITE_ID_DESC"
        },
        {
            title: "设备名称",
            dataIndex: "NAME",
            key: "NAME"
        },
        {
            title: "设备型号",
            dataIndex: "MODEL",
            key: "MODEL"
        },
        {
            title: "设备类型",
            dataIndex: "DEVICE_TYPE_DESC",
            key: "DEVICE_TYPE_DESC"
        },
        {
            title: "生产厂商",
            dataIndex: "MFR",
            key: "MFR"
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => (
                <span>
                    <a href="javascript:;" onClick={() => this.onOpSettingClick(text, record)}>运维设置</a>
                    <Divider type="vertical"/>
                    <a href="javascript:;" onClick={() => this.onEditClick(text, record)}>编辑</a>
                    <Divider type="vertical"/>
                    <a href="javascript:;" onClick={() => this.onDetailClick(text, record)}>详情</a>
                    <Divider type="vertical"/>
                    <Popconfirm
                        title="确定要删除吗？"
                        onConfirm={() => this.onDeleteClick(text, record)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <a href="javascript:;">删除</a>
                    </Popconfirm>
                </span>
            )
        }];

    onAddClick = () => {
        this.props.state.deviceAddState.show();
    };

    onOpSettingClick = (text, record) => {
        this.props.history.push("/systemmanager/operationsetting/deviceopsetting/" + record.ID);
    };

    onEditClick = (text, record) => {
        this.props.state.deviceAddState.hide();
        this.props.state.deviceEditState.data = record;
        this.props.state.deviceEditState.show();
    };

    onDetailClick = (text, record) => {
        this.props.state.deviceDetailState.data = record;
        this.props.state.deviceDetailState.show();
    };

    onDeleteClick = (text, record) => {
        Ajax.apiPost("/systemmanager/ent/setting/device/delete", {ID: record.ID})
            .then((d) => {
                Modal.success({
                    title: "提示",
                    content: "删除成功！",
                    okText: "确定"
                });
                this.props.state.loadDeviceData(entListState.ent.ID);
            });
    };

    onEditSuccess = () => {
        Modal.success({
            title: "提示",
            content: "编辑成功！",
            okText: "确定"
        });
        this.props.state.loadDeviceData(entListState.ent.ID);
    };

    onAddSuccess = () => {
        Modal.success({
            title: "提示",
            content: "保存成功！",
            okText: "确定"
        });
        this.props.state.loadDeviceData(entListState.ent.ID);
    };


    render() {
        const appState = this.props.state;
        return (
            <Layout>
                <DeviceEditDialog
                    state={appState.deviceAddState}
                    dialogTitle="新增站点"
                    actionURL="/systemmanager/ent/setting/device/create"
                    onSubmitSuccess={this.onAddSuccess}
                />

                <DeviceEditDialog
                    state={appState.deviceEditState}
                    dialogTitle="编辑站点"
                    actionURL="/systemmanager/ent/setting/device/update"
                    onSubmitSuccess={this.onEditSuccess}
                />

                <DeviceDetailDialog
                    state={appState.deviceDetailState}
                    dialogTitle="站点详情"
                />

                <Layout>
                    <Row>
                        <Button
                            style={{marginLeft: 12}}
                            type="primary"
                            onClick={this.onAddClick}
                        >新增</Button>
                    </Row>

                    <Table
                        rowKey={record => record.ID}
                        dataSource={toJS(appState.data)}
                        columns={this._columns}
                    />
                </Layout>
            </Layout>
        );
    }
}
