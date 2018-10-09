import React, { Component } from "react";
import { NavLink, Route } from "react-router-dom";
import styled from "styled-components";
import Page from "./components/page";
import Header from "./components/header";
import BorderHeader from "./components/border_header";
import Container from "./components/container";
import {
  Tabs,
  Select,
  Table,
  Loading,
  Message,
  Pagination,
  Button
} from "element-react";

import { getPutposition } from "@/api/user";
import { formatDate } from "@/utils/date";
import { educations, positionTypes, workTypes } from "@/config/static-data";

class PutPosition extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false, // 是否在加载数据
      columns: [
        // 表格属性
        {
          label: "发布时间",
          prop: "date",
          width: 120,
          fixed: "left"
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
        },
        {
          label: "是否兼职",
          prop: "workType"
        },
        {
          label: "职位薪资",
          prop: "salary"
        },
        {
          label: "招聘人数",
          prop: "legalPerson"
        },
        {
          label: "工作经验",
          prop: "experience"
        },
        {
          label: "教育程度",
          prop: "education"
        },
        {
          label: "操作",
          prop: "zip",
          fixed: 'right',
          width: 100,
          render: (row, column, index) => {
            return (
              <span>
                <Button type="text" size="small"><NavLink to={`/position/${row.id}`}>查看详情</NavLink></Button>
              </span>
            )
          }
        }
      ],
      positionTypes: {},
      tableData: [],  // 表格数据
      total: 0,       // 数据总条数
      pageSize: 20,   // 每页数据条数
      currentPage: 1  // 当前所在分页
    };
  }

  async componentDidMount() {
    positionTypes()
    .then((res) => {
      this.setState({
        positionTypes: Object.assign({}, res)
      })
    });

    const res = await getPutposition();
    console.log(res);
    this.setState({
      loading: false
    });

    // 数据处理
    if (res.status === 200) {
      const resData = new Set(res.data);
      let tableData = [];

      resData.forEach(item => {
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
        tableData: tableData
        // total: resData.total
      });
    }
  }

  // 分页
  handleCurrentChange(val) {
    this.setState(
      {
        currentPage: val
      },
      () => {
        this.queryData();
      }
    );
  }

  // 绑定查询数据
  handleQueryData() {
    this.setState(
      {
        currentPage: 1
      },
      () => {
        this.queryData();
      }
    );
  }

  render() {
    const { match } = this.props;

    return (
      <Page>
        <Header />
        <Container style={{ marginTop: "20px" }}>
          <BorderHeader style={{ marginBottom: "20px" }}>已投递职位</BorderHeader>
          <PositionList>
            <Loading text="拼命加载中" loading={this.state.loading}>
              <Table
                style={{ width: "100%" }}
                columns={this.state.columns}
                data={this.state.tableData}
                border={true}
              />
              {this.state.total > this.state.pageSize && (
                <Pagination
                  layout="total, prev, pager, next"
                  pageSize={this.state.pageSize}
                  total={this.state.total}
                  currentPage={this.state.currentPage}
                  onCurrentChange={this.handleCurrentChange.bind(this)}
                />
              )}
            </Loading>
          </PositionList>
        </Container>
      </Page>
    );
  }
}

export default PutPosition;

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