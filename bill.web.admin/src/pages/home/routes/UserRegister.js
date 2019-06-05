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
            <h1>
                测试
            </h1>
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
