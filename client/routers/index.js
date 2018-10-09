import React from 'react';
import Bundle from '../components/bundle';
import loaderApp from 'bundle-loader?lazy&name=app!../base';
import loaderLogin from 'bundle-loader?lazy&name=login!../pages/manager/login';
import loaderPositon from 'bundle-loader?lazy&name=position!../pages/manager/position';

import loaderAddPosition from 'bundle-loader?lazy&name=positionAdd!../pages/manager/add-position';
import loaderUser from 'bundle-loader?lazy&name=user!../pages/manager/user';
import loaderUserDetail from 'bundle-loader?lazy&name=userDetail!../pages/manager/user-detail';
import loaderResume from 'bundle-loader?lazy&name=resume!../pages/manager/resume';
import loaderResumeDetail from 'bundle-loader?lazy&name=resumeDetail!../pages/manager/resume-detail';
import loaderPutResume from 'bundle-loader?lazy&name=putResume!../pages/manager/put-resume';
import loaderCategory from 'bundle-loader?lazy&name=category!../pages/manager/category';

// App
export const App = (props) => (
    <Bundle load={loaderApp}>
        {(App) => <App {...props} />}
    </Bundle>
)

// Login
export const ManagerLogin = (props) => (
    <Bundle load={loaderLogin}>
        {(Login) => <Login {...props} />}
    </Bundle>
)

// Position
export const Position = (props) => (
    <Bundle load={loaderPositon}>
        {(Position) => <Position {...props} />}
    </Bundle>
)

// AddPosition
export const AddPosition = (props) => (
    <Bundle load={loaderAddPosition}>
        {(AddPosition) => <AddPosition {...props} />}
    </Bundle>
)

// User
export const User = (props) => (
    <Bundle load={loaderUser}>
        {(User) => <User {...props} />}
    </Bundle>
)

// UserDetail
export const UserDetail = (props) => (
    <Bundle load={loaderUserDetail}>
        {(UserDetail) => <UserDetail {...props} />}
    </Bundle>
)

// Resume
export const Resume = (props) => (
    <Bundle load={loaderResume}>
        {(Resume) => <Resume {...props} />}
    </Bundle>
)

// ResumeDetail
export const ResumeDetail = (props) => (
    <Bundle load={loaderResumeDetail}>
        {(ResumeDetail) => <ResumeDetail {...props} />}
    </Bundle>
)

// PutResume
export const PutResume = (props) => (
    <Bundle load={loaderPutResume}>
        {(PutResume) => <PutResume {...props} />}
    </Bundle>
)

// Category
export const Category = (props) => (
    <Bundle load={loaderCategory}>
        {(Category) => <Category {...props} />}
    </Bundle>
)