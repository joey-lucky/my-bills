/**
 * 企业左侧列表
 */
import React from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import * as PropTypes from "prop-types";
import {Button, Col, Input, List, Modal, Pagination, Row} from "antd";
import EntDetail from "./EntDetail";
import {Ajax} from "@utils/ajax";
import EntEditDialog from "./EntEditDialog";

import * as styles from "./EntList.css";

const Search = Input.Search;

class AppState {
    addState = EntEditDialog.newState();
    editState = EntEditDialog.newState();
    detailState = EntDetail.newState();

    // 数据源
    @observable entList = [];

    // 选中项
    @observable ent = {};

    // 搜索项
    @observable searchText = null;

    @observable pageInfo = {
        pageSize: 15,
        pageIndex: 1,
        recordCount: 0
    };


    onSearchEnt = (keyWord) => {
        this.searchText = keyWord;
        this.loadEntList();
    };

    onAddSuccess = () => {
        this.loadEntList();
    };

    onEditSuccess = () => {
        this.loadEntList();
    };

    onItemClick = (item) => {
        this.ent = item;
        this.entList = [...this.entList];
    };

    onAddClick = () => {
        this.addState.show();
    };

    showEditDialog = () => {
        this.editState.data = {...this.ent};
        this.editState.show();
    };

    loadEntList() {
        Ajax.apiPost("/systemmanager/ent/setting/ent/list", {...this.pageInfo, NAME: this.searchText || ""})
            .then((d) => {
                this.entList = d.data || [];
                this.pageInfo = d.page_info || this.pageInfo;
                if (this.entList && this.entList.length > 0) {
                    this.ent = this.entList[0];
                } else {
                    this.ent = {};
                }
            });
    }

    // 删除企业
    deleteEnt = () => {
        Ajax.apiPost("/systemmanager/ent/setting/ent/delete", {ID: this.ent.ID})
            .then((d) => {
                Modal.success({
                    title: "提示",
                    content: "删除成功！",
                    okText: "确定"
                });
                this.loadEntList();
            });
    }
}

@observer
export default class EntList extends React.Component {
    static propTypes = {
        state: PropTypes.any
    };

    static newState() {
        return new AppState();
    }

    componentDidMount() {
        this.props.state.loadEntList();
    }

    onPageChange = (page, pageSize) => {
        this.props.state.pageInfo.pageIndex = page;
        this.props.state.loadEntList();
    };

    render() {
        const appState = this.props.state;
        return (
            <div className={styles.container}>
                <EntEditDialog
                    state={appState.addState}
                    dialogTitle="新增企业"
                    actionURL="/systemmanager/ent/setting/ent/create"
                    onSubmitSuccess={appState.onAddSuccess}
                />

                <EntEditDialog
                    state={appState.editState}
                    dialogTitle="编辑企业"
                    actionURL="/systemmanager/ent/setting/ent/update"
                    onSubmitSuccess={appState.onEditSuccess}
                />

                <Row
                    type="flex"
                    style={{paddingTop: 12, paddingBottom: 12}}
                    align="middle"
                >
                    <Col span={17} offset={1}>
                        <Search
                            placeholder="请输入名称"
                            enterButton
                            onSearch={appState.onSearchEnt}
                        />
                    </Col>
                    <Col span={4} offset={1}>
                        <Button
                            shape="circle"
                            type="primary"
                            icon="plus"
                            onClick={appState.onAddClick}
                        />
                    </Col>
                </Row>

                <List
                    className={styles.content}
                    key={appState.ent}
                    itemLayout="horizontal"
                    dataSource={appState.entList}
                    renderItem={(ent, index) => (
                        <List.Item
                            className={`${appState.ent.ID === ent.ID ? styles.itemChecked : styles.item}`}
                            onClick={() => {
                                appState.onItemClick(ent, index);
                            }}
                        >
                            <div>{ent.NAME}</div>
                        </List.Item>
                    )}
                />

                <div className={styles.paginationContainer}>
                    <Pagination
                        current={appState.pageInfo.pageIndex}
                        pageSize={appState.pageInfo.pageSize}
                        total={appState.pageInfo.recordCount}
                        simple
                        size="small"
                        defaultCurrent={1}
                        onChange={this.onPageChange}
                    />
                </div>
            </div>
        );
    }
}
