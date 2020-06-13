import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Input, Row} from "antd";
import {FormDialog, RemoteSelect, RemoteTreeSelect} from "@components";
import {billTypeAPI, dictDataAPI} from "@services/index";

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
                            label="名称"
                            name={"name"}
                            rules={[{required: true}]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="类型"
                            name={"type"}
                            rules={[{required: true}]}
                        >
                            <RemoteSelect
                                loadData={dictDataAPI.index}
                                params={{typeCode: "bill_type"}}
                                parse={{id:"code",name:"value"}}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="排序"
                            name={"sort"}
                            rules={[{required: true}]}
                        >
                            <Input type={"number"}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="类型"
                            name={"parentId"}
                        >
                            <RemoteTreeSelect
                                loadData={billTypeAPI.index}
                                allowClear={true}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

