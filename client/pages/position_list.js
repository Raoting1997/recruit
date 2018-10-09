import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Button from "./components/button";
import Page from './components/page';
import Header from './components/header';
import Container from './components/container';
import { getAllPosition } from "@/api/user";
import { educations, workTypes } from '@/config/static-data';
import { formatDate } from '@/utils/date';

class PositionList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      positionList: []
    };
  }

  async componentDidMount() {
    const res = await getAllPosition();

    console.log(res);

    let positionData = [];

    res.data.forEach(item => {
      positionData.push({
        id: item._id,
        date: formatDate(new Date(item.publishDate)),
        companyName: item.companyName,
        positionName: item.positionName,
        workType: workTypes[item.workType],
        salary: item.salary,
        legalPerson: item.legalPerson,
        experience: item.experience,
        education: educations[item.education],
        duties: item.duties
      });
    });

    this.setState({
      positionList: positionData
    });
  }

  render() {
    return (
      <Page>
        <Header></Header>
        <Container>
        {(Array.isArray(this.state.positionList) && this.state.positionList.length) ?
          this.state.positionList.map(position => (
            <Posiiton key={position.id}>
              <PositionTitle><Link to={`/position/${position.id}`}>{position.positionName}</Link></PositionTitle>
              <div>
                <Salary>职位薪资：{position.salary}</Salary>
                <Description>经验：{position.experience}</Description>
                <Description>学历：{position.education}</Description>
                <Description>类型：{position.workType}</Description>
              </div>
              <Button url={`/position/${position.id}`} value="查看详情" />
              <PositionDescription>
                <p>主要职责：</p>
                {position.duties.length > 150 ? (
                  <div>
                    {position.duties.substring(0, 150)}
                    <Link to={`/position/${position.id}`} className="a_green link">...查看全文</Link>
                  </div>
                ) : position.duties}
              </PositionDescription>
            </Posiiton>
            )) : <EmptyData>
              <p className="explain">暂无招聘数据</p>
              <Link className="button" to={`/resume`}>完善你的简历</Link>
            </EmptyData>}
        </Container>
      </Page>
    );
  }
}

export default PositionList;

const Posiiton = styled.div`{
  position: relative;
  padding: 30px 30px 30px 30px;
  margin-top: 15px;
  background: #fff;
}`;

const PositionTitle = styled.div`
  margin-bottom: 10px;
  font-size: 18px;
  color: #333;
`;

const Salary = styled.span`
  color: red;
  margin-right: 30px;
`;

const Description = styled.span`
  display: inline-block;
  margin-right: 30px;
  color: #999;
`;

const PositionDescription = styled.div`
  margin-top: 10px;
`

const EmptyData = styled.div`
  margin-top: 10px;
  text-align: center;

  .explain {
    margin-top: 100px;
    font-size: 20px;
  }

  .button {
    border: none;
    padding: 0 15px;
    background: #38b447;
    color: #fff;
    outline-style: none;
    border-radius: 3px;
    overflow: hidden;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    cursor: pointer;

    &:hover {
      background: #3ec74f;
    }
  }
`
