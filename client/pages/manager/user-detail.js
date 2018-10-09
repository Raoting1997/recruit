import React, { Component } from 'react';
import { NavLink, Route } from 'react-router-dom';
import { Layout, Select, Button, Message, Form, Input } from 'element-react';
import { addUser, getUser, updatePassword } from '@/api/manager';

export default class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAdd: true,
      form: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(value))) {
              callback(new Error('不是正确11位手机号'));
            }
            callback();
          } }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: (rule, value, callBack) => {
            let reg = new RegExp(/^[A-Za-z0-9]{6,14}$/);
            if (!reg.test(value)) {
              callBack(new Error('密码必须由6-14位数字字母组合'));
            }
            callBack();
          } }
        ]
      }
    }
  }

  async componentDidMount() {
    let userId = this.props.match.params.userId;
    if (userId) {
      const res = await getUser({
        id: this.props.match.params.userId
      });

      this.setState({
        isAdd: false,
        form: {
          account: res.data.account
        }
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    this.refs.form.validate(async (valid) => {
      if (valid) {

        if (this.state.isAdd) {
          const res = await addUser(Object.assign({}, this.state.form));

          if (res.status == 200) {
            Message({
              type: 'success',
              message: '添加成功'
            });
            this.refs.form.resetFields();
            this.setState({
              form: {
                account: '',
                password: ''
              }
            });
          } else {
            Message({
              type: 'error',
              message: res.message
            });
          }
        } else {
          const res = await updatePassword(Object.assign({}, this.state.form));
          if (res.status == 200) {
            Message({
              type: 'success',
              message: '密码修改成功'
            });
            this.refs.form.resetFields();
            this.setState({
              form: {
                account: this.state.isAdd ? '' : this.state.form.account,
                password: ''
              }
            });
          } else {
            Message({
              type: 'error',
              message: res.message
            });
          }
        }
      } else {
        return false;
      }
    });
  }

  handleReset(e) {
    e.preventDefault();

    this.refs.form.resetFields();
    this.setState({
      form: {
        account: this.state.isAdd ? '' : this.state.form.account,
        password: ''
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
      <div>
        <Layout.Row>
          <Layout.Col span="12">
            <Form ref="form" model={this.state.form} rules={this.state.rules} labelWidth="80" onSubmit={this.handleSubmit.bind(this)}>
              {this.state.isAdd && <Form.Item label="用户名" prop="account">
                <Input type="input" value={this.state.form.account} onChange={this.onChange.bind(this, 'account')} placeholder="请输入手机号" autoComplete="off" />
              </Form.Item>}
              {!this.state.isAdd && <Form.Item label="用户名" prop="account">
                <Input type="input" value={this.state.form.account} disabled />
              </Form.Item>}
              <Form.Item label="密码" prop="password">
                <Input type="input" value={this.state.form.password} onChange={this.onChange.bind(this, 'password')} placeholder="请输入密码" autoComplete="off" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={this.handleSubmit.bind(this)}>提交</Button>
                <Button onClick={this.handleReset.bind(this)}>重置</Button>
              </Form.Item>
            </Form>
          </Layout.Col>
        </Layout.Row>
      </div>
    )
  }
}