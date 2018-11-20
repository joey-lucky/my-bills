import React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import moment from "moment";
import * as PropTypes from "prop-types";
import {Col, DatePicker, Form, Input, Row} from "antd";
import {FormDialog, FormDialogState} from "../../../component/FormDialog";

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
    @observable data = {};


    show = () => {
        super.show();
    };

    hide = () => {
        super.hide();
    };
}

@observer
class ContractEdit extends FormDialog {
    constructor(props) {
        super(props);
        this.actionURL = "/systemmanager/operation/contract/update";
        this.dialogWidth = 750;
        this.dialogTitle = "编辑合同";
    }

    static newState() {
        return new AppState();
    }

    beforeSubmit(values) {
        if (values) {
            values.CONTRACT_START_DATE = values.CONTRACT_START_DATE.format("YYYY-MM-DD") + " 00:00:00";
            values.CONTRACT_END_DATE = values.CONTRACT_END_DATE.format("YYYY-MM-DD") + " 00:00:00";
        }
        return values;
    }

    onSubmitSuccess(msg) {
        let onAdded = this.props.onAdded;

        if (onAdded) {
            onAdded();
        }
    }

    renderForm() {
        return (
            <Form layout="inline" style={{width: "100%"}}>
                <Row>
                    <Col span={11}>
                        <FormItem label="合同名称">
                            {this.getFieldDecorator("NAME")(<Input/>)}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem label="合同别名">
                            {this.getFieldDecorator("ALIAS")(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem label="合同编号">
                            {this.getFieldDecorator("CONTRACT_NO")(<Input/>)}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem label="甲方名称">
                            {this.getFieldDecorator("CUSTOMERS_NAME")(<Input/>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <FormItem style={{width: 400}} label="合同开始时间">
                            {this.getFieldDecorator("CONTRACT_START_DATE")(<DatePicker placeholder="请选择时间"/>)}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem style={{width: 400}} label="合同结束时间">
                            {this.getFieldDecorator("CONTRACT_END_DATE")(<DatePicker placeholder="请选择时间"/>)}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }

    getFieldDecorator = (id, options = {}) => {
        const {state, form} = this.props;

        var value = state.data[id];

        if (id === "CONTRACT_START_DATE" || id === "CONTRACT_END_DATE") {
            value = moment(state.data[id], "YYYY-MM-DD");
        }

        options.initialValue = value;
        return form.getFieldDecorator(id, options);
    };
}

export default Form.create()(ContractEdit);
