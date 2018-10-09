import React, { Component } from 'react';
import { NavLink, Route } from 'react-router-dom';
import { Layout, Select, Button, Message, Form, Input } from 'element-react';

import { addPosition, getOnePosition, updatePosition } from '@/api/manager';
import { educations, positionTypes, workTypes } from '@/config/static-data';

export default class Position extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        companyName: '',
        positionName: '',
        positionType: '',
        workType: '',
        salary: '',
        legalPerson: '',
        experience: '',
        education: '',
        address: '',
        requirements: '',
        duties: ''
      },
      rules: {
        companyName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        positionName: [
          { required: true, message: '请输入职位名称', trigger: 'blur' }
        ],
        positionType: [
          { required: true, message: '请选择职位类型', trigger: 'blur' }
        ],
        workType: [
          { required: true, message: '请选择是否兼职', trigger: 'blur' }
        ],
        salary: [
          { required: true, message: '请输入职位薪资', trigger: 'blur' },
          { validator: (rule, value, callBack) => {
            let val = parseInt(value, 10);

            if (!Number.isInteger(val)) {
              callBack(new Error('请输入数字值'));
            } else {
              callBack();
            }
          }, trigger: 'change' }
        ],
        legalPerson: [
          { required: true, message: '请输入招聘人数', trigger: 'blur' },
          { validator: (rule, value, callBack) => {
              let val = parseInt(value, 10);

              if (!Number.isInteger(val)) {
                callBack(new Error('请输入数字值'));
              } else {
                callBack();
              }
          }, trigger: 'change' }
        ],
        experience: [
          { required: true, message: '请输入工作经验', trigger: 'blur' }
        ],
        education: [
          { required: true, message: '请选择教育程度', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入工作地址', trigger: 'blur' }
        ],
        requirements: [
          { required: true, message: '请输入岗位职责', trigger: 'blur' }
        ],
        duties: [
          { required: true, message: '请输入任职资格', trigger: 'blur' }
        ]
      },
      positionTypes: {},
      positionId: ''
    }
  }

  async componentDidMount() {
    let positionId = this.props.match.params.positionId;

    if (positionId) {
      const res = await getOnePosition({
        id: positionId
      });
  
      if (res.status == 200) {
        this.setState({
          form: res.data,
          positionId: positionId
        });
      } else {
        Message({
          type: 'error',
          message: res.message
        });
      }
    }

    positionTypes()
    .then((res) => {
      this.setState({
        positionTypes: Object.assign({}, res)
      })
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.refs.form.validate(async (valid) => {
      if (valid) {
        let res;

        if (this.state.positionId) {
          res = await updatePosition(Object.assign({}, this.state.form));
        } else {
          res = await addPosition(Object.assign({}, this.state.form));
        }

        if (res.status == 200) {
          Message({
            type: 'success',
            message: this.state.positionId ? '更新成功' : '添加成功'
          });
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

  handleReset(e) {
    e.preventDefault();

    this.refs.form.resetFields();
    this.setState({
      form: {
        companyName: '',
        positionName: '',
        positionType: '',
        workType: '',
        salary: '',
        legalPerson: '',
        experience: '',
        education: '',
        address: '',
        duties: ''
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
      <div className="position-container">
        <Layout.Row>
          <Layout.Col span="12">
            <Form ref="form" model={this.state.form} rules={this.state.rules} labelWidth="80" onSubmit={this.handleSubmit.bind(this)}>
              <Form.Item label="公司名称" prop="companyName">
                <Input value={this.state.form.companyName} onChange={this.onChange.bind(this, 'companyName')} placeholder="请输入公司名称"></Input>
              </Form.Item>
              <Form.Item label="职位名称" prop="positionName">
                <Input value={this.state.form.positionName} onChange={this.onChange.bind(this, 'positionName')} placeholder="请输入职位名称"></Input>
              </Form.Item>
              <Form.Item label="职位类型" prop="positionType">
                <Select value={this.state.form.positionType} onChange={this.onChange.bind(this, 'positionType')} placeholder="职位类型">
                  {Object.keys(this.state.positionTypes).map((item) => (
                    <Select.Option key={item} label={this.state.positionTypes[item]} value={item}></Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="是否兼职" prop="workType">
                <Select value={this.state.form.workType} onChange={this.onChange.bind(this, 'workType')} placeholder="是否兼职">
                  {Object.keys(workTypes).map((item) => (
                    <Select.Option key={item} label={workTypes[item]} value={item}></Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="职位薪资" prop="salary">
                <Input value={this.state.form.salary} onChange={this.onChange.bind(this, 'salary')} placeholder="请输入职位薪资"></Input>
              </Form.Item>
              <Form.Item label="招聘人数" prop="legalPerson">
                <Input value={this.state.form.legalPerson} onChange={this.onChange.bind(this, 'legalPerson')} placeholder="请输入招聘人数"></Input>
              </Form.Item>
              <Form.Item label="工作经验" prop="experience">
                <Input value={this.state.form.experience} onChange={this.onChange.bind(this, 'experience')} placeholder="请输入工作经验"></Input>
              </Form.Item>
              <Form.Item label="教育程度" prop="education">
                <Select value={this.state.form.education} onChange={this.onChange.bind(this, 'education')} placeholder="教育程度">
                  {Object.keys(educations).map((item) => (
                    <Select.Option key={item} label={educations[item]} value={item}></Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="工作地址" prop="address">
                <Input value={this.state.form.address} onChange={this.onChange.bind(this, 'address')} placeholder="请输入工作地址"></Input>
              </Form.Item>
              <Form.Item label="岗位职责" prop="requirements">
                <Input type="textarea" value={this.state.form.requirements} autosize={{ minRows: 4, maxRows: 10}} onChange={this.onChange.bind(this, 'requirements')} placeholder="请输入岗位职责"></Input>
              </Form.Item>
              <Form.Item label="任职资格" prop="duties">
                <Input type="textarea" value={this.state.form.duties} autosize={{ minRows: 4, maxRows: 10}} onChange={this.onChange.bind(this, 'duties')} placeholder="任职资格"></Input>
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