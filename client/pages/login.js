import React, { Component } from 'react';
import { Form, Input, Button, Message } from 'element-react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import loginBg from '../images/bg.jpg';
import { userLogin } from '@/api/user';

class Login extends Component {
    constructor(props) {
        super(props);

        let checkMobile = (rule, value, callback) => {
            if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(value))) {
                callback(new Error('不是正确11位手机号'));
            }
            callback();
        }

        this.state = {
            form: {
                account: '',
                password: ''
            },
            rules: {
                account: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            }
        };
    }

    handleSubmit(e) {
        e.preventDefault();

        const { history, location } = this.props;

        this.refs.form.validate(async (valid) => {
            if (valid) {
                const res = await userLogin({
                    account: this.state.form.account,
                    password: this.state.form.password
                });
                console.log(res);

                if (res.status == 200) {
                    Message({
                        type: 'success',
                        message: '登录成功'
                    });

                    if (location.pathname !== '') {
                        if (location.pathname == '/login') {
                            history.push('/');
                        } else {
                            history.push(location.pathname);
                        }
                    } else {
                        history.push('/');
                    }
                } else {
                    Message({
                        type: 'error',
                        message: res.message
                    });
                }
            } else {
                return false;
            }
        });
    }

    onChange(key, value) {
        this.setState({
            form: Object.assign({}, this.state.form, { [key]: value })
        });
    }

    render() {
        return (
            <LoginPage>
                <div className="login-page">
                    <p className="title">登录</p>
                    <Form ref="form" model={this.state.form} rules={this.state.rules} labelWidth="70" className="login-form">
                        <Form.Item label="用户名" prop="account">
                            <Input type="input" value={this.state.form.account} onChange={this.onChange.bind(this, 'account')} placeholder="请输入手机号" autoComplete="off" />
                        </Form.Item>
                        <Form.Item label="密码" prop="password">
                            <Input type="password" value={this.state.form.password} onChange={this.onChange.bind(this, 'password')} placeholder="请输入密码" autoComplete="off" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={this.handleSubmit.bind(this)}>登录</Button>
                            <Link to="/register" className="regsiter">注册</Link>
                        </Form.Item>
                    </Form>
                </div>
            </LoginPage>
        )
    }
}

const LoginPage = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: url('${loginBg}');
    background-size: cover;

    .login-page {
        position: relative;
        top: 50%;
        width: 360px;
        padding: 25px;
        margin: 0 auto;
        border-radius: 5px;
        background: #fff;
        transform: translateY(-50%);

        .title {
            font-size: 26px;
            color: #333;
            padding: 0 0 25px 0;
            text-align: center;
        }

        .regsiter {
            margin-left: 15px;
        }
    }
`;

export default Login;