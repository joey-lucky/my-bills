import React from "react";
import {observer} from "mobx-react";
import {Form, Input} from "antd";
import {FormDialog, FormDialogState} from "../../../component/FormDialog";

const FormItem = Form.Item;

class RoleState extends FormDialogState {
}

@observer
class RoleAdd extends FormDialog {

    constructor(props) {
        super(props);
        this.actionURL = "/systemmanager/usersafe/role/create";
        this.dialogWidth = 650;
        this.dialogTitle = "新建角色";
    }

    static newState() {
        return new RoleState();
    }

    onSubmitSuccess(msg) {
        this.props.onAdded();
    }

    renderForm() {
        const {getFieldDecorator} = this.props.form;
        var descFiled = getFieldDecorator("DESCRIBE")(<Input style={{width: 200}}/>);
        var nameFiled = getFieldDecorator("NAME", {rules: [{required: true, message: "名称不能为空"}]})(<Input
            style={{width: 200}}
        />);

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

export default Form.create()(RoleAdd);
