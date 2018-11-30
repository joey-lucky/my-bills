import React from "react";
import {observable} from "mobx";
import {observer} from "mobx-react";
import * as styles from "./LoginPage.css";
import {Button, Form, Icon, Input, Row, Modal} from "antd";
import HttpUtils from "../../services/HttpUtils";

const FormItem = Form.Item;

class AppState {
    @observable data = [];

    asyncLogin(params) {
        return HttpUtils.httpGet("/safe/login", params);
    }
}

@observer
@Form.create()
export default class LoginPage extends React.Component {
    static propTypes = {};
    _appState = new AppState();

    componentDidMount() {

    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            try {
                let data = await this._appState.asyncLogin(values);
                Modal.success({
                    title: "提示",
                    content: "登录成功",
                    okText: "确定"
                });
            } catch (e) {
                console.log(e);
                Modal.error({
                    title: "提示",
                    content: e.message,
                    okText: "确定"
                })
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className={styles.container}>
                <Form onSubmit={this.handleSubmit} className={styles.form}>
                    <FormItem>
                        {getFieldDecorator('LOGIN_NAME', {
                            rules: [{required: true, message: 'Please input your username!'}],
                        })(
                            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                   placeholder="Username"/>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('LOGIN_PASSWORD', {
                            rules: [{required: true, message: 'Please input your Password!'}],
                        })(
                            <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                                   placeholder="Password"/>
                        )}
                    </FormItem>
                    <Row>
                        <Button
                            className={styles.btLogin}
                            type="primary"
                            htmlType="submit">
                            登录
                        </Button>
                    </Row>
                </Form>
            </div>
        );
    }
}
