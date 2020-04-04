import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Input, Row} from "antd";
import FormDialog from "@components/FormDialog";
import ImageUpload from "@components/ImageUpload";
import DomainSelect from "@components/DomainSelect";
import TableSelect from "@components/TableSelect";
import TableTreeSelect from "@components/TableTreeSelect";
import {observable} from "mobx";

@observer
export default class EditDialog extends FormDialog {
    static propTypes = FormDialog.propTypes;

    static defaultProps = {
        width: 650,
        labelCol: {span: 6},
        wrapperCol: {span: 18}
    };

    @observable appState = {
        orgId: ""
    };

    onFieldsChange(changedFields = [], allFields) {
        for (let changeField of changedFields) {
            if (changeField.name === "ORG_ID") {
                this.setFieldsValue({"POSITION_ID": ""});
                this.appState.orgId = changeField.value;
                break;
            }
        }
    }

    renderForm() {
        return (
            <React.Fragment>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="账号"
                            name={"ACCOUNT"}
                            rules={[{required: true}]}
                        >
                            <Input style={{width: 200}}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="密码"
                            name={"PASSWORD"}
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
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="姓名"
                            name={"REAL_NAME"}
                            rules={[{required: true}]}
                        >
                            <Input style={{width: 200}}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="电话"
                            name={"TEL"}
                        >
                            <Input style={{width: 200}}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label={"组织机构"}
                            name={"ORG_ID"}
                        >
                            <TableTreeSelect
                                url={"/common/pc/systemmanager/usersafe/org/list"}
                                parse={{id: "ID", name: "NAME"}}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="企业微信"
                            name={"ENT_WECHAT_ID"}
                        >
                            <Input style={{width: 200}}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="用户类型"
                            name={"USER_TYPE"}
                        >
                            <DomainSelect
                                dictTypeCode="C_USER_TYPE"
                                width="100%"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="岗位"
                            name={"POSITION_ID"}
                        >
                            <TableSelect
                                placeholder="选择岗位"
                                url={"/common/pc/systemmanager/usersafe/org/position/list-model"}
                                parse={{id: "ID", name: "NAME"}}
                                params={{ORG_ID: this.appState.orgId}}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    label="照片"
                    name={"PHOTO"}
                    labelCol={{span: 3}}
                    wrapperCol={{span: 21}}
                >
                    <ImageUpload/>
                </Form.Item>
            </React.Fragment>
        );
    }
}

