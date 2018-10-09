import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { getOnePosition, putResume } from "@/api/user";
import { Message } from "element-react";
import Page from "./components/page";
import Header from "./components/header";
import Container from "./components/container";
import BorderHeader from "./components/border_header";
import { educations, workTypes } from "@/config/static-data";
import { isLogin } from "@/utils/auth";
import { readCookie } from "@/config/util";

class PositionDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      position: "",
      isDeliver: false
    };
  }

  async componentDidMount() {
    const positionId = this.props.match.params.id;
    const res = await getOnePosition({
      id: positionId
    });

    this.setState({
      position: res.data,
      isDeliver: res.data.resumeId && res.data.resume_id.indexOf(res.data.resumeId) > -1 ? true : false
    });
  }
  
  async putResume() {
    if (isLogin()) {
      const res = await putResume({
        positionId: this.state.position._id
      });

      if (res.status == 200) {
        Message({
          type: 'success',
          message: '投递成功'
        });
        this.setState({ isDeliver: true });
      } else {
        Message({
          type: 'error',
          message: res.message
        });
      }
    } else {
      Message("请先登录，没有登录不可以投递哦");
    }
  }

  formatValueToHTML(val) {
    return val && val
      .replace(/\r/, "")
      .split("\n")
      .map(x => x.trim())
      .filter(x => !!x);
  }

  render() {
    const { position } = this.state;
    const duties = this.formatValueToHTML(position.duties);
    const requirements = this.formatValueToHTML(position.requirements);

    return (
      <Page>
        <Header />
        <Container>
          <Title>
            <div>
              <PositionTitle>{position.positionName}</PositionTitle>
              <Salary>{position.salary}</Salary>
            </div>
            <Description>
              <span className="desc">经验：{position.experience}</span>
              <span className="desc">
                学历：{educations[position.education]}
              </span>
              <span className="desc">类型：{workTypes[position.workType]}</span>
            </Description>
            <Description>
              <p className="address">公司名称：{position.companyName}</p>
              <p className="address">公司地址：{position.address}</p>
            </Description>
            {this.state.isDeliver && <Button className="disabled">已投递</Button>}
            {!this.state.isDeliver && <Button onClick={() => { this.putResume(); }}>立即投递</Button>}
          </Title>
          <JobDetail>
            {duties && <BorderHeader>职位描述</BorderHeader>}
            {duties && (
              <List>
                {Array.isArray(duties) &&
                  duties.map((value, index) => <li key={index}>{value}</li>)}
              </List>
            )}
            {requirements && <BorderHeader>任职要求</BorderHeader>}
            {requirements && (
              <List>
                {Array.isArray(requirements) &&
                  requirements.map((value, index) => (
                    <li key={index}>{value}</li>
                  ))}
              </List>
            )}
            <BorderHeader>公司介绍</BorderHeader>
            <Introduce>
              一份精彩的公司简介能为企业带来很多好处。可以作为推广工具，吸引投资者和客户对公司产品、服务的兴趣。还可以传递给社会、媒体和其他对公司蓝图感兴趣的相关人士。公司简介应该简要、有创意并吸引人，抓住重点，用有趣的方式呈现。
            </Introduce>
          </JobDetail>
        </Container>
      </Page>
    );
  }
}

export default PositionDetail;

const Title = styled.div`
   {
    position: relative;
    padding: 30px 30px 30px 30px;
    margin-top: 15px;
    background: #fff;
  }
`;

const PositionTitle = styled.span`
  margin-bottom: 10px;
  font-size: 24px;
  color: #333;
`;

const Salary = styled.span`
  color: red;
  margin-left: 30px;
  font-weight: 400;
  font-size: 18px;
`;

const Description = styled.div`
  margin-top: 15px;

  .desc {
    margin-right: 30px;
    color: #666;
  }

  .address {
    color: #666;
  }
`;

const JobDetail = styled.div`
   {
    padding: 30px 30px 30px 30px;
    margin-top: 15px;
    background: #fff;
  }
`;

const Introduce = styled.p`
  margin-top: 15px;
  line-height: 2em;
`;

const List = styled.ul`
   {
    padding-left: 10px;
    margin: 15px 0;
    line-height: 2em;
  }
`;

const Button = styled.button`
  position: absolute;
  top: 30px;
  right: 30px;
  border: none;
  padding: 0;
  background: #38b447;
  color: #fff;
  outline-style: none;
  border-radius: 3px;
  overflow: hidden;
  display: inline-block;
  width: 90px;
  height: 40px;
  cursor: pointer;

  &:hover {
    background: #3ec74f;
  }

  &.disabled {
    background: #ccc;
    color: #333;
    cursor: default;
  }
`;
