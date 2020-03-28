import FormDialog from "@components/common/FormDialog";
import {Ajax} from "@utils/ajax";
import {Form, Input, Modal, Row} from "antd";
import React from "react";
import {authStore} from "@stores";

const FormItem = Form.Item;

export default class PasswordDialog extends FormDialog {
    static defaultProps = {
        title: "修改密码",
        width: 650,
        actionURL: "/common/pc/systemmanager/usersafe/user/update",
    };

    onOkClick() {
        let me = this;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let obj = {ID: this.props.state.data.USER_ID, PASSWORD: values.PASSWORD};
                Ajax.apiPost("/common/pc/systemmanager/usersafe/user/update", obj).then((d) => {
                    Modal.success({
                        title: "提示",
                        content: "修改密码成功,请重新登陆系统！",
                        okText: "确定",
                        onOk: function () {
                            authStore.asyncLoginOut();
                        }
                    });
                    me.props.state.visible = false;
                });
            }
        });
    }
    renderForm() {
        return (
            <Row>
                <FormItem
                    name={"PASSWORD"}
                    rules={[{required: true, message: "必填"}]}
                    label="新密码"
                >
                    <Input />
                </FormItem>
            </Row>
        );
    }
}
