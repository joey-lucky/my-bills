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

    renderForm() {
        return (
            <React.Fragment>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="姓名"
                            name={"name"}
                            rules={[{required: true}]}
                        >
                            <Input style={{width: 200}}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="账号"
                            name={"loginName"}
                            rules={[{required: true}]}
                        >
                            <Input style={{width: 200}}/>
                        </Form.Item>
                    </Col>

                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="企业微信"
                            name={"bussWX"}
                        >
                            <Input style={{width: 200}}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="密码"
                            name={"loginPassword"}
                            rules={[{required: true}]}
                        >
                            <Input
                                type='password'
                                style={{width: 200}}
                                autoComplete={"new-password"}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

