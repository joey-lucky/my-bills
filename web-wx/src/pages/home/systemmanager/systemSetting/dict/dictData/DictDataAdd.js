import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Input, Row} from "antd";
import {FormDialog, FormDialogState} from "@components/FormDialog";

const FormItem = Form.Item;

class DictDataAddState extends FormDialogState {

}

@Form.create()
@observer
export default class DictDataAdd extends FormDialog {
    constructor(props) {
        super(props);
        this.actionURL = "/systemmanager/systemsetting/dict/data/create";
    }

    static newState() {
        return new DictDataAddState();
    }

    onSubmitSuccess(msg) {
        this.props.onAdded(this.props.state.data.DICT_TYPE_CODE);
        alert("新建成功");
    }

    renderForm() {
        const {getFieldDecorator} = this.props.form;
        var codeFiled = getFieldDecorator("CODE", {rules: [{required: true, message: "代码不能为空"}]})(<Input/>);
        var valueFiled = getFieldDecorator("VALUE", {rules: [{required: true, message: "值不能为空"}]})(<Input/>);
        var unitFiled = getFieldDecorator("UNIT", {rules: [{required: true, message: "值不能为空"}]})(<Input/>);
        var orderFiled = getFieldDecorator("ORDER_CODE", {rules: [{required: true, message: "值不能为空"}]})(<Input/>);

        var labelSpan = {
            xs: {span: 10}
        };
        var fieldSpan = {
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
