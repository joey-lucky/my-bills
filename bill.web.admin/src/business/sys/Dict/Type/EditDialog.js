import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Input, Row} from "antd";
import {FormDialog} from "@components";

@observer
export default class EditDialog extends FormDialog {
    static propTypes = FormDialog.propTypes;

    static defaultProps = {
        width: 650,
        labelCol: {span: 6},
        wrapperCol: {span: 18}
    };

    beforeShow(values = {}) {
        if (!values.pic) {
            values.pic = "无";
        }
        return values;
    }

    renderForm() {
        return (
            <React.Fragment>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="编码"
                            name={"code"}
                            rules={[{required: true}]}
                        >
                            <Input style={{width: 200}}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="值"
                            name={"value"}
                            rules={[{required: true}]}
                        >
                            <Input style={{width: 200}}/>
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

