import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Input, Row} from "antd";
import {FormDialog, FormDialogState} from "@components/FormDialog";
import UrlTransfer from "./UrlTransfer";

const FormItem = Form.Item;

class FunctionEditState extends FormDialogState {

}

@observer
class FunctionEdit extends FormDialog {

    constructor(props) {
        super(props);
        this.dialogWidth = 950;
        this.actionURL = "/systemmanager/usersafe/function/update";
    }

    static newState() {
        return new FunctionEditState();
    }

    onSubmitSuccess(msg) {
        this.props.onEdited();
    }

    renderForm() {
        const {getFieldDecorator} = this.props.form;
        var codeFiled = getFieldDecorator("CODE", {
            initialValue: this.props.state.data.CODE,
            rules: [{required: true, message: "功能代码不能为空"}]
        })(<Input style={{width: 200}}/>);
        var nameFiled = getFieldDecorator("NAME", {
            initialValue: this.props.state.data.NAME,
            rules: [{required: true, message: "功能名称不能为空"}]
        })(<Input style={{width: 200}}/>);
        var urlField = getFieldDecorator("URL_LIST", {initialValue: this.props.state.data.URL_LIST})(<UrlTransfer/>);

        var labelSpan = {
            span: 6
        };
        var fieldSpan = {
            span: 18
        };

        return (
            <Form>
                <Row>
                    <Col span={12}>
                        <FormItem label="功能代码" labelCol={labelSpan} wrapperCol={fieldSpan}>
                            {codeFiled}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="功能名称" labelCol={labelSpan} wrapperCol={fieldSpan}>
                            {nameFiled}
                        </FormItem>
                    </Col>
                </Row>
                <FormItem label="功能地址" labelCol={{span: 3}} wrapperCol={{span: 21}}>
                    {urlField}
                </FormItem>
            </Form>
        );
    }

}

const FunctionEditForm = Form.create()(FunctionEdit);

export default FunctionEditForm;
