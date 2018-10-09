import React, { Component } from 'react';
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { Menu } from 'element-react';
import userPortrait from '@/images/portrait.png';
import { clearCookie } from '@/config/util';

class Header extends Component {
  constructor(props, context) {
    super(props);
  }

  async logout() {
    clearCookie('account');
    this.props.history.push('/manager/login');
  }

  render() {
    return (
      <Head className="header">
        <div className="logo">Recruit</div>
        <Userinfo>
          <div className="user">
            <div className="profile">
              <img src={userPortrait} />
              <div>
                <ul>
                  <li><a href="javascript:;" onClick={this.logout.bind(this)}>退出</a></li>
                </ul>
              </div>
            </div>
          </div>
        </Userinfo>
        <Menu theme="dark" defaultActive="1" className="el-menu-demo" mode="horizontal">
          <Menu.Item index="1">后台</Menu.Item>
        </Menu>
      </Head>
    )
  }
}

export default withRouter(Header);

const Head = styled.div`{
  .el-menu {
    margin-right: 130px;
  }
}`

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