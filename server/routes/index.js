const express = require("express");
const router = express.Router();
const users = require("../models/user");
const managers = require("../models/manager");
const resumes = require("../models/resume");
const positions = require("../models/position");
const positionTypes = require("../models/positionType");
const passport = require("../passport-config");

// 注册
router.post("/register", function(req, res) {
  const account = req.body.account;

  // 注册时，用户已经存在
  users.findOne({ account: account }, function(err, doc) {
    if (err) {
      throw err;
      return;
    }

    if (doc) {
      return res.json({
        data: "",
        status: 403,
        message: "手机号已注册"
      });
    }

    // 将数据存入数据库中
    const user = new users(
      Object.assign({}, req.body, {
        registerDate: new Date()
      })
    );

    user.save(function() {
      res.json({
        data: req.body,
        status: 200,
        message: "成功"
      });
    });
  });
});

// 登录
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {

    if (err) {
      return next(err);
    }

    if (!user) {
      return res.json({
        data: '',
        status: 400,
        message: info.message
      });
    }

    req.login(user, function(err) {
      if (err) {
        return next(err);
      }

      return res.json({
        data: '',
        status: 200,
        message: '登录成功'
      });
    });

  })(req, res, next);
});

// 登出
router.post("/logout", function(req, res) {
  req.logout();
  // destroying the session resolves that issue
  req.session.destroy(() => {
    res.json({
      data: "",
      status: 200,
      message: "登出成功"
    });
  });
});

// 个人简历接口（个人信息的展示从个人简历的表中获取，或者直接返回完整信息）
// 请求参数中传递用户账号
router.get("/resume", passport.authenticateMiddleware(), function(req, res) {
  resumes.findOne({ user_id: req.user._id }, function(err, doc) {
    if (err) {
      throw err;
    }
    if (doc) {
      return res.json({
        data: doc,
        status: 200,
        message: "简历存在"
      });
    }
    return res.json({
      data: "",
      status: 403,
      message: "该用户没有简历"
    });
  });
});

// 投递简历接口，将简历的id存入对应的position集合resume_ids字段的数组中
// 请求的参数position的id和简历的id（或者是用户名，根据用户名查找简历的id）
router.post("/putResume", passport.authenticateMiddleware(), function(req, res) {
  // 客户端先获取自己的简历，如果简历存在，发送投递简历请求，将简历的id与简历id传过来，存入position集合的对应数组中
  // 如果简历不存在，提示用户完善简历

  const positionId = req.body.positionId;

  resumes.findOne({ user_id: req.user._id }, function(err, docRE) {
    if (err) {
      throw err;
    }

    if (docRE) {
      const resumeId = docRE._id;
      positions.findOne({ _id: positionId }, function(err, doc) {
        if (err) {
          throw err;
        }
        if (doc) {
          if (doc.resume_id.indexOf(resumeId) !== -1) {
            return res.json({
              data: "",
              status: 403,
              message: "已投递"
            });
          }
          doc.resume_id.push(resumeId);
          doc.resume_ids.push(docRE);
          resumes.findOne({ _id: resumeId }, function(err, docRe) {
            if (err) {
              throw err;
            }
            if (docRe) {
              docRe.position_ids.push(doc);
              docRe.save();
            }
          });
          doc.save();
          return res.json({
            data: "",
            status: 200,
            message: "投递成功"
          });
        }
        return res.json({
          data: "",
          status: 403,
          message: "职位不存在"
        });
      });
    } else {
      return res.json({
        data: "",
        status: 403,
        message: "简历未完善，请完善您的简历"
      });
    }
  });
});

// 获取已经投递的所有职位
router.get("/getPutposition", function(req, res) {
  const resumeId = req.query.resumeId;
  resumes.findOne({ user_id: req.user._id }, function(err, doc) {
    if (err) {
      throw err;
    }
    if (doc) {
      const result = doc.position_ids;
      return res.json({
        data: result,
        status: 200,
        message: "成功"
      });
    }
    return res.json({
      data: "",
      status: 403,
      message: "暂无投递记录"
    });
  });
});

// 获取所有职位信息
router.get("/getPosition", function(req, res) {
  positions.find({}, function(err, doc) {
    if (err) {
      throw err;
    }
    if (!doc) {
      return res.json({
        data: "",
        status: 403,
        message: "没有职位"
      });
    }
    return res.json({
      data: doc,
      status: 200,
      message: "成功"
    });
  });
});

// 获取某个职位信息
router.get("/getOnePosition", function(req, res) {
  positions
    .find({ _id: req.query.id })
    .lean()
    .then((doc) => {
      if (!doc) {
        return res.json({
          data: "",
          status: 403,
          message: "该职位不存在"
        });
      }

      if (req.user) {
        resumes.findOne({ user_id: req.user._id }, function(err, resumeDoc) {

          if (err) {
            throw err;
          }

          if (resumeDoc) {
            return res.json({
              data: Object.assign({}, doc[0], { resumeId: resumeDoc._id }),
              status: 200,
              message: "简历存在"
            });
          } else {
            return res.json({
              data: doc[0],
              status: 200,
              message: "简历存在"
            });
          }
        });
      } else {
        return res.json({
          data: doc[0],
          status: 200,
          message: "成功"
        });
      }
    })
    .catch(err => {
      throw err;
    });
});

// 更新简历信息(传递简历的id与要修改的内容)
router.post("/updateResume", passport.authenticateMiddleware(), function(req, res) {
  if (req.body.id) {
    resumes.update({ _id: req.body.id }, req.body, function(err) {
      if (err) {
        res.json({
          data: "简历不存在",
          status: 400,
          message: "失败"
        });
      }
      res.json({
        data: "已修改",
        status: 200,
        message: "成功"
      });
    });
  } else {
    const data = Object.assign({}, req.body, { user_id: req.user._id });
    const resume = new resumes(data);
    resume.save(function(err) {
      if (err) {
        throw err;
      }
      res.json({
        data: "",
        status: 200,
        message: "简历已完善"
      });
    });
  }
});

// 获取所有职位分类信息
router.get("/category", function(req, res) {
  positionTypes.find({}, function(err, docs) {
    res.json({
      data: docs,
      status: 200,
      message: "成功"
    });
  });
});

module.exports = router;
