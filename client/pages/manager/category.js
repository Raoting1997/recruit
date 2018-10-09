import React, { Component } from 'react';
import styled from 'styled-components';
import { Tabs, Select, DatePicker, Button, Table, Loading, Message, Pagination, Dialog, Form, Input } from 'element-react';

import { positionType, addPositionType } from '@/api/manager';
import { formatDate } from '@/utils/date';

export default class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,             // 是否在加载数据
      dialogVisible: false,
      form: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入职位分类', trigger: 'blur' }
        ]
      },
      columns: [                  // 表格属性
        {
          label: "名称",
          prop: "name"
        },
        {
          label: "id",
          prop: "id"
        }
      ],
      tableData: [],              // 表格数据
      total: 0,                   // 数据总条数
      pageSize: 20,               // 每页数据条数
      currentPage: 1              // 当前所在分页
    }

  }

  componentDidMount() {
    this.queryData();
  }

  // 分页
  handleCurrentChange(val) {
    this.setState({
      currentPage: val
    }, () => {
      this.queryData();
    });
  }

  // 绑定查询数据
  handleQueryData() {
    this.setState({
      currentPage: 1
    }, () => {
      this.queryData();
    });
  }

  // 查询数据
  async queryData() {

    // 网络请求
    this.setState({
      loading: true
    });

    let res = await positionType();

    this.setState({
      loading: false
    });

    // 数据处理
    const resData = res.data;
    let tableData = [];

    resData.forEach((item) => {
      tableData.push({
        id: item._id,
        name: item.name
      });
    });

    this.setState({
      tableData: tableData,
      // total: resData.total
    });
  }

  addCategory() {
    this.setState({ dialogVisible: true });
  }

  handleAddCategory() {
    this.refs.form.validate(async (valid) => {
      if (valid) {
        const res = await addPositionType({
          name: this.state.form.name
        });

        if (res.status == 200) {
          Message({
            type: 'success',
            message: '添加成功'
          });

          this.handleReset();

          this.setState({
            dialogVisible: false
          });

          this.state.tableData.push({
            id: res.data._id,
            name: res.data.name
          });

          this.forceUpdate();
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

  handleReset() {
    this.refs.form.resetFields();
    this.setState({
      form: {
        name: ''
      }
    });
  }

  render() {
    return (
      <Category>
        <div className="condition">
          <Button type="primary" onClick={this.addCategory.bind(this)}>添加分类</Button>
        </div>
        <Loading text="拼命加载中" loading={this.state.loading}>
          <Table
            style={{width: '100%'}}
            columns={this.state.columns}
            data={this.state.tableData}
            border={true}
          />
          {(this.state.total > this.state.pageSize) && <Pagination layout="total, prev, pager, next" pageSize={this.state.pageSize} total={this.state.total} currentPage={this.state.currentPage} onCurrentChange={this.handleCurrentChange.bind(this)}/>}
        </Loading>
        <Dialog
          title="添加分类"
          size="tiny"
          visible={ this.state.dialogVisible }
          onCancel={ () => this.setState({ dialogVisible: false }) }
        >
          <Dialog.Body>
            <Form ref="form" model={this.state.form} rules={this.state.rules}>
              <Form.Item prop="name" label="职位分类" labelWidth="120">
                <Input value={this.state.form.name} onChange={this.onChange.bind(this, 'name')} placeholder="请输入职位分类"></Input>
              </Form.Item>
            </Form>
          </Dialog.Body>
          <Dialog.Footer className="dialog-footer">
            <Button onClick={ () => this.setState({ dialogVisible: false }) }>取 消</Button>
            <Button type="primary" onClick={ this.handleAddCategory.bind(this) }>确 定</Button>
          </Dialog.Footer>
        </Dialog>
      </Category>
    )
  }
}

const Category = styled.div`

  .el-button {
    a {
      color: #fff;
    }
  }

  .el-table {
    .el-button {
      a {
        color: #20a0ff;
      }
    }
  }
`;