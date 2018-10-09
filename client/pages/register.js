import React, { Component } from 'react';
import { Form, Input, Button, Message } from 'element-react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import registerBg from '../images/bg.jpg';
import { userRegister } from '@/api/user';

class Register extends Component {
  constructor(props) {
    super(props);

    let checkMobile = (rule, value, callback) => {
      if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(value))) {
        callback(new Error('不是正确11位手机号'));
      }
      callback();
    }

    let checkPassword = (rule, value, callBack) => {
      let reg = new RegExp(/^[A-Za-z0-9]{6,14}$/);
      if (!reg.test(value)) {
        callBack(new Error('密码必须由6-14位数字字母组合'));
      }
      callBack();
    }

    let checkRepeatPwd = (rule, value, callBack) => {
      if (value != this.state.form.password) {
        callBack(new Error('两次密码输入不一致'));
      }
      callBack();
    }

    this.state = {
      form: {
        account: '',
        password: '',
        repeatPassword: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' }
        ],
        repeatPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: checkRepeatPwd, trigger: 'blur' }
        ]
      }
    };
  }

  handleReset() {    
    this.refs.form.resetFields();
    this.setState({
      form: {
        account: '',
        password: '',
        repeatPassword: ''
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.refs.form.validate(async (valid) => {
      if (valid) {
        const res = await userRegister({
          account: this.state.form.account,
          password: this.state.form.password
        });

        if (res.status == 200) {
          Message({
            type: 'success',
            message: '注册成功，请登录'
          });
          this.handleReset();
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
      <RegisterPage>
        <div className="register-page">
          <p className="title">注册</p>
          <Form ref="form" model={this.state.form} rules={this.state.rules} labelWidth="80" className="register-form">
            <Form.Item label="用户名" prop="account">
              <Input type="input" value={this.state.form.account} onChange={this.onChange.bind(this, 'account')} placeholder="请输入手机号" autoComplete="off" />
            </Form.Item>
            <Form.Item label="密码" prop="password">
              <Input type="password" value={this.state.form.password} onChange={this.onChange.bind(this, 'password')} placeholder="请输入密码" autoComplete="off" />
            </Form.Item>
            <Form.Item label="确认密码" prop="repeatPassword">
              <Input type="password" value={this.state.form.repeatPassword} onChange={this.onChange.bind(this, 'repeatPassword')} placeholder="请输入确认密码" autoComplete="off" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={this.handleSubmit.bind(this)}>注册</Button>
              <Link to="/login" className="regsiter">登录</Link>
            </Form.Item>
          </Form>
        </div>
      </RegisterPage>
    )
  }
}

const RegisterPage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: url('${registerBg}');
  background-size: cover;

  .register-page {
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

export default Register;