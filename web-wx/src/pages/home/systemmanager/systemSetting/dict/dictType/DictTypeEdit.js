import React from "react";
import {observer} from "mobx-react";
import {Form, Input} from "antd";
import {FormDialog, FormDialogState} from "@components/FormDialog";

const FormItem = Form.Item;

class DictTypeEditState extends FormDialogState {
    setData(data) {
        this.data = data;
    }
}

@Form.create()
@observer
export default class DictTypeEdit extends FormDialog {

    constructor(props) {
        super(props);
        this.actionURL = "/systemmanager/systemsetting/dict/type/update";
    }

    static newState() {
        return new DictTypeEditState();
    }

    onSubmitSuccess(msg) {
        this.props.onEdited();
        alert("修改成功");
    }

    renderForm() {
        const {getFieldDecorator} = this.props.form;
        var nameFiled = getFieldDecorator("NAME", {
            initialValue: this.props.state.data.NAME,
            rules: [{required: true, message: "字典名称不能为空"}]
        })(<Input/>);

        return (
            <Form layout="inline">
                <FormItem label="字典名称">
                    {nameFiled}
                </FormItem>
            </Form>
        );

    }
}

