import React from "react";
import {autorun, observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {Button, Divider, Layout, Modal, Popconfirm, Row, Table} from "antd";
import * as PropTypes from "prop-types";
import {Ajax} from "@utils/ajax";
import {entListState} from "../EntManager";
import SiteEditDialog from "./SiteEditDialog.js";
import SiteDetailDialog from "./SiteDetailDialog";

class AppState {
    _columns = [
        {
            title: "站点名称",
            dataIndex: "NAME",
            key: "NAME"
        },
        {
            title: "数采仪编码",
            dataIndex: "MN",
            key: "MN"
        },
        // {
        //     title: '地址',
        //     dataIndex: 'ADDRESS',
        //     key: 'ADDRESS',
        // },
        {
            title: "运营单位",
            dataIndex: "OPERATION_UNIT_DESC",
            key: "OPERATION_UNIT_DESC"
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => (
                <span>
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

    @observable data = [];
    siteAddState = SiteEditDialog.newState();
    siteEditState = SiteEditDialog.newState();
    siteDetailState = SiteDetailDialog.newState();
    entId = null;

    constructor() {
        autorun(() => {
            if (entListState.ent) {
                this.entId = entListState.ent.ID;
            } else {
                this.entId = null;
            }
            this.loadStationList();
        });
    }

    onAddClick = () => {
        this.siteAddState.show();
    };

    onEditClick = (text, record) => {
        this.siteAddState.hide();
        this.siteEditState.data = record;
        this.siteEditState.show();
    };

    onDetailClick = (text, record) => {
        this.siteDetailState.data = record;
        this.siteDetailState.show();
    };

    onDeleteClick = (text, record) => {
        Ajax.apiPost("/systemmanager/ent/setting/site/delete", {ID: record.ID})
            .then((d) => {
                Modal.success({
                    title: "提示",
                    content: "删除成功！",
                    okText: "确定"
                });
                this.loadStationList();
            });
    };

    onEditSuccess = () => {
        Modal.success({
            title: "提示",
            content: "编辑成功！",
            okText: "确定"
        });
        this.loadStationList();
    };

    onAddSuccess = () => {
        Modal.success({
            title: "提示",
            content: "保存成功！",
            okText: "确定"
        });
        this.loadStationList();
    };

    loadStationList = () => {
        if (this.entId) {
            Ajax.apiPost("/systemmanager/ent/setting/site/list", {ENT_ID: this.entId})
                .then((d) => {
                    this.data = d.data || [];
                });
        }
    }
}

@observer
export default class SiteList extends React.Component {
    static propTypes = {
        state: PropTypes.any
    };
    static newState() {
        return new AppState();
    }

    render() {
        const appState = this.props.state;
        return (
            <Layout>
                <SiteEditDialog
                    state={appState.siteAddState}
                    dialogTitle="新增站点"
                    actionURL="/systemmanager/ent/setting/site/create"
                    onSubmitSuccess={appState.onAddSuccess}
                />

                <SiteEditDialog
                    state={appState.siteEditState}
                    dialogTitle="编辑站点"
                    actionURL="/systemmanager/ent/setting/site/update"
                    onSubmitSuccess={appState.onEditSuccess}
                />

                <SiteDetailDialog
                    state={appState.siteDetailState}
                    dialogTitle="站点详情"
                />

                <Layout>
                    <Row>
                        <Button
                            style={{marginLeft: 12}}
                            type="primary"
                            onClick={this.props.state.onAddClick}
                        >新增</Button>
                    </Row>

                    <Table
                        rowKey={record => record.ID}
                        dataSource={toJS(appState.data)}
                        columns={appState._columns}
                    />
                </Layout>
            </Layout>
        );
    }
}
