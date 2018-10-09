import request from '@/config/request';

// 登陆
export const userLogin = data => request('/manager/login', data, 'POST');

// 登出
export const userLogout = data => request('/manager/logout', data, 'POST');

/* 职位管理 */

// 添加职位
export const addPosition = data => request('/manager/position/add', data, 'POST');

// 职位列表
export const getPositionList = data => request('/manager/position/list', data);

// 删除职位
export const deletePosition = data => request('/manager/position/delete', data, 'POST');

// 获取某个职位信息
export const getOnePosition = data => request('/manager/position/getOnePosition', data);

// 更新职位信息
export const updatePosition = data => request('/manager/position/update', data, 'POST');

/* 用户管理 */

// 获取用户信息
export const getUser = data => request('/manager/user', data);

// 用户列表
export const getUserList = data => request('/manager/user/list', data);

// 添加用户
export const addUser = data => request('/manager/user/add', data, 'POST');

// 删除用户
export const deleteUser = data => request('/manager/user/delete', data, 'POST');

// 修改用户密码
export const updatePassword = data => request('/manager/update/password', data, 'POST');

/* 简历管理 */

// 简历列表
export const getResumeList = data => request('/manager/resume/list', data);

// 获取用户简历
export const userResume = data => request('/manager/resume', data);

// 修改简历
export const updateResume = data => request('/manager/resume/update', data, 'POST');

// 删除简历
export const deleteResume = data => request('/manager/resume/delete', data, 'POST');

// 查看所有已经投递的简历
export const putResume = data => request('/manager/putResume', data);

/* 职位分类管理 */

// 获取所有职位分类
export const positionType = data => request('/manager/category', data);

// 添加职位分类
export const addPositionType = data => request('/manager/category/add', data, 'POST');