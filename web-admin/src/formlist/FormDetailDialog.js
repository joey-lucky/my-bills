import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Row} from "antd";
import {observable} from "mobx";
import * as PropTypes from "prop-types";
import {FormDialog, FormDialogState} from "../common/component/FormDialog";

class AppState extends FormDialogState {
    @observable data = {};
}

@observer
export default class FormDetailDialog extends FormDialog {
    static propTypes = {
        form: PropTypes.object.any
    };

    static newState() {
        return new AppState();
    }

    renderForm() {
        let appState = this.props.state;
        let layout = {
            labelCol: {
                xs: {span: 10}
            },
            fieldSpan: {
                xs: {span: 14}
            }
        };
        return (
            <Form layout="inline">
                <Row>
                    <Col span={12}>
                        <Form.Item
                            {...layout}
                            label="代码"
                        >
                            {
                                appState.data.CODE
                            }
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            {...layout}
                            label="值"
                        >
                            {
                                appState.data.VALUE
                            }
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            {...layout}
                            label="单位"
                        >
                            {
                                appState.data.UNIT
                            }
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            {...layout}
                            label="排序"
                        >
                            {
                                appState.data.ORDER_CODE
                            }
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}

