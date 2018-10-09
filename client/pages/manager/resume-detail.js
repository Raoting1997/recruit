import React, { Component } from 'react';
import styled from 'styled-components';
import { Layout, Select, Button, Message, Form, Input } from 'element-react';

import { userResume, updateResume } from '@/api/manager';
import { genders, educations } from '@/config/static-data';

class Resume extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEdit: false,
      resume: '',
      form: {
        name: '',
        gender: '',
        age: '',
        mobile: '',
        email: '',
        education: '',
        jobIntension: '',
        advantage: '',
        educationBackground: [{
          school: '',
          major: ''
        }],
        projectExperience: [{
          name: '',
          role: '',
          description: ''
        }],
        workExperience: [{
          company: '',
          position: '',
          responsibility: ''
        }]
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change,blur' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' },
          { validator: (rule, value, callBack) => {
            let val = parseInt(value, 10);

            if (!Number.isInteger(val)) {
              callBack(new Error('请输入数字值'));
            } else {
              callBack();
            }
          }, trigger: 'change,blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: (rule, value, callBack) => {
            if (!/^1\d{10}$/.test(value)) {
              callBack(new Error('手机号格式不对'));
            } else {
              callBack();
            }
          }, trigger: 'change,blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: (rule, value, callBack) => {
            if (!/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value)) {
              callBack(new Error('邮箱格式不对'));
            } else {
              callBack();
            }
          }, trigger: 'change,blur' }
        ],
        education: [
          { required: true, message: '请选择学历', trigger: 'change,blur' }
        ],
        jobIntension: [
          { required: true, message: '请输入求职意向', trigger: 'blur' }
        ],
        advantage: [
          { required: false, message: '请输入我的优势', trigger: 'blur' }
        ]
      }
    }
  }

  async componentDidMount() {
    const res = await userResume({
      id: this.props.match.params.resumeId
    });

    if (res.data) {
      this.setState({
        resume: res.data,
        form: {
          name: res.data.name,
          age: String(res.data.age),
          email: res.data.email,
          gender: res.data.gender,
          mobile: String(res.data.mobile),
          education: res.data.education,
          jobIntension: res.data.jobIntension,
          advantage: res.data.advantage,
          educationBackground: res.data.educationBackground,
          projectExperience: res.data.projectExperience,
          workExperience: res.data.workExperience
        }
      });
    }
  }

  onChange(key, value) {
    this.setState({
      form: Object.assign({}, this.state.form, { [key]: value })
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.refs.form.validate(async (valid) => {
      if (valid) {
        const res = await updateResume(Object.assign({}, {id: this.state.resume._id}, this.state.form));

        if (res.status == 200) {
          this.setState({
            isEdit: false,
            resume: this.state.form
          });
          Message({
            type: 'success',
            message: '简历更新成功'
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

  removeProject(item, value, e) {
    var index = this.state.form[item].indexOf(value);

    if (index !== -1) {
      this.state.form[item].splice(index, 1);
      this.forceUpdate();
    }

    e.preventDefault();
  }

  addEducation(e) {
    e.preventDefault();

    this.state.form.educationBackground.push({
      school: '',
      major: ''
    });

    this.forceUpdate();
  }

  addProject(e) {
    e.preventDefault();

    this.state.form.projectExperience.push({
      nama: '',
      role: ''
    });

    this.forceUpdate();
  }

  addWork(e) {
    e.preventDefault();

    this.state.form.workExperience.push({
      company: '',
      position: '',
      responsibility: ''
    });

    this.forceUpdate();
  }

  onPropertyChange(item, index, key, value) {
    this.state.form[item][index][key] = value;
    this.forceUpdate();
  }

  formatValueToHTML(val) {
    return val && val
      .replace(/\r/, "")
      .split("\n")
      .map(x => x.trim())
      .filter(x => !!x);
  }

  render() {
    const { resume, form } = this.state;
    return (
      <div style={{ marginRight: '10px' }}>
        <BorderHeader>
          <p className="title"><i></i>基本资料</p>
          {/* {!this.state.isEdit && <button onClick={() => this.setState({ isEdit: true })}>编辑</button>} */}
        </BorderHeader>
        <Form ref="form" model={this.state.form} rules={this.state.rules} labelWidth="80" onSubmit={this.handleSubmit.bind(this)}>
          {!this.state.isEdit && <Section>
            <Info keys="姓名：" value={resume.name} />
            <Info keys="性别：" value={genders[resume.gender]} />
            <Info keys="年龄：" value={resume.age} />
            <Info keys="电话：" value={resume.mobile} />
            <Info keys="邮箱：" value={resume.email} />
            <Info keys="学历：" value={educations[resume.education]} />
            <Info keys="求职意向：" value={resume.jobIntension} />
          </Section>}
          {this.state.isEdit && <Section>
            <Layout.Row gutter="16">
              <Layout.Col span="8">
                <Form.Item label="姓名" prop="name">
                  <Input value={this.state.form.name} onChange={this.onChange.bind(this, 'name')} placeholder="请输入姓名"></Input>
                </Form.Item>
                <Form.Item label="性别" prop="gender">
                  <Select value={this.state.form.gender} onChange={this.onChange.bind(this, 'gender')} placeholder="性别">
                    {Object.keys(genders).map((item) => (
                      <Select.Option key={item} label={genders[item]} value={item}></Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="年龄" prop="age">
                  <Input value={this.state.form.age} onChange={this.onChange.bind(this, 'age')} placeholder="请输入年龄"></Input>
                </Form.Item>
                <Form.Item label="电话" prop="mobile">
                  <Input value={this.state.form.mobile} onChange={this.onChange.bind(this, 'mobile')} placeholder="请输入电话"></Input>
                </Form.Item>
                <Form.Item label="邮箱" prop="email">
                  <Input value={this.state.form.email} onChange={this.onChange.bind(this, 'email')} placeholder="请输入邮箱"></Input>
                </Form.Item>
                <Form.Item label="学历" prop="education">
                  <Select value={this.state.form.education} onChange={this.onChange.bind(this, 'education')} placeholder="学历">
                    {Object.keys(educations).map((item) => (
                      <Select.Option key={item} label={educations[item]} value={item}></Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="求职意向" prop="jobIntension">
                  <Input value={this.state.form.jobIntension} onChange={this.onChange.bind(this, 'jobIntension')} placeholder="请输入求职意向"></Input>
                </Form.Item>
              </Layout.Col>
            </Layout.Row>
          </Section>}
          <BorderHeader>
            <p className="title"><i></i>我的优势</p>
          </BorderHeader>
          <Section>
            <Layout.Row gutter="16">
              <Layout.Col span="12">
                {!this.state.isEdit && <Info keys="我的优势：" value={resume.advantage ? resume.advantage: '待完善'} />}
                {this.state.isEdit && <Form.Item label="我的优势" prop="advantage">
                  <Input type="textarea" value={this.state.form.advantage} autosize={{ minRows: 2, maxRows: 4}} onChange={this.onChange.bind(this, 'advantage')} placeholder="一句话描述自己"></Input>
                </Form.Item>}
              </Layout.Col>
            </Layout.Row>
          </Section>
          <BorderHeader>
            <p className="title"><i></i>教育背景</p>
          </BorderHeader>
          <Section>
            {!this.state.isEdit && resume.educationBackground && resume.educationBackground.map((education, index) => {
              return (
                <div key={index}>
                  <Info keys="学校名称：" value={education.school} />
                  <Info keys="专业名称：" value={education.major} />
                </div>
              )
            })}
            {
              this.state.isEdit && this.state.form.educationBackground && this.state.form.educationBackground.map((education, index) => {
                return (
                  <Layout.Row gutter="16" key={index}>
                    <Layout.Col span="8">
                      <Form.Item
                        label={`学校`}
                        prop={`educationBackground:${index}`}
                        rules={{
                          type: 'object', required: true,
                          fields: {
                            school: { required: true, message: '学校不能为空', trigger: 'blur' }
                          }
                        }}
                      >
                        <Input value={education.school} placeholder="请输入学校" onChange={(value) => this.onPropertyChange('educationBackground', index, 'school', value)}></Input>
                      </Form.Item>
                      <Form.Item
                        label={`专业`}
                        prop={`educationBackground:${index}`}
                        rules={{
                          type: 'object', required: true,
                          fields: {
                            major: { required: true, message: '专业不能为空', trigger: 'blur' }
                          }
                        }}
                      >
                        <Input value={education.major} placeholder="请输入专业" onChange={(value) => this.onPropertyChange('educationBackground', index, 'major', value)}></Input>
                      </Form.Item>
                    </Layout.Col>
                    <Layout.Col span="2">
                      <Form.Item>
                        <Button onClick={this.removeProject.bind(this, 'educationBackground', education)}>删除</Button>
                      </Form.Item>
                    </Layout.Col>
                  </Layout.Row>
                )
              })
            }
            {this.state.isEdit && <Form.Item>
              <Button onClick={this.addEducation.bind(this)}>新增</Button>
            </Form.Item>}
          </Section>
          <BorderHeader>
            <p className="title"><i></i>项目经验</p>
          </BorderHeader>
          <Section>
            {!this.state.isEdit && resume.projectExperience && resume.projectExperience.map((project, index) => {
              return (
                <div key={index}>
                  <Info keys="项目名称：" value={project.name} />
                  <Info keys="项目角色：" value={project.role} />
                </div>
              )
            })}
            {
              this.state.isEdit && this.state.form.projectExperience && this.state.form.projectExperience.map((project, index) => {
                return (
                  <Layout.Row gutter="16" key={index}>
                    <Layout.Col span="8">
                      <Form.Item
                        label={`项目名称`}
                        prop={`projectExperience:${index}`}
                        rules={{
                          type: 'object', required: true,
                          fields: {
                            name: { required: true, message: '项目名称不能为空', trigger: 'blur' }
                          }
                        }}
                      >
                        <Input value={project.name} placeholder="请输入项目名称" onChange={(value) => this.onPropertyChange('projectExperience', index, 'name', value)}></Input>
                      </Form.Item>
                      <Form.Item
                        label={`项目角色`}
                        prop={`projectExperience:${index}`}
                        rules={{
                          type: 'object', required: true,
                          fields: {
                            role: { required: true, message: '项目角色不能为空', trigger: 'blur' }
                          }
                        }}
                      >
                        <Input value={project.role} placeholder="请输入项目角色" onChange={(value) => this.onPropertyChange('projectExperience', index, 'role', value)}></Input>
                      </Form.Item>
                    </Layout.Col>
                    <Layout.Col span="2">
                      <Form.Item>
                        <Button onClick={this.removeProject.bind(this, 'projectExperience', project)}>删除</Button>
                      </Form.Item>
                    </Layout.Col>
                  </Layout.Row>
                )
              })
            }
            {this.state.isEdit && <Form.Item>
              <Button onClick={this.addProject.bind(this)}>新增</Button>
            </Form.Item>}
          </Section>
          <BorderHeader>
            <p className="title"><i></i>工作经历</p>
          </BorderHeader>
          <Section>
            {!this.state.isEdit && resume.workExperience && resume.workExperience.map((work, index) => {
              return (
                <div key={index}>
                  <Info keys="公司名称：">{work.company}</Info>
                    <Info keys="职位名称：">{work.position}</Info>
                    <Info keys="岗位职责：">
                      <List>
                        {this.formatValueToHTML(work.responsibility).map((value, index) => (
                          <li key={index}>{value}</li>
                        ))}
                      </List>
                    </Info>
                </div>
              )
            })}
            {
              this.state.isEdit && this.state.form.workExperience && this.state.form.workExperience.map((work, index) => {
                return (
                  <Layout.Row gutter="16" key={index}>
                    <Layout.Col span="8">
                      <Form.Item
                        label={`公司名称`}
                        prop={`workExperience:${index}`}
                        rules={{
                          type: 'object', required: true,
                          fields: {
                            company: { required: true, message: '公司名称不能为空', trigger: 'blur' }
                          }
                        }}
                      >
                        <Input value={work.company} placeholder="请输入公司名称" onChange={(value) => this.onPropertyChange('workExperience', index, 'company', value)}></Input>
                      </Form.Item>
                      <Form.Item
                        label={`职位名称`}
                        prop={`workExperience:${index}`}
                        rules={{
                          type: 'object', required: true,
                          fields: {
                            position: { required: true, message: '职位名称不能为空', trigger: 'blur' }
                          }
                        }}
                      >
                        <Input value={work.position} placeholder="请输入职位名称" onChange={(value) => this.onPropertyChange('workExperience', index, 'position', value)}></Input>
                      </Form.Item>
                      <Form.Item
                        label={`岗位职责`}
                        prop={`workExperience:${index}`}
                        rules={{
                          type: 'object', required: true,
                          fields: {
                            responsibility: { required: true, message: '岗位职责不能为空', trigger: 'blur' }
                          }
                        }}
                      >
                        <Input type="textarea" value={work.responsibility} autosize={{ minRows: 2, maxRows: 4}} placeholder="请输入岗位职责" onChange={(value) => this.onPropertyChange('workExperience', index, 'responsibility', value)}></Input>
                      </Form.Item>
                    </Layout.Col>
                    <Layout.Col span="2">
                      <Form.Item>
                        <Button onClick={this.removeProject.bind(this, 'workExperience', work)}>删除</Button>
                      </Form.Item>
                    </Layout.Col>
                  </Layout.Row>
                )
              })
            }
            {this.state.isEdit && <Form.Item>
              <Button onClick={this.addWork.bind(this)}>新增</Button>
            </Form.Item>}
          </Section>
          {this.state.isEdit && <Form.Item style={{ marginTop: '20px' }}>
            <Button onClick={() => this.setState({ isEdit: false })}>取消</Button>
            <Button type="primary" onClick={this.handleSubmit.bind(this)}>完成</Button>
          </Form.Item>}
        </Form>
      </div>
    )
  }
}

export default Resume;

const Info = ( {keys, value, children} ) => (
  <InfoContainer>
    <span style={{ color: '#999', float: 'left' }}>{keys}</span>
    {value && <div>{value}</div>}
    {children && <div>{children}</div>}
  </InfoContainer>
)

const InfoContainer = styled.div`
  line-height: 2em;
  overflow: hidden;

  div {
    margin-left: 75px;
  }
`;

const BorderHeader = styled.div`
  overflow: hidden;
  margin-top: 15px;

  .title {
    font-weight: 700;
    font-size: 14px;
    float: left;

    i {
      display: inline-block;
      width: 0;
      height: 14px;
      vertical-align: -2px;
      border-left: 5px solid #20a0ff;
      margin-right: 10px;
    }
  }

  button {
    float: right;
    padding: 5px 15px;
    background: #20a0ff;
    color: #fff;
    border-radius: 3px;
    cursor: pointer;

    &:hover {
      background: #4db3ff;
    }
  }
`;

const Section = styled.section`
  padding: 15px 20px;
  margin-top: 15px;
  background: #fff;
`;

const List = styled.ul`
  {
    line-height: 2em;
  }
`;
