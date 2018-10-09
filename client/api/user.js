import request from '@/config/request';

// 注册
export const userRegister = data => request('/register', data, 'POST');

// 登陆
export const userLogin = data => request('/login', data, 'POST');

// 登出
export const userLogout = data => request('/logout', data, 'POST');

// 获取用户简历
export const userResume = data => request('/resume', data);

// 获取所有职位
export const getAllPosition = data => request('/getPosition', data);

// 获取某个职位
export const getOnePosition = data => request('/getOnePosition', data);

// 获取已经投递的所有简历
export const getPutposition = data => request('/getPutposition', data);

// 投递简历
export const putResume = data => request('/putResume', data, 'POST');

// 完善简历
export const completeResume = data => request('/writeResume', data, 'POST');

// 更新简历
export const updateResume = data => request('/updateResume', data, 'POST');

// 添加职位信息
export const addPosition = data => request('/addPosition', data, 'POST');

// 更新职位信息
export const updatePosition = data => request('/updatePosition', data, 'POST');

// 获取所有职位分类
export const getPositionTypes = data => request('/category', data);