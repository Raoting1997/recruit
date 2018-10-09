import React, { Component } from 'react';
import styled from "styled-components";
import { Link, withRouter } from "react-router-dom";
import userPortrait from '@/images/portrait.png';
import { userLogout } from '@/api/user';
import { clearCookie } from '@/config/util';
import { isLogin } from '@/utils/auth';

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLogin: false
    }
  }

  componentDidMount() {
    this.setState({
      isLogin: isLogin()
    });
  }

  async logout() {
    let res = await userLogout();

    if (res.status == 200) {
      clearCookie('connect.sid');
      this.props.history.push('/login');
    }
  }

  render() {
    return (
      <Head className="global">
        <div className="header clearfix">
          <Logo>Recruit</Logo>
          <Nav>
            <div className="list">
              <Link to={`/position`}>公司</Link>
              <Link to={`/position`} className="active">职位</Link>
            </div>
          </Nav>
          {!this.state.isLogin && <Entry>
            <Link to={`/login`}>登录</Link>
            <Link to={`/register`}>注册</Link>
          </Entry>}
          {this.state.isLogin && <Userinfo>
           <div className="user">
              <div className="profile">
                <img src={userPortrait} />
                <div>
                  <ul>
                    <li><Link to={`/resume`}>我的简历</Link></li>
                    <li><Link to={`/putPosition`}>投递记录</Link></li>
                    <li><a href="javascript:;" onClick={this.logout.bind(this)}>退出</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </Userinfo>}
        </div>
      </Head>
    )
  }
}

const Head = styled.header `
  &.global {
    width: 100%;
    height: 66px;
    background-color: #292e3c;
    position: relative;
    .header {
      width: 1170px;
      margin: 0 auto;
      position: relative;
      background: transparent;
    }
  }
`;

const Logo = styled.div`
  float: left;
  font-size: 30px;
  font-weight: 900;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: -1px;
  line-height: 60px;
  color: #38b447;
`;

const Entry = styled.div`
  float: right;
  line-height: 66px;
  > a {
    display: inline-block;
    font-size: 16px;
    color: #fff;
    margin-left: 20px;

    &:hover {
      color: #38b447;
    }
  }
`;

const Nav = styled.nav`{
  float: left;
  margin-left: 50px;
  .list {
    float: left;
    line-height: 66px;
    font-size: 16px;
    font-weight: bold;

    > a {
      position: relative;
      display: inline-block;
      margin-right: 35px;
      color: #fff;

      &:last-child {
        margin-left: 10px;
      }

      &:hover,
      &.active {
        color: #38b447;
      }
    }
  }
}`;

const Userinfo = styled.div`
  float: right;

  .user {
    position: relative;
    float: left;
    width: 100px;
    margin-left: 28px;
    margin-top: 15px;

    .profile {
      position: relative;
      float: left;
      width: 34px;
      height: 34px;
      cursor: pointer;

      &:hover {
        >div {
          display: block;
        }
      }

      img {
        width: 100%;
        .border-radius(17px);
      }

      >div {
        position: absolute;
        top: 34px;
        left: 50%;
        z-index: 3;
        width: 149px;
        display: none;
        margin-left: -75px;
        overflow: hidden;
      }

      ul {
        border: 1px solid #f1f1f1;
        border-top: 0;
        margin-top: 14px;
        text-align: center;
        font-size: 14px;
        background: #fff;
        .box-shadow(0 1px 1px rgba(7, 0, 2, 0.1));

        >li {
          height: 42px;
          border-bottom: 1px solid #eee;
          line-height: 43px;

          &:last-child {
            border-bottom: none;
          }

          >a {
            display: block;
            width: 100%;
            height: 100%;
            color: #666;

            &:hover {
              color: #38b447;
            }
          }
        }
      }
    }
  }
`;

export default withRouter(Header);
