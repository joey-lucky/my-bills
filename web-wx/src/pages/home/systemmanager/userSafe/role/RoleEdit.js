import React from "react";
import {observer} from "mobx-react";
import {Form, Input} from "antd";
import {FormDialog, FormDialogState} from "@components/FormDialog";

const FormItem = Form.Item;

class RoleState extends FormDialogState {
}

@observer
class RoleEdit extends FormDialog {

    constructor(props) {
        super(props);
        this.actionURL = "/systemmanager/usersafe/role/update";
        this.dialogTitle = "编辑角色";
    }

    static newState() {
        return new RoleState();
    }

    onSubmitSuccess(msg) {
        this.props.onEdited();
    }

    renderForm() {
        const {getFieldDecorator} = this.props.form;
        var descFiled = getFieldDecorator("DESCRIBE", {initialValue: this.props.state.data.DESCRIBE})(<Input
            style={{width: 200}}
        />);
        var nameFiled = getFieldDecorator("NAME", {
            initialValue: this.props.state.data.NAME,
            rules: [{required: true, message: "名称不能为空"}]
        })(<Input style={{width: 200}}/>);

        var labelSpan = {
            span: 6
        };
        var fieldSpan = {
            span: 18
        };

        return (
            <Form>
                <FormItem label="角色名称" labelCol={labelSpan} wrapperCol={fieldSpan}>
                    {nameFiled}
                </FormItem>
                <FormItem label="角色描述" labelCol={labelSpan} wrapperCol={fieldSpan}>
                    {descFiled}
                </FormItem>
            </Form>
        );
    }

}

export default Form.create()(RoleEdit);
