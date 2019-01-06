import * as React from "react";
import {observer} from "mobx-react";
import {Col, Divider, Form, Row, Table} from "antd";
import PropTypes from "prop-types";
import {computed, observable, toJS} from "mobx";
import * as styles from "./OpTaskDetailDialog.css";
import Dialog from "@components/Dialog";
import FaultDetail from "./detail/FaultDetail";
import SuppliesDetail from "./detail/SuppliesDetail";
import InspectDetail from "./detail/InspectDetail";
import TaskBasicDetail from "./detail/TaskBasicDetail";
import TaskPhotoDetail from "./detail/TaskPhotoDetail";
import WeekAdjustDetail from "./detail/WeekAdjustDetail";

class AppState {
    @observable visible = false;
    @observable taskData = {};
    @observable detailData = [];
    @observable alarmData = [];
    @observable positionData = [];
}

@observer
export default class OpTaskDetailDialog extends React.Component {
    static propTypes = {
        onCloseClick: PropTypes.any,
        state: PropTypes.any
    };

    static newState() {
        return new AppState();
    }

    static renderEmergency(detailData) {
        let data = detailData[0];
        const layout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
            style: {width: "100%"},
            colon: true
        };
        return (
            <Row>
                <Col span={11}>
                    <Form.Item
                        {...layout}
                        label="应急任务描述"
                    >
                        {data && data.REMARK}
                    </Form.Item>
                </Col>
            </Row>
        );
    }

    static renderVerifyMonth(detailData) {
        let data = detailData[0];
        let childList = OpTaskDetailDialog.getRelationModel(data, "BD_OP_JOB_VERIFY_MONTH_POLL");
        childList.forEach((item, index) => {
            let resultStatus = item.RESULT_STATUS;
            if (resultStatus === "0") {
                item.RESULT_STATUS_DESC = "×";
            } else if (resultStatus === "1") {
                item.RESULT_STATUS_DESC = "√";
            } else {
                item.RESULT_STATUS_DESC = "√";
            }
        });
        const columns = [
            {
                title: "因子",
                dataIndex: "POLL_CODE_DESC",
                key: "POLL_CODE_DESC"
                // className: styles.unitHeader,
            },
            {
                title: "是否合格",
                dataIndex: "RESULT_STATUS_DESC",
                key: "RESULT_STATUS_DESC"
                // className: styles.unitHeader,
            }];
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
                            label="校验类型"
                        >
                            {data && data.VERIFY_TYPE_DESC}
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={22}>
                        <Form.Item
                            labelCol={{span: 4}}
                            wrapperCol={{span: 20}}
                            style={{width: "100%"}}
                            colon
                            label="校验信息"
                        >
                            <Table
                                style={{width: 200}}
                                pagination={false}
                                bordered
                                rowKey={record => record.ID}
                                dataSource={toJS(childList)}
                                columns={columns}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }

    static renderVerifyQuarter(detailData) {
        let data = detailData[0];
        let childList = OpTaskDetailDialog.getRelationModel(data, "BD_OP_JOB_VERIFY_QUARTER_POLL");
        childList.forEach((item, index) => {
            if (item.ZERO_DRIFT_STATUS === "0") {
                item.ZERO_DRIFT_STATUS_DESC = "×";
            } else if (item.ZERO_DRIFT_STATUS === "1") {
                item.ZERO_DRIFT_STATUS_DESC = "√";
            } else {
                item.ZERO_DRIFT_STATUS_DESC = "√";
            }
            if (item.RANGE_DRIFT_STATUS === "0") {
                item.RANGE_DRIFT_STATUS_DESC = "×";
            } else if (item.RANGE_DRIFT_STATUS === "1") {
                item.RANGE_DRIFT_STATUS_DESC = "√";
            } else {
                item.RANGE_DRIFT_STATUS_DESC = "√";
            }
            if (item.REPEAT_STATUS === "0") {
                item.REPEAT_STATUS_DESC = "×";
            } else if (item.REPEAT_STATUS === "1") {
                item.REPEAT_STATUS_DESC = "√";
            } else {
                item.REPEAT_STATUS_DESC = "√";
            }
        });
        const columns = [
            {
                title: "因子",
                dataIndex: "POLL_CODE_DESC",
                key: "POLL_CODE_DESC"
                // className: styles.unitHeader,
            },
            {
                title: "零点漂移是否合格",
                dataIndex: "ZERO_DRIFT_STATUS_DESC",
                key: "ZERO_DRIFT_STATUS_DESC"
                // className: styles.unitHeader,
            },
            {
                title: "量程漂移是否合格",
                dataIndex: "RANGE_DRIFT_STATUS_DESC",
                key: "RANGE_DRIFT_STATUS_DESC"
                // className: styles.unitHeader,
            },
            {
                title: "重复性是否合格",
                dataIndex: "REPEAT_STATUS_DESC",
                key: "REPEAT_STATUS_DESC"
                // className: styles.unitHeader,
            }
        ];
        return (
            <React.Fragment>
                {/* <Row>*/}
                {/* <Col span={11}>*/}
                {/* <Form.Item*/}
                {/* {...layout}*/}
                {/* label="校验类型">*/}
                {/* {data && data["VERIFY_TYPE_DESC"]}*/}
                {/* </Form.Item>*/}
                {/* </Col>*/}
                {/* </Row>*/}

                <Row>
                    <Col span={22}>
                        <Form.Item
                            labelCol={{span: 4}}
                            wrapperCol={{span: 20}}
                            style={{width: "100%"}}
                            colon
                            label="校验信息"
                        >
                            <Table
                                pagination={false}
                                bordered
                                rowKey={record => record.ID}
                                dataSource={toJS(childList)}
                                columns={columns}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }

    static renderOverCheck(detailData, alarmData) {
        let childList = OpTaskDetailDialog.getRelationModel(detailData[0], "BD_OP_JOB_OVER_CHECK_POLL");
        let alarmPollList = OpTaskDetailDialog.getRelationModel(alarmData[0], "BD_ALARM_POLL_OVER");
        childList.forEach((item, index) => {
            let resultStatus = item.RESULT_STATUS;
            if (resultStatus !== "0") {
                item.RESULT_STATUS_DESC = "√";
            }
        });
        alarmPollList.forEach((item, index) => {
            let limitDown = item.LIMIT_DOWM;
            let limitUp = item.LIMIT_UP;
            item.ALARM_RANGE = limitDown + " - " + limitUp;
        });
        const alarmColumns = [
            {
                title: "因子",
                dataIndex: "POLL_CODE_DESC",
                key: "POLL_CODE_DESC"
                // className: styles.unitHeader,
            },
            {
                title: "测量值",
                dataIndex: "ALARM_VALUE",
                key: "ALARM_VALUE"
                // className: styles.unitHeader,
            },
            {
                title: "排放标准",
                dataIndex: "ALARM_RANGE",
                key: "ALARM_RANGE"
                // className: styles.unitHeader,
            }];

        const handleColumns = [
            {
                title: "因子",
                dataIndex: "POLL_CODE_DESC",
                key: "POLL_CODE_DESC"
                // className: styles.unitHeader,
            },
            {
                title: "是否超标",
                dataIndex: "RESULT_STATUS_DESC",
                key: "RESULT_STATUS_DESC"
                // className: styles.unitHeader,
            }];
        const layout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
            style: {width: "100%"},
            colon: true
        };
        return (
            <React.Fragment>
                <div className={styles.title}>超标信息</div>
                <Row>
                    <Col span={11}>
                        <Form.Item
                            {...layout}
                            label="超标时间"
                        >
                            {alarmData && alarmData[0] && alarmData[0].ALARM_TIME}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <Form.Item
                            labelCol={{span: 4}}
                            wrapperCol={{span: 20}}
                            style={{width: "100%"}}
                            colon
                            label="超标信息"
                        >
                            <Table
                                style={{width: 300}}
                                pagination={false}
                                bordered
                                rowKey={record => record.ID}
                                dataSource={toJS(alarmPollList)}
                                columns={alarmColumns}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Divider
                    type="horizontal"
                />

                <div className={styles.title}>判别结果</div>
                <Row>
                    <Col span={22}>
                        <Form.Item
                            labelCol={{span: 4}}
                            wrapperCol={{span: 20}}
                            style={{width: "100%"}}
                            colon
                            label="判别结果"
                        >
                            <Table
                                style={{width: 300}}
                                pagination={false}
                                bordered
                                rowKey={record => record.ID}
                                dataSource={toJS(childList)}
                                columns={handleColumns}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }

    static getRelationModel(data, tableName) {
        if (data && data.relationModelMap) {
            let model = data.relationModelMap[tableName];
            if (model) {
                return model;
            }
        }
        return [];
    }

    render() {
        const {onCloseClick, state} = this.props;
        const {visible, taskData, detailData, photoData, positionData, alarmData, previewPhoto} = state;
        return (
            <Dialog
                title={taskData.JOB_ID_DESC + "详情"}
                okText="确定"
                cancelText="取消"
                width={750}
                destroyOnClose
                maskClosable={false}
                visible={visible}
                onOk={onCloseClick}
                onCancel={onCloseClick}
                confirmLoading={false}
            >
                <Form layout="inline">
                    <TaskBasicDetail taskModel={toJS(taskData)}/>
                    <Divider type="horizontal"/>
                    {
                        (() => {
                            switch (taskData.JOB_TYPE) {
                                case "emergency":
                                    return OpTaskDetailDialog.renderEmergency(detailData);
                                case "fault":
                                    return <FaultDetail taskModel={toJS(taskData)}/>;
                                case "supplies":
                                    return <SuppliesDetail data={detailData}/>;
                                case "inspect":
                                    return <InspectDetail taskModel={toJS(taskData)}/>;
                                case "adjustweek":
                                    return <WeekAdjustDetail taskModel={toJS(taskData)}/>;
                                case "overcheck":
                                    return OpTaskDetailDialog.renderOverCheck(detailData, alarmData);
                                case "verifymonth":
                                    return OpTaskDetailDialog.renderVerifyMonth(detailData);
                                case "verifyquarter":
                                    return OpTaskDetailDialog.renderVerifyQuarter(detailData);
                                default:
                                    return null;
                            }
                        })()
                    }
                    <Divider type="horizontal"/>
                    <TaskPhotoDetail taskModel={toJS(taskData)}/>
                </Form>
            </Dialog>
        );
    }
}


