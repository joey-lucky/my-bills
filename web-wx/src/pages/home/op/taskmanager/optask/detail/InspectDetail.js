import * as React from "react";
import {Col, Divider, Form, Row, Table} from "antd";
import PropTypes from "prop-types";
import {observable, toJS} from "mobx";
import DetailUtils from "./DetailUtils";
import * as styles from "./detail.css";
import {Ajax} from "@utils/ajax";
import {observer} from "mobx-react";

class AppState {
    @observable detailData = {};
    @observable inspectTableData = [];
    @observable suppliesTableData = [];

    loadInspectModel(taskId = "") {
        this.detailData = {};
        this.inspectTableData = [];
        Ajax.apiPost("/op/taskmanager/optask/inspect/get-detail-data", {TASK_ID: taskId})
            .then((d) => {
                let data = d.data || [];
                if (data.length > 0) {
                    let {relationModelMap = {}, ...detailData} = data[0];
                    this.detailData = detailData;
                    let deviceList = this.parseDeviceData(relationModelMap["BD_OP_JOB_INSPECT_DEVICE"]);
                    let itemList = this.parseItemData(relationModelMap["BD_OP_JOB_INSPECT_ITEM"]);
                    this.inspectTableData = [...deviceList, ...itemList];
                }
            });
    };

    loadSuppliesDetail(taskId = "") {
        this.suppliesTableData = [];
        Ajax.apiPost("/op/taskmanager/optask/inspect/get-supplies-data", {TASK_ID: taskId})
            .then((d) => {
                let data = d.data || [];
                this.suppliesTableData = this.parseSuppliesData(data);
            });
    };

    parseDeviceData(modelList = []) {
        modelList.forEach((item, index) => {
            item.ITEM_CODE_PARENT_ID_DESC = "自动分析单元";
            if (index === 0) {
                item.rowSpan = modelList.length;
            }
            item.ITEM_CODE_DESC = item.DEVICE_ID_DESC;
        });
        return modelList;
    }

    parseItemData(modelList = []) {
        let modelListMap = {};
        modelList.forEach((item) => {
            let itemParentValue = item.ITEM_CODE_PARENT_ID_DESC;
            if (!modelListMap[itemParentValue]) {
                modelListMap[itemParentValue] = [];
            }
            modelListMap[itemParentValue].push(item);
        });
        let result = [];
        Object.keys(modelListMap).forEach((deviceName) => {
            let list = modelListMap[deviceName];
            list[0].rowSpan = list.length;
            result.push(...list);
        });
        return result;
    }

    parseSuppliesData(modelList = []) {
        let modelListMap = {};
        modelList.forEach((item) => {
            let itemParentValue = item["DEVICE_ID_DESC"];
            if (!modelListMap[itemParentValue]) {
                modelListMap[itemParentValue] = [];
            }
            modelListMap[itemParentValue].push(item);
        });
        let result = [];
        Object.keys(modelListMap).forEach((deviceName) => {
            let list = modelListMap[deviceName];
            list[0].rowSpan = list.length;
            result.push(...list);
        });
        return result;
    }
}

@observer
export default class InspectDetail extends React.Component {
    static propTypes = {
        taskModel: PropTypes.any
    };

    _inspectColumns = [
        {
            title: "单元",
            dataIndex: "ITEM_CODE_PARENT_ID_DESC",
            key: "ITEM_CODE_PARENT_ID_DESC",
            render: (value, row, index) => ({
                children: value,
                props: {
                    rowSpan: row.rowSpan || 0
                }
            })
        }, {
            title: "备件耗材项",
            dataIndex: "ITEM_CODE_DESC",
            key: "ITEM_CODE_DESC"
        }, {
            title: "结果",
            dataIndex: "RESULT_STATUS",
            key: "RESULT_STATUS",
            render: (value, row, index) => {
                if (value === "0") {
                    return {
                        children: <div className={styles.errorValue}>异常</div>
                    };
                } else {
                    return {
                        children: <div>正常</div>
                    };
                }
            }
        }];

    _suppliesColumns = [
        {
            title: "类型",
            dataIndex: "DEVICE_ID_DESC",
            key: "DEVICE_ID_DESC",
            render: (value, row, index) => ({
                children: value,
                props: {
                    rowSpan: row.rowSpan || 0
                }
            })
        }, {
            title: "备件耗材项",
            dataIndex: "SUPPLIES_CODE_DESC",
            key: "SUPPLIES_CODE_DESC"
        }, {
            title: "处理方式",
            dataIndex: "SOLUTION_CODE_DESC",
            key: "SOLUTION_CODE_DESC"
        }];

    _appState = new AppState();

    componentDidMount() {
        let {taskModel} = this.props;
        this._appState.loadInspectModel(taskModel.ID);
        this._appState.loadSuppliesDetail(taskModel.ID);
    }

    componentWillReceiveProps(nextProps) {
        let {taskModel = {}} = this.props;
        let {taskModel: nextTaskModel = {}} = nextProps;
        if (taskModel !== nextTaskModel && taskModel.ID !== nextTaskModel.ID) {
            this._appState.loadInspectModel(nextTaskModel.ID);
            this._appState.loadSuppliesDetail(nextTaskModel.ID);
        }
    }

    render() {
        let {inspectTableData, suppliesTableData, detailData} = this._appState;
        //是否异常
        let isError = detailData.RESULT_STATUS && detailData.RESULT_STATUS === "0";

        const layout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
            style: {width: "100%"},
            colon: true
        };
        return (
            <React.Fragment>
                <Row>
                    <Col span={11}>
                        <Form.Item
                            {...layout}
                            label="巡检结果"
                        >
                            <div className={`${isError ? styles.errorValue : ""}`}>
                                {isError ? "异常" : "正常"}
                            </div>
                        </Form.Item>
                    </Col>
                    <Col span={11} offset={2}>
                        <Form.Item
                            {...layout}
                            label="异常描述"
                        >
                            {detailData.EXCEPTION_DESC}
                        </Form.Item>
                    </Col>
                </Row>
                <Divider type="horizontal"/>
                <Row>
                    <Table
                        {...DetailUtils.getTableLayout({title: "巡检明细"})}
                        rowKey={record => record.ID}
                        dataSource={toJS(inspectTableData)}
                        columns={this._inspectColumns}
                    />
                </Row>

                <Row style={{marginTop:12}}>
                    <Table
                        {...DetailUtils.getTableLayout({title: "耗材更换明细"})}
                        rowKey={record => record.ID}
                        dataSource={toJS(suppliesTableData)}
                        columns={this._suppliesColumns}
                    />
                </Row>
            </React.Fragment>
        );
    }
}
