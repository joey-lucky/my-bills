import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Input, Row} from "antd";
import {FormDialog, RemoteTreeSelect} from "@components";
import {dictDataAPI} from "@services/index";

@observer
export default class EditDialog extends FormDialog {
    static propTypes = FormDialog.propTypes;

    static defaultProps = {
        width: 650,
        labelCol: {span: 6},
        wrapperCol: {span: 18}
    };

    beforeSubmit(values) {
        if (!values.typeCode) {
            values.typeCode = this.getPropsTypeCode();
        }
        return values;
    }

    getPropsTypeCode(){
        return this.props.typeCode;
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
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="值"
                            name={"value"}
                            rules={[{required: true}]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="排序"
                            name={"order"}
                            rules={[{required: true}]}
                        >
                            <Input type={"number"}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="父级"
                            name={"parentId"}
                        >
                            <RemoteTreeSelect
                                loadData={dictDataAPI.index}
                                params={{typeCode:this.getPropsTypeCode()}}
                                parse={{id:"id",name:"value"}}
                                allowClear={true}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

