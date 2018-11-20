import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Input, Row} from "antd";
import * as PropTypes from "prop-types";
import {FormDialog, FormDialogState} from "./FormDialog";

/**
 * 简单的新增对话框
 */
class AppState extends FormDialogState {
    show(record){
        this.data = record;
        this.visible = true;
    }
}

/**
 * 强制：表单界面都要有@Form.create()装饰
 */
@Form.create()
@observer
export default class DemoUpdateDialog extends FormDialog {
    // propTypes是必须的，用于定义组件的props
    static propTypes = {
        form: PropTypes.object.any,
        state: PropTypes.object.any
    };

    static newState() {
        return new AppState();
    }

    renderForm() {
        const {form} = this.props;
        return (
            <Form layout="inline">
                <Row>
                    <Col span={12}>
                        <Form.Item label="代码">
                            {
                                form.getFieldDecorator("CODE", {rules: [{required: true, message: "代码不能为空"}]})(
                                    <Input />
                                )
                            }
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="值">
                            {
                                form.getFieldDecorator("VALUE", {rules: [{required: true, message: "值不能为空"}]})(
                                    <Input />
                                )
                            }
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}
