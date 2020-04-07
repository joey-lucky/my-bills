import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Input, Row} from "antd";
import {FormDialog, RemoteSelect} from "@components";
import {cardAPI, cardTypeAPI, userAPI} from "@services";

@observer
export default class EditDialog extends FormDialog {
    static propTypes = FormDialog.propTypes;

    static defaultProps = {
        width: 650,
        labelCol: {span: 6},
        wrapperCol: {span: 18}
    };

    beforeSubmit(values){
        if (!values.balance) {
            values.balance = 0;
        }
        return values;
    }

    renderForm() {
        return (
            <React.Fragment>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="名称"
                            name={"name"}
                            rules={[{required: true}]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="用户"
                            name={"userId"}
                            rules={[{required: true}]}
                        >
                            <RemoteSelect loadData={userAPI.index}/>
                        </Form.Item>
                    </Col>

                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="类型"
                            name={"cardTypeId"}
                            rules={[{required: true}]}
                        >
                            <RemoteSelect loadData={cardTypeAPI.index}/>
                        </Form.Item>
                    </Col>

                </Row>
            </React.Fragment>
        );
    }
}

