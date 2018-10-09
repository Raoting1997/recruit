import { readCookie } from '@/config/util';

// 登录判断
export const isLogin = () => {
  let token = readCookie('connect.sid');

  return !!token;
}

// 管理后台登录判断
export const managerIsLogin = () => {
  let token = readCookie('account');

  return !!token;
}