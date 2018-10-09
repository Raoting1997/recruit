import React, { Component } from 'react';
import {
  Route,
  NavLink,
  Switch,
  Redirect
} from 'react-router-dom';

import Header from './header';
import Sidebar from './sidebar';
import { Position, AddPosition, User, UserDetail, Resume, ResumeDetail, PutResume, Category } from 'routers';
import { managerIsLogin } from '@/utils/auth';
import { ManagerLogin } from 'routers';

// 登录验证
function requireAuth(Layout, props) {
  if (!managerIsLogin()) { // 未登录
    return <Redirect to="/manager/login" {...props} />;
  } else {
    return <Layout {...props} />;
  }
}

export default class App extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    const { match, location } = this.props;
    return (
      <div id="wrapper" className="wrapper">
        <Header />
        <Sidebar />
        <div className="container">
          <Switch>
            <Route path={match.path} exact component={props => requireAuth(User, props)} />
            <Route path={`${match.path}/user/add`} component={props => requireAuth(UserDetail, props)} />
            <Route path={`${match.path}/user/:userId`} component={props => requireAuth(UserDetail, props)} />
            <Route path={`${match.path}/user`} component={props => requireAuth(User, props)} />
            <Route path={`${match.path}/position/add`} component={props => requireAuth(AddPosition, props)} />
            <Route path={`${match.path}/position/putResume/:positionId`} component={props => requireAuth(PutResume, props)} />
            <Route path={`${match.path}/position/:positionId`} component={props => requireAuth(AddPosition, props)} />
            <Route path={`${match.path}/position`} component={props => requireAuth(Position, props)} />
            <Route path={`${match.path}/resume/:resumeId`} component={props => requireAuth(ResumeDetail, props)} />
            <Route path={`${match.path}/resume`} component={props => requireAuth(Resume, props)} />
            <Route path={`${match.path}/category`} component={props => requireAuth(Category, props)} />
          </Switch>
        </div>
      </div>
    )
  }
}