const passport = require('passport');
const LocalStrategy = require('passport-local');
const users = require("./models/user");

passport.use(new LocalStrategy({
    usernameField: 'account',
    passwordField: 'password'
  },

  /**
   * @param username 用户输入的用户名
   * @param password 用户输入的密码
   * @param next 验证验证完成后的回调函数，由passport调用
   */
  function (username, password, next) {
    users.findOne({ account: username }, function(err, user) {

      if (err) {
        return next(err);
      }

      if (!user) {
        return next(null, false, { message: '用户不存在' });
      }

      if (user.password != password) {
        return next(null, false, { message: '密码错误' });
      }

      return next(null, user);
    });
  }
));

// serializeUser 在用户登录验证成功以后将会把用户的数据存储到 session 中（在这里
// 存到 session 中的是用户的 username）。在这里的 user 应为我们之前在 new
// LocalStrategy (fution() { ... }) 中传递到回调函数 next 的参数 user 对象（从数据// 库中获取到的）
passport.serializeUser(function(user, next) {
  console.log(user);
  next(null, user.account);
});

// deserializeUser 在每次请求的时候将会根据用户名读取 从 session 中读取用户的全部数据
// 的对象，并将其封装到 req.user
passport.deserializeUser(function (username, next) {
  users.findOne({ account: username }, function(err, user) {
    if (err) {
      return next(err);
    }
    next(null, user);
  });
});

// 封装中间件函数到 passport 中，可以在需要拦截未验证的用户的请求的时候调用
passport.authenticateMiddleware = function authenticationMiddleware() {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    res.json({
      data: "",
      status: 401,
      message: "未登录"
    });
  }
};

module.exports = passport;