import React from "react";
import {observer} from "mobx-react";
import {Button, Col, DatePicker, Form, Input, Modal, Radio, Row, Select} from "antd";
import PropTypes from "prop-types";
import {observable, toJS} from "mobx";
import DomainSelect from "@components/DomainSelect";
import {Ajax} from "@utils/ajax";
import UsTransfer from "@components/UsTransfer";
import * as style from "./TaskPlanEditDialog.css";
import FormUtils from "@utils/FormUtils";

class AppState {
    @observable visible = false;
    @observable siteList = [];
    @observable jobList = [];
    @observable contractList = [];
    @observable data = {};
    @observable step = 1;

    formDefaultValue = {
        PLAN_STATUS: "1",
        TASK_CYCLE: "",
        START_TIME: FormUtils.getCurrDateTimeStr(),
        END_TIME: FormUtils.getCurrDateTimeStr(),
        SITE_ID: []
    };

    show(data = {}) {
        this.data = FormUtils.concatInitialValue(data, this.formDefaultValue);
        this.visible = true;
        this.step = 1;
        this.loadModelData();
        this.loadSiteData();
        this.loadJobData();
        this.loadContractsData();
    }

    hide() {
        this.visible = false;
    }

    loadModelData() {
        if (this.data.ID) {
            Ajax.apiPost("/op/taskmanager/optaskplan/get-model", {"ID": this.data.ID})
                .then((d) => {
                    let modelData = d.data[0];
                    let siteList = modelData.relationModelMap.BC_OP_TASK_PLAN_SITE || [];
                    this.data.SITE_ID = siteList.map(item => item.SITE_ID);
                });
        }
    }

    loadSiteData = () => {
        this.siteList = [];
        let DL_AREACODE = this.data.DL_AREACODE;
        let CONTRACT_ID = this.data.CONTRACT_ID;

        if (!CONTRACT_ID) {
            CONTRACT_ID = "null";
        }
        Ajax.apiPost("/systemmanager/ent/setting/site/list", {DL_AREACODE, CONTRACT_ID})
            .then((d) => {
                let data = d.data || [];
                this.siteList = data.map((item) => {// 增加key字段
                    item.key = item.ID;
                    return item;
                });
            });
    };

    loadJobData = () => {
        this.jobList = [];
        Ajax.apiPost("/op/taskmanager/optaskplan/get-add-plan-job-list", {CONTRACT_ID: this.data.CONTRACT_ID})
            .then((d) => {
                this.jobList = d.data || [];
            });
    };

    loadContractsData = () => {
        this.contractList = [];
        Ajax.apiPost("/systemmanager/operation/contract/list-model")
            .then((d) => {
                this.contractList = d.data || [];
            });
    };

    onDlAreaCodeSelect = (value) => {
        this.data.DL_AREACODE = value === "NULL" ? "" : value;
        this.data.SITE_ID = [];
        this.loadSiteData();
    };

    onContractChange = (value) => {
        this.data.CONTRACT_ID = value;
        this.loadJobData();
        this.loadSiteData();
    };
}

@Form.create()
@observer
export default class TaskPlanEditDialog extends React.Component {
    static propTypes = {
        state: PropTypes.any,
        form: PropTypes.any,
        onSubmitSuccess: PropTypes.any,
        actionURL: PropTypes.any,
        dialogTitle: PropTypes.any
    };

    static newState() {
        return new AppState();
    }

    constructor(props) {
        super(props);
        this.dialogWidth = 750;
    }

    // 装饰器
    getFieldDecorator = (id, options = {}) => {
        const {state, form} = this.props;
        let initValue = state.data[id];
        if (id === "START_TIME" || id === "END_TIME") {
            options.initialValue = FormUtils.getDateTimeInitValue(initValue);
        } else {
            options.initialValue = initValue;
        }
        return form.getFieldDecorator(id, options);
    };

    onBussCategorySelect = (value) => {
        const {state} = this.props;
        state.onBussCategorySelect(value);
    };

    onDlAreaCodeSelect = (value) => {
        this.props.state.onDlAreaCodeSelect(value);
    };

    onSiteSelect = (value) => {
        const {state} = this.props;
        state.onSiteSelect(value);
    };

    onCancelClick = () => {
        const {state} = this.props;
        state.visible = false;
    };

