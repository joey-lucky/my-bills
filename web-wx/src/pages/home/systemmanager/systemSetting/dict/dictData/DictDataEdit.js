import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Input, Row} from "antd";
import {FormDialog, FormDialogState} from "@components/FormDialog";

const FormItem = Form.Item;

class DictDataEditState extends FormDialogState {

}

@Form.create()
@observer
export default class DictDataEdit extends FormDialog {

    constructor(props) {
        super(props);
        this.actionURL = "/systemmanager/systemsetting/dict/data/update";
    }

    static newState() {
        return new DictDataEditState();
    }

    onSubmitSuccess(msg) {
        this.props.onEdited(this.props.state.data.DICT_TYPE_CODE);
        alert("修改成功");
    }

    renderForm() {
        const {getFieldDecorator} = this.props.form;
        let codeFiled = getFieldDecorator("CODE", {
            initialValue: this.props.state.data.CODE,
            rules: [{required: true, message: "代码不能为空"}]
        })(<Input/>);
        let valueFiled = getFieldDecorator("VALUE", {
            initialValue: this.props.state.data.VALUE,
            rules: [{required: true, message: "值不能为空"}]
        })(<Input/>);
        let unitFiled = getFieldDecorator("UNIT", {
            initialValue: this.props.state.data.UNIT,
            rules: [{required: true, message: "值不能为空"}]
        })(<Input/>);
        let orderFiled = getFieldDecorator("ORDER_CODE", {
            initialValue: this.props.state.data.ORDER_CODE,
            rules: [{required: true, message: "值不能为空"}]
        })(<Input/>);

        let labelSpan = {
            xs: {span: 10}
        };
        let fieldSpan = {
            xs: {span: 14}
        };

        return (
            <Form layout="inline">
                <Row>
                    <Col span={12}>
                        <FormItem label="代码" labelCol={labelSpan} wrapperCol={fieldSpan}>
                            {codeFiled}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="值" labelCol={labelSpan} wrapperCol={fieldSpan}>
                            {valueFiled}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label="单位" labelCol={labelSpan} wrapperCol={fieldSpan}>
                            {unitFiled}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="排序" labelCol={labelSpan} wrapperCol={fieldSpan}>
                            {orderFiled}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

