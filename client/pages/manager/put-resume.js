import React, { Component } from 'react';
import { NavLink, Route } from 'react-router-dom';
import styled from 'styled-components';
import { Tabs, Select, DatePicker, Button, Table, Loading, Message, Pagination } from 'element-react';

import { putResume } from '@/api/manager';
import { formatDate } from '@/utils/date';
import { genders, educations } from '@/config/static-data';

export default class PutResume extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,             // 是否在加载数据
      columns: [                  // 表格属性
        {
          label: "姓名",
          prop: "name"
        },
        {
          label: "性别",
          prop: "gender"
        },
        {
          label: "年龄",
          prop: "age"
        },
        {
          label: "手机号",
          prop: "mobile"
        },
        {
          label: "邮箱",
          prop: "email"
        },
        {
          label: "学历",
          prop: "education"
        },
        {
          label: "求职意向",
          prop: "jobIntension"
        },
        {
          label: "操作",
          prop: "zip",
          fixed: 'right',
          width: 100,
          render: (row, column, index) => {
            return (
              <span>
                <Button type="text" size="small"><NavLink to={`/manager/resume/${row.id}`}>查看详情</NavLink></Button>
              </span>
            )
          }
        }
      ],
      tableData: [],              // 表格数据
      total: 0,                   // 数据总条数
      pageSize: 20,               // 每页数据条数
      currentPage: 1              // 当前所在分页
    }
  }

  async componentDidMount() {
    this.setState({
      loading: true
    });
    
    const positionId = this.props.match.params.positionId;
    const res = await putResume({
      id: positionId
    });
    console.log(res);

    this.setState({
      loading: false
    });

    // 数据处理
    const resData = res.data;
    let tableData = [];

    resData.forEach((item) => {
      tableData.push({
        id: item._id,
        name: item.name,
        gender: genders[item.gender],
        age: item.age,
        mobile: item.mobile,
        email: item.email,
        education: educations[item.education],
        jobIntension: item.jobIntension
      });
    });

    this.setState({
      tableData: tableData,
      // total: resData.total
    });

  }

  // 分页
  handleCurrentChange(val) {
    this.setState({
      currentPage: val
    }, () => {
      this.queryData();
    });
  }

  render() {
    const { match } = this.props;

    return (
      <ResumeList>
        <Loading text="拼命加载中" loading={this.state.loading}>
          <Table
            style={{width: '100%'}}
            columns={this.state.columns}
            data={this.state.tableData}
            border={true}
          />
          {(this.state.total > this.state.pageSize) && <Pagination layout="total, prev, pager, next" pageSize={this.state.pageSize} total={this.state.total} currentPage={this.state.currentPage} onCurrentChange={this.handleCurrentChange.bind(this)}/>}
        </Loading>
      </ResumeList>
    )
  }
}

const ResumeList = styled.div`

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