    onSubmitClick = () => {
        const {state, onSubmitSuccess, form, actionURL} = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                let siteIds = values.SITE_ID;
                values.SITE_ID = undefined;
                let planSites = siteIds.map(item => ({
                    SITE_ID: item
                }));

                let data = {
                    ...values,
                    ID: state.data.ID,
                    START_TIME: values.START_TIME.format("YYYY-MM-DD") + " 00:00:00",
                    END_TIME: values.END_TIME.format("YYYY-MM-DD") + " 23:59:59",
                    PLAN_STATUS: "0",
                    relationModelMap: {
                        BC_OP_TASK_PLAN_SITE: planSites
                    }
                };

                Ajax.apiPost(actionURL, data)
                    .then((d) => {
                        state.hide();
                        onSubmitSuccess && onSubmitSuccess();
                    });
            }
        });
    };

    onNextStepClick = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {state} = this.props;
                state.step = 2;
                console.log("xxx");
            } else {
                console.log(err);
            }
        });
    };

    onPreviousStepClick = () => {
        const {state} = this.props;
        state.step = 1;
    };

    renderStep1 = () => {
        const {state} = this.props;
        const {step} = state;
        const siteList = toJS(state.siteList);
        const fillWidth = {
            style: {width: "100%"}
        };
        const formItemLayout = {
            style: {width: "100%"},
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        return (
            <div
                className={style.step1Container}
                style={{display: step === 1 ? "block" : "none"}}
            >
                <Row>
                    <Col>
                        <Form.Item
                            style={{width: "100%"}}
                            labelCol={{span: 4}}
                            wrapperCol={{span: 20}}
                            label="计划名称"
                        >
                            {this.getFieldDecorator("NAME", {rules: [{required: true, message: "请输入计划名称!"}]})(
                                <Input/>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <Form.Item
                            {...formItemLayout}
                            label="所属合同"
                        >
                            {this.getFieldDecorator("CONTRACT_ID", {rules: [{required: true, message: "请选择合同!"}]})(
                                <Select
                                    showSearch
                                    onSelect={state.onContractChange}
                                >
                                    {
                                        state.contractList.map((item, index) =>
                                            <Select.Option
                                                key={item.ID}
                                            >{item.NAME}</Select.Option>
                                        )
                                    }
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={11} offset={2}>
                        <Form.Item
                            {...formItemLayout}
                            label="行政区划"
                        >
                            {this.getFieldDecorator("DL_AREACODE")(
                                <DomainSelect
                                    {...fillWidth}
                                    dictTypeCode="PROVINCE"
                                    parentCode="001002"
                                    emptyLabel="深圳市"
                                    onSelect={state.onDlAreaCodeSelect}
                                />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <div
                    className={style.centerH}
                    style={{marginTop: 20}}
                >
                    <Form.Item
                        style={{width: "100%"}}
                        labelCol={{span: 0}}
                        wrapperCol={{span: 24}}
                        label=""
                    >
                        {this.getFieldDecorator("SITE_ID", {
                            rules: [{
                                required: true,
                                message: "请选择站点!",
                                type: "array"
                            }]
                        })(
                            <UsTransfer
                                dataSource={siteList}
                            />
                        )}
                    </Form.Item>
                </div>
            </div>
        );
    };

    renderStep2 = () => {
        const {state} = this.props;
        const {step} = state;
        const fillWidth = {
            style: {width: "100%"}
        };
        const formItemLayout = {
            style: {width: "100%"},
            labelCol: {span: 5},
            wrapperCol: {span: 19}
        };
        return (
            <div
                className={style.step2Container}
                style={{display: step === 2 ? "flex" : "none"}}
            >
                <Form.Item
                    {...formItemLayout}
                    label="运维项"
                >
                    {this.getFieldDecorator("JOB_ID", {rules: [{required: true, message: "请选择运维项!"}]})(
                        <Radio.Group>
                            {
                                state.jobList.map((item, index) =>
                                    <Radio
                                        key={item.ID}
                                        value={item.ID}
                                    >{item.NAME}</Radio>
                                )
                            }
                        </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="计划开始日期"
                >
                    {this.getFieldDecorator("START_TIME")(
                        <DatePicker
                            {...fillWidth}
                            placeholder="请选择时间"
                        />
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="计划截止时间"
                >
                    {this.getFieldDecorator("END_TIME")(
                        <DatePicker
                            {...fillWidth}
                            placeholder="请选择时间"
                        />
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="任务周期"
                >
                    {this.getFieldDecorator("TASK_CYCLE", {rules: [{required: true, message: "请选择任务周期!"}]})(
                        <DomainSelect
                            width="100%"
                            dictTypeCode="TASK_PLAN_TIME_CYCLE"
                        />
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="备注"
                >
                    {this.getFieldDecorator("REMARK")(
                        <Input.TextArea
                            {...fillWidth}
                            rows={4}
                        />
                    )}
                </Form.Item>

            </div>
        );
    };

    getFooterNode(step) {
        if (step === 1) {
            return [
                <Button
                    key="cancel"
                    onClick={this.onCancelClick}
                >取消</Button>,
                <Button
                    key="next"
                    type="primary"
                    onClick={this.onNextStepClick}
                >下一步</Button>
            ];
        } else if (step === 2) {
            return [
                <Button
                    key="previous"
                    type="primary"
                    onClick={this.onPreviousStepClick}
                >上一步</Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={this.onSubmitClick}
                >提交</Button>,
                <Button
                    key="cancel"
                    onClick={this.onCancelClick}
                >取消</Button>
            ];
        }
    }

    render() {
        const {state, dialogTitle} = this.props;
        const {step, visible} = state;

        this.getFooterNode(1);
        return (
            <Modal
                title={dialogTitle}
                width={750}
                style={{top: 20}}
                closable={false}
                destroyOnClose
                mask
                maskClosable={false}
                visible={visible}
                oncancel={this.onCancelClick}
                footer={this.getFooterNode(step)}
            >
                <Form layout="inline" style={{width: "100%"}}>
                    {
                        this.renderStep1()
                    }
                    {
                        step === 2 && this.renderStep2()
                    }
                </Form>
            </Modal>
        );
    }
}
