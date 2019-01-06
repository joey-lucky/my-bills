import React from "react";
import {autorun, observable} from "mobx";
import {observer} from "mobx-react";
import * as PropTypes from "prop-types";
import {Button, Divider, Layout, Modal, Popconfirm, Row, Table} from "antd";
import {Ajax} from "@utils/ajax";
import {entListState} from "../EntManager";
import SitePollEditDialog from "./SitePollEditDialog";
import SitePollDetailDialog from "./SitePollDetailDialog";

class AppState {
    _columns = [
        {
            title: "所属站点",
            dataIndex: "SITE_ID_DESC",
            key: "SITE_ID_DESC"
        },
        {
            title: "参数名称",
            dataIndex: "POLL_CODE_DESC",
            key: "POLL_CODE_DESC"
        },
        {
            title: "参数单位",
            dataIndex: "PARAM_UNIT_DESC",
            key: "PARAM_UNIT_DESC"
        },
        {
            title: "最小量程",
            dataIndex: "MIN_RANGE",
            key: "MIN_RANGE"
        },
        {
            title: "最大量程",
            dataIndex: "MAX_RANGE",
            key: "MAX_RANGE"
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
    addState = SitePollEditDialog.newState();
    editState = SitePollEditDialog.newState();
    detailState = SitePollDetailDialog.newState();

    constructor() {
        autorun(() => {
            entListState.ent && entListState.ent.ID && this.loadData(entListState.ent.ID);
        });
    }

    onAddClick = () => {
        this.addState.show();
    };

    onEditClick = (text, record) => {
        this.addState.hide();
        this.editState.data = record;
        this.editState.show();
    };

    onDetailClick = (text, record) => {
        this.detailState.data = record;
        this.detailState.show();
    };

    onDeleteClick = (text, record) => {
        Ajax.apiPost("/systemmanager/ent/setting/sitepoll/delete", {ID: record.ID})
            .then((d) => {
                Modal.success({
                    title: "提示",
                    content: "删除成功！",
                    okText: "确定"
                });
                this.loadData(entListState.ent.ID);
            });
    };

    onEditSuccess = () => {
        Modal.success({
            title: "提示",
            content: "编辑成功！",
            okText: "确定"
        });
        this.loadData(entListState.ent.ID);
    };

    onAddSuccess = () => {
        Modal.success({
            title: "提示",
            content: "保存成功！",
            okText: "确定"
        });
        this.loadData(entListState.ent.ID);
    };

    loadData = (entId) => {
        Ajax.apiPost("/systemmanager/ent/setting/sitepoll/list", {ENT_ID: entId})
            .then((d) => {
                this.data = d.data || [];
            });
    }
}

@observer
export default class SitePollList extends React.Component {
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
                <SitePollEditDialog
                    state={appState.addState}
                    dialogTitle="新增参数"
                    actionURL="/systemmanager/ent/setting/sitepoll/create"
                    onSubmitSuccess={appState.onAddSuccess}
                />

                <SitePollEditDialog
                    state={appState.editState}
                    dialogTitle="编辑参数"
                    actionURL="/systemmanager/ent/setting/sitepoll/update"
                    onSubmitSuccess={appState.onEditSuccess}
                />

                <SitePollDetailDialog
                    state={appState.detailState}
                    dialogTitle="参数详情"
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
                        dataSource={appState.data}
                        columns={appState._columns}
                    />
                </Layout>
            </Layout>
        );
    }
}
