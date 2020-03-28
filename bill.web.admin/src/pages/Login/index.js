import {observer} from "mobx-react";
import * as React from "react";
import {Button, Form, Input, Row} from "antd";
import {authStore} from "@stores";

const FormItem = Form.Item;

@observer
export default class Login extends React.Component {

    onFinish = async (values = {}) => {
        const {userName, password} = values;
        let d = await authStore.login(userName, password);
        this.props.history.push("/home");
    };

    onFinishFailed = (err) => {

    };

    render() {
        return (
            <Row
                style={{height: "100%"}}
                justify={"center"}
                align={"middle"}
            >
                <Form
                    wrapperCol={{span: 16}}
                    labelCol={{span: 8}}
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                >
                    <Form.Item
                        label="账号"
                        name="userName"
                        rules={[{required: true}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[{required: true}]}
                    >
                        <Input.Password autoComplete={"new-password"}/>
                    </Form.Item>
                    <Form.Item wrapperCol={{offset: 8, span: 16}}>
                        <Button type="primary" htmlType="submit">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Row>
        );
    }
}
