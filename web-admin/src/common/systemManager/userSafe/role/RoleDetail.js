import React from "react";
import {observer} from "mobx-react";
import {Form} from "antd";
import {DetailDialog, DetailDialogState} from "../../../component/DetailDialog";

const FormItem = Form.Item;

class RoleState extends DetailDialogState {
}

@observer
export default class RoleDetail extends DetailDialog {

    constructor(props) {
        super(props);
        this.dialogTitle = "角色详情";
    }

    static newState() {
        return new RoleState();
    }

    renderDetail() {
        var labelSpan = {
            span: 6
        };
        var fieldSpan = {
            span: 18
        };

        return (
            <Form>
                <FormItem label="角色名称" labelCol={labelSpan} wrapperCol={fieldSpan}>
                    {this.props.state.data.NAME}
                </FormItem>
                <FormItem label="角色描述" labelCol={labelSpan} wrapperCol={fieldSpan}>
                    {this.props.state.data.DESCRIBE}
                </FormItem>
            </Form>
        );
    }

}
