import React from "react";
import {observer} from "mobx-react";
import {Form, Input} from "antd";
import {FormDialog, FormDialogState} from "../../../component/FormDialog";

const FormItem = Form.Item;

class OrgState extends FormDialogState {
}

@observer
class OrgEdit extends FormDialog {

    constructor(props) {
        super(props);
        this.actionURL = "/systemmanager/usersafe/org/update";
    }

    static newState() {
        return new OrgState();
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
                <FormItem label="组织机构名称" labelCol={labelSpan} wrapperCol={fieldSpan}>
                    {nameFiled}
                </FormItem>
                <FormItem label="组织机构描述" labelCol={labelSpan} wrapperCol={fieldSpan}>
                    {descFiled}
                </FormItem>
            </Form>
        );
    }

}

export default Form.create()(OrgEdit);
