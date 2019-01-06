import React from "react";
import {observer} from "mobx-react";
import {Col, Form, Input, Row} from "antd";
import {FormDialog, FormDialogState} from "@components/FormDialog";
import ImageUpload from "@components/ImageUpload";
import OrgSelect from "./OrgSelect";

const FormItem = Form.Item;

class UserState extends FormDialogState {
}

@observer
class UserEdit extends FormDialog {

    constructor(props) {
        super(props);
        this.actionURL = "/systemmanager/usersafe/user/update";
        this.dialogWidth = 650;
        this.dialogTitle = "编辑";
    }

    static newState() {
        return new UserState();
    }

    onSubmitSuccess(msg) {
        this.props.onEdited();
    }

    renderForm() {

        const {getFieldDecorator} = this.props.form;
        var accountFiled = getFieldDecorator("ACCOUNT", {
            initialValue: this.props.state.data.ACCOUNT,
            rules: [{required: true, message: "账号不能为空"}]
        })(<Input style={{width: 200}}/>);
        var passwordFiled = getFieldDecorator("PASSWORD", {
            initialValue: this.props.state.data.PASSWORD,
            rules: [{required: true, message: "密码不能为空"}]
        })(<Input type='password' style={{width: 200}}/>);
        var realNameFiled = getFieldDecorator("REAL_NAME", {
            initialValue: this.props.state.data.REAL_NAME,
            rules: [{required: true, message: "姓名不能为空"}]
        })(<Input style={{width: 200}}/>);
        var telFiled = getFieldDecorator("TEL", {initialValue: this.props.state.data.TEL})(<Input
            style={{width: 200}}
        />);
        var entWechatIdFiled = getFieldDecorator("ENT_WECHAT_ID", {initialValue: this.props.state.data.ENT_WECHAT_ID})(
            <Input style={{width: 200}}/>);
        var orgFiled = getFieldDecorator("ORG_ID", {initialValue: this.props.state.data.ORG_ID})(<OrgSelect/>);
        var photoFiled = getFieldDecorator("PHOTO", {initialValue: this.props.state.data.PHOTO})(<ImageUpload/>);

        var labelSpan = {
            span: 6
        };
        var fieldSpan = {
            span: 18
        };

        return (
            <Form>
                <Row>
                    <Col span={12}>
                        <FormItem label="账号" labelCol={labelSpan} wrapperCol={fieldSpan}>
                            {accountFiled}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="密码" labelCol={labelSpan} wrapperCol={fieldSpan}>
                            {passwordFiled}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label="姓名" labelCol={labelSpan} wrapperCol={fieldSpan}>
                            {realNameFiled}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="电话" labelCol={labelSpan} wrapperCol={fieldSpan}>
                            {telFiled}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label="组织机构" labelCol={labelSpan} wrapperCol={fieldSpan}>
                            {orgFiled}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="企业微信" labelCol={labelSpan} wrapperCol={fieldSpan}>
                            {entWechatIdFiled}
                        </FormItem>
                    </Col>
                </Row>
                <FormItem label="照片" labelCol={{span: 3}} wrapperCol={{span: 21}}>
                    {photoFiled}
                </FormItem>
            </Form>
        );
    }

}

export default Form.create()(UserEdit);
