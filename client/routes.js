import React, { Component } from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import { App } from 'routers';
import Login from '@/pages/login';
import Register from '@/pages/register';
import PositionList from '@/pages/position_list';
import PositionDetail from './pages/position_detail';
import Resume from './pages/resume';
import PutPosition from './pages/put_position';
import { ManagerLogin } from 'routers';
import { isLogin, managerIsLogin } from '@/utils/auth';

class Routers extends Component {

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={PositionList} />
          <Route path="/position/:id" component={PositionDetail} />
          <Route path="/position" component={PositionList} />
          <Route path="/resume" component={props => (!isLogin() ? <Login {...props} /> : <Resume {...props} /> )}/>
          <Route path="/login" component={props => (isLogin() ? <Redirect to='/' /> : <Login {...props} /> )} />
          <Route path="/register" component={props => (isLogin() ? <Redirect to='/' /> : <Register {...props} /> )} />
          <Route path="/PutPosition" component={props => (!isLogin() ? <Login {...props} /> : <PutPosition {...props} />)} />
          <Route path="/manager/login" component={props => (!managerIsLogin() ? <ManagerLogin {...props} /> : <App {...props} />)}  />
          <Route path="/manager" component={App} />
          <Route path="/error" render={(props) => <div><h1>404 Not Found!</h1></div>}/>
          <Route path="*" render={(props) => <Redirect to='/error'/>}/>
        </Switch>
      </Router>
    )
  }
}

export default Routers;