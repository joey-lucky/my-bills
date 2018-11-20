import React from "react";
import {observer} from "mobx-react";
import {Form} from "antd";
import {DetailDialog, DetailDialogState} from "../../../component/DetailDialog";

const FormItem = Form.Item;

class OrgState extends DetailDialogState {
}

@observer
export default class OrgDetail extends DetailDialog {
    static newState() {
        return new OrgState();
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
                <FormItem label="组织机构名称" labelCol={labelSpan} wrapperCol={fieldSpan}>
                    {this.props.state.data.NAME}
                </FormItem>
                <FormItem label="组织机构描述" labelCol={labelSpan} wrapperCol={fieldSpan}>
                    {this.props.state.data.DESCRIBE}
                </FormItem>
            </Form>
        );
    }

}
