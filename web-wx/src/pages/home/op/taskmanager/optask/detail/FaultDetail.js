import * as React from "react";
import {Col, Divider, Form, Row, Table} from "antd";
import PropTypes from "prop-types";
import {observable, toJS} from "mobx";
import DetailUtils from "./DetailUtils";
import {Ajax} from "@utils/ajax";
import {observer} from "mobx-react";

class AppState {
    @observable detailData = {};
    @observable suppliesTableData = [];

    loadInspectModel(taskId = "") {
        this.detailData = {};
        this.inspectTableData = [];
        Ajax.apiPost("/op/taskmanager/optask/fault/get-detail-data", {TASK_ID: taskId})
            .then((d) => {
                let data = d.data || [];
                if (data.length > 0) {
                    this.detailData = data[0];
                }
            });
    };

    loadSuppliesDetail(taskId = "") {
        this.suppliesTableData = [];
        Ajax.apiPost("/op/taskmanager/optask/fault/get-supplies-data", {TASK_ID: taskId})
            .then((d) => {
                let data = d.data || [];
                this.suppliesTableData = this.parseSuppliesData(data);
            });
    };

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
export default class FaultDetail extends React.Component {
    static propTypes = {
        taskModel: PropTypes.any
    };

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
        let {suppliesTableData, detailData} = this._appState;
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
                            label="仪器故障原因"
                        >
                            {
                                detailData["DEVICE_FAULT_CAUSE"]
                            }
                        </Form.Item>
                    </Col>
                    <Col span={11} offset={2}>
                        <Form.Item
                            {...layout}
                            label="其它故障原因"
                        >
                            { detailData["OTHER_CAUSE"]}
                        </Form.Item>
                    </Col>
                </Row>
                <Divider type="horizontal"/>

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
