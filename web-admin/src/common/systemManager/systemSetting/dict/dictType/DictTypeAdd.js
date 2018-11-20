import React from "react";
import {observer} from "mobx-react";
import {Form, Input} from "antd";
import {FormDialog, FormDialogState} from "../../../../component/FormDialog";

const FormItem = Form.Item;

class DictTypeAddState extends FormDialogState {

}

@Form.create()
@observer
export default class DictTypeAdd extends FormDialog {

    constructor(props) {
        super(props);
        this.actionURL = "/systemmanager/systemsetting/dict/type/create";
    }

    static newState() {
        return new DictTypeAddState();
    }

    onSubmitSuccess(msg) {
        this.props.onAdded();
        alert("新建成功");
    }

    renderForm() {
        const {getFieldDecorator} = this.props.form;
        var codeFiled = getFieldDecorator("CODE", {rules: [{required: true, message: "字典代码不能为空"}]})(<Input/>);
        var nameFiled = getFieldDecorator("NAME", {rules: [{required: true, message: "字典名称不能为空"}]})(<Input/>);

        return (
            <Form layout="inline">
                <FormItem label="字典代码">
                    {codeFiled}
                </FormItem>
                <FormItem label="字典名称">
                    {nameFiled}
                </FormItem>
            </Form>
        );
    }

}

