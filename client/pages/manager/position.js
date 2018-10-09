import React, { Component } from 'react';
import { NavLink, Route } from 'react-router-dom';
import styled from 'styled-components';
import { Tabs, Select, DatePicker, Button, Table, Loading, Message, Pagination } from 'element-react';

import { getPositionList, deletePosition } from '@/api/manager';
import { formatDate } from '@/utils/date';
import { educations, positionTypes, workTypes } from '@/config/static-data';

export default class Position extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,             // 是否在加载数据
      columns: [                  // 表格属性
        {
          label: "发布时间",
          prop: "date",
          width: 120,
          fixed: 'left'
        },
        {
          label: "公司名称",
          prop: "companyName"
        },
        {
          label: "职位名称",
          prop: "positionName"
        },
        {
          label: "职位类型",
          prop: "positionType"
        }, {
          label: "是否兼职",
          prop: "workType"
        }, {
          label: "职位薪资",
          prop: "salary"
        }, {
          label: "招聘人数",
          prop: "legalPerson"
        }, {
          label: "工作经验",
          prop: "experience"
        }, {
          label: "教育程度",
          prop: "education"
        },
        {
          label: "操作",
          prop: "zip",
          fixed: 'right',
          width: 200,
          render: (row, column, index) => {
            return (
              <span>
                <Button type="text" size="small"><NavLink to={`${this.props.match.path}/${row.id}`}>编辑</NavLink></Button>
                <Button type="text" size="small"><NavLink to={`${this.props.match.path}/putResume/${row.id}`}>查看已投递简历</NavLink></Button>
                <Button type="text" size="small"><div data-index={index} onClick={this.deletePosition}>删除</div></Button>
              </span>
            )
          }
        }
      ],
      positionTypes: {},
      tableData: [],              // 表格数据
      total: 0,                   // 数据总条数
      pageSize: 20,               // 每页数据条数
      currentPage: 1              // 当前所在分页
    }

    this.deletePosition = this.deletePosition.bind(this);
  }

  componentDidMount() {
    positionTypes()
    .then((res) => {
      this.setState({
        positionTypes: Object.assign({}, res)
      })
    });
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

    let res = await getPositionList();

    this.setState({
      loading: false
    });

    // 数据处理
    const resData = res.data;
    let tableData = [];

    resData.forEach((item) => {
      tableData.push({
        id: item._id,
        date: formatDate(new Date(item.publishDate)),
        companyName: item.companyName,
        positionName: item.positionName,
        positionType: this.state.positionTypes[item.positionType],
        workType: workTypes[item.workType],
        salary: item.salary,
        legalPerson: item.legalPerson,
        experience: item.experience,
        education: educations[item.education]
      });
    });

    this.setState({
      tableData: tableData,
      // total: resData.total
    });
  }

  async deletePosition(e) {
    let index = e.target.getAttribute('data-index');
    let res = await deletePosition({ id: this.state.tableData[index].id });

    if (res.status == 200) {
      let lists = this.state.tableData;

      lists.splice(index, 1);
      this.setState({ tableData: lists });

      Message({
        type: 'success',
        message: '删除成功'
      });
    } else {
      Message({
        type: 'error',
        message: res.message
      });
    }
  }

  render() {
    const { match } = this.props;

    return (
      <PositionList>
        <div className="condition">
          <Button type="primary"><NavLink to={`${match.path}/add`}>添加职位</NavLink></Button>
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
      </PositionList>
    )
  }
}

const PositionList = styled.div`

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