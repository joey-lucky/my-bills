import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Button, Checkbox, Form, Icon, Input} from 'antd';


@Form.create()
@withRouter
export default class UserRegister extends Component {
    static displayName = 'UserLogin';

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            value: {
                username: '',
                password: '',
                checkbox: false,
            },
        };
    }

    formChange = (value) => {
        // this.setState({
        //     value,
        // });
    };

    handleSubmit = (e) => {
        // e.preventDefault();
        // this.refs.form.validateAll((errors, values) => {
        //     if (errors) {
        //         console.log('errors', errors);
        //         return;
        //     }
        //     console.log(values);
        //     this.props.history.push('/');
        // });
    };

    render() {
        return (
            <Form style={styles.container}>
                <h4 style={styles.title}>登 录</h4>
                <div >
                    <div style={styles.formItem}>
                        {
                            this.props.form.getFieldDecorator("username")(
                                <Input
                                    placeholder="请输入用户名"
                                    prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                />
                            )
                        }
                    </div>
                    <div style={styles.formItem}>
                        {
                            this.props.form.getFieldDecorator("password")(
                                <Input
                                    type={"password"}
                                    placeholder="请输入密码"
                                    prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                />
                            )
                        }
                    </div>
                    <div style={styles.formItem}>
                        {
                            this.props.form.getFieldDecorator("rememberPassword")(
                                <Checkbox>
                                    记住密码
                                </Checkbox>
                            )
                        }
                    </div>
                    <div style={styles.footer}>
                        <Button
                            type="primary"
                            size="large"
                            onClick={this.handleSubmit}
                            style={styles.submitBtn}
                        >
                            登 录
                        </Button>
                        <Link to="/user/register" style={styles.tips}>
                            立即注册
                        </Link>
                    </div>
                </div>
            </Form>
        );
    }
}

const styles = {
    container: {
        width: '400px',
        padding: '40px',
        background: '#fff',
        borderRadius: '6px',
    },
    title: {
        margin: '0 0 40px',
        color: 'rgba(0, 0, 0, 0.8)',
        fontSize: '28px',
        fontWeight: '500',
        textAlign: 'center',
    },
    formItem: {
        position: 'relative',
        marginBottom: '20px',
    },
    inputIcon: {
        position: 'absolute',
        left: '10px',
        top: '12px',
        color: '#666',
    },
    inputCol: {
        width: '100%',
        paddingLeft: '20px',
    },
    submitBtn: {
        width: '100%',
    },
    tips: {
        marginTop: '20px',
        display: 'block',
        textAlign: 'center',
    },
};
