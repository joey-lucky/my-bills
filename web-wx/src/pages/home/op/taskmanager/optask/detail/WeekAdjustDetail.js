import * as React from "react";
import {Col, Form, Row, Table} from "antd";
import PropTypes from "prop-types";
import {observable, toJS} from "mobx";
import DetailUtils from "./DetailUtils";
import {Ajax} from "@utils/ajax";
import {observer} from "mobx-react";

class AppState {
    @observable detailData = {};
    @observable tableData = [];

    loadDetail(taskId = "") {
        this.detailData = {};
        this.inspectTableData = [];
        Ajax.apiPost("/op/taskmanager/optask/adjustweek/get-detail-data", {TASK_ID: taskId})
            .then((d) => {
                let data = d.data || [];
                if (data.length > 0) {
                    let {relationModelMap = {}, ...detailData} = data[0];
                    let childList = relationModelMap["BD_OP_JOB_ADJUST_WEEK_POLL"]||[];
                    childList.forEach((item, index) => {
                        let resultStatus = item["RESULT_STATUS"];
                        if (resultStatus === "0") {
                            item.RESULT_STATUS_DESC = "×";
                        } else if (resultStatus === "1") {
                            item.RESULT_STATUS_DESC = "√";
                        } else {
                            item.RESULT_STATUS_DESC = "√";
                        }
                    });
                    this.tableData = childList;
                    this.detailData = detailData;
                }
            });
    };
}

@observer
export default class WeekAdjustDetail extends React.Component {
    static propTypes = {
        taskModel: PropTypes.any
    };

    _columns = [
        {
            title: "因子",
            dataIndex: "POLL_CODE_DESC",
            key: "POLL_CODE_DESC"
        },
        {
            title: "是否校准",
            dataIndex: "RESULT_STATUS_DESC",
            key: "RESULT_STATUS_DESC"
        }];
    _appState = new AppState();

    componentDidMount() {
        let {taskModel} = this.props;
        this._appState.loadDetail(taskModel.ID);
    }

    componentWillReceiveProps(nextProps) {
        let {taskModel = {}} = this.props;
        let {taskModel: nextTaskModel = {}} = nextProps;
        if (taskModel !== nextTaskModel && taskModel.ID !== nextTaskModel.ID) {
            this._appState.loadDetail(nextTaskModel.ID);
        }
    }

    render() {
        const {tableData,detailData} = this._appState;
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
                            label="校准类型"
                        >
                            {detailData && detailData["ADJUST_TYPE_DESC"]}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Table
                        {...DetailUtils.getTableLayout({title: "校准记录"})}
                        rowKey={record => record.ID}
                        dataSource={toJS(tableData)}
                        columns={this._columns}
                    />
                </Row>
            </React.Fragment>
        );
    }
}
