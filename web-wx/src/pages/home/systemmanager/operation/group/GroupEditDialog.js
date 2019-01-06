import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Input, Row} from "antd";
import {FormDialog, FormDialogState} from "@components/FormDialog";
import TableSelect from "@components/TableSelect";
import DomainSelect from "@components/DomainSelect";

class AppState extends FormDialogState {

}

@Form.create()
@observer
export default class GroupEditDialog extends FormDialog {
    static newState() {
        return new AppState();
    }

    constructor(props) {
        super(props);
        this.dialogWidth = 650;
    }

    renderForm() {
        const {state, form} = this.props;
        const getFieldDecorator = (id, options = {}) => {
            options.initialValue = state.data[id];
            return form.getFieldDecorator(id, options);
        };
        const layout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
            style: {width: "100%"}
        };
        return (
            <Form layout="inline">
                <Row>
                    <Col span={12}>
                        <Form.Item
                            {...layout}
                            label="运维组名称"
                        >
                            {getFieldDecorator("NAME", {rules: [{required: true, message: "请输入单位名称!"}]})(
                                <Input/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            {...layout}
                            label="所属公司"
                        >
                            {getFieldDecorator("OPMC_ID", {rules: [{required: true, message: "请选择所属公司!"}]})(
                                <TableSelect
                                    url="/systemmanager/operation/company/list"
                                    parse={{CODE: "ID", VALUE: "NAME"}}
                                    width="100%"
                                />
                            )}
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <Form.Item
                            {...layout}
                            label="组类型"
                        >
                            {getFieldDecorator("GROUP_TYPE", {rules: [{required: true, message: "请选择组类型!"}]})(
                                <DomainSelect
                                    dictTypeCode="GROUP_TYPE"
                                    width="100%"
                                />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}
