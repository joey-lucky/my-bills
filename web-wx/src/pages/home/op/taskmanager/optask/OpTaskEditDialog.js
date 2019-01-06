import React from "react";
import {observer} from "mobx-react";
import {Col, DatePicker, Form, Input, Row} from "antd";
import PropTypes from "prop-types";
import {observable} from "mobx";
import moment from "moment";
import {FormDialog, FormDialogState} from "@components/FormDialog";
import TableSelect from "@components/TableSelect"

// 默认左右两边的form item
const FormItem = ({label = "", children, labelCol = {span: 8}, wrapperCol = {span: 16}}) => (
    <Form.Item
        label={label}
        style={{width: "100%"}}
        colon
        labelCol={labelCol}
        wrapperCol={wrapperCol}
    >
        {children}
    </Form.Item>
);
FormItem.propTypes = {
    label: PropTypes.any,
    children: PropTypes.any,
    labelCol: PropTypes.any,
    wrapperCol: PropTypes.any
};

class AppState extends FormDialogState {
    @observable siteList = [];
    @observable jobList = [];
    @observable contractList = [];
    @observable data = {
        CONTRACT_ID: "",
        GROUP_ID: ""
    };
}

@Form.create()
@observer
export default class OpTaskEditDialog extends FormDialog {
    constructor(props) {
        super(props);
        this.dialogWidth = 750;
    }

    static newState() {
        return new AppState();
    }

    // 装饰器
    getFieldDecorator = (id, options = {}) => {
        const {state, form} = this.props;
        if (id === "DEADLINE_TIME") {
            options.initialValue = moment(state.data.DEADLINE_TIME);
        } else if (id === "START_TIME") {
            options.initialValue = moment(state.data.START_TIME);
        } else {
            options.initialValue = state.data[id];
        }
        return form.getFieldDecorator(id, options);
    };

    beforeSubmit(values) {
        values.DEADLINE_TIME = values.DEADLINE_TIME.format("YYYY-MM-DD hh:mm:ss");
        values.TASK_STATUS = "0";
        values.START_TIME = moment().format("YYYY-MM-DD hh:mm:ss");
        values.TASK_FROM = "0";
        return values;
    }

    onGroupSelect = (id) => {
        let data = this.props.state.data;
        data.GROUP_ID = id;
    };

    onContractsSelect = (id) => {
        let data = this.props.state.data;
        data.CONTRACT_ID = id;
    };

    renderForm() {
        const {state} = this.props;
        return (
            <Form layout="inline" style={{width: "100%"}}>
                <Row>
                    <Col span={11}>
                        <FormItem
                            style={{width: 300}}
                            label="运维合同"
                        >
                            {this.getFieldDecorator("GROUP_ID")(
                                <TableSelect
                                    onSelect={this.onContractsSelect}
                                    url="/systemmanager/operation/contract/list-model"
                                    parse={{CODE: "ID", VALUE: "NAME"}}
                                    width="100%"
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="任务类型">
                            {this.getFieldDecorator("JOB_ID")(
                                <TableSelect
                                    url="/op/taskmanager/optask/get-add-task-job-list"
                                    parse={{CODE: "ID", VALUE: "NAME"}}
                                    params={{CONTRACT_ID: state.data.CONTRACT_ID}}
                                    width="100%"
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem
                            style={{width: 300}}
                            label="运维组"
                        >
                            {this.getFieldDecorator("GROUP_ID")(
                                <TableSelect
                                    onSelect={this.onGroupSelect}
                                    url="/systemmanager/operation/group/op-group"
                                    parse={{CODE: "ID", VALUE: "NAME"}}
                                    width="100%"
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem
                            style={{width: 300}}
                            label="站点"
                        >
                            {this.getFieldDecorator("SITE_ID")(
                                <TableSelect
                                    url="/systemmanager/ent/setting/site/list"
                                    parse={{CODE: "ID", VALUE: "NAME"}}
                                    params={{GROUP_ID: state.data.GROUP_ID, CONTRACT_ID: state.data.CONTRACT_ID}}
                                    width="100%"
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem label="开始时间">
                            {this.getFieldDecorator("START_TIME")(
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    placeholder="请选择时间"
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={11} offset={2}>
                        <FormItem label="截止时间">
                            {this.getFieldDecorator("DEADLINE_TIME")(
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    placeholder="请选择时间"
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <FormItem
                            label="备注"
                            labelCol={{span: 4}}
                            wrapperCol={{span: 20}}
                        >
                            {this.getFieldDecorator("TASK_DESC")(
                                <Input.TextArea
                                    rows={4}
                                    cols={70}
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}
