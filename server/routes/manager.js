const express = require("express");
const router = express.Router();
const users = require("../models/user");
const managers = require("../models/manager");
const resumes = require("../models/resume");
const positions = require("../models/position");
const positionTypes = require("../models/positionType");

// 校验是否登录
function requireAuthentication() {
  return function (req, res, next) {
    if (req.cookies["account"] != null) {
      return next();
    }

    res.json({
      data: "",
      status: 401,
      message: '未登录，请登录'
    });
  }
};

// 管理员登录
router.post("/login", function(req, res) {
  const account = req.body.account;
  const password = req.body.password;

  managers.findOne({ account: account }, function(err, doc) {
    if (!doc) {
      return res.json({
        data: " ",
        status: 403,
        message: "账号不存在"
      });
    }

    if (doc.password != password) {
      return res.json({
        data: " ",
        status: 403,
        message: "密码错误"
      });
    }

    res.cookie("account", { account: account }, {maxAge: 60 * 1000 * 24 * 7 });
    return res.json({
      data: account,
      status: 200,
      message: "登陆成功"
    });
  });
});

// 获取单个用户信息
router.get('/user', requireAuthentication(), function(req, res) {
  users.findOne({ _id: req.query.id }, function(err, doc) {
    if (err) {
      throw err;
      return;
    }

    if (doc) {
      return res.json({
        data: doc,
        status: 200,
        message: "成功"
      });
    } else {
      return res.json({
        data: "",
        status: 403,
        message: "用户不存在"
      });
    }
  });
});

// 获取所有用户信息
router.get("/user/list", requireAuthentication(), function(req, res) {
  users.find({}, function(err, docs) {
    res.json({
      data: docs,
      status: 200,
      message: "成功"
    });
  });
});

// 删除用户
router.post("/user/delete", requireAuthentication(), function(req, res) {
  users.remove({ _id: req.body.id }, function(err) {
    if (err) {
      throw err;
    }

    res.json({
      data: '',
      status: 200,
      message: "删除成功"
    });
  });
});

// 添加用户
router.post("/user/add", requireAuthentication(), function(req, res) {
  users.findOne({ account: req.body.account }, function(err, doc) {
    if (err) {
      throw err;
      return;
    }

    if (doc) {
      return res.json({
        data: "",
        status: 403,
        message: "账户已注册"
      });
    }

    const user = new users(Object.assign({}, req.body, {
      registerDate: new Date()
    }));

    user.save(function() {
      res.json({
        data: '',
        status: 200,
        message: "成功"
      });
    });
  });
});

// 修改用户密码
router.post("/update/password", requireAuthentication(), function(req, res) {
  console.log(req.body);
  users.update({ account: req.body.account }, { password: req.body.password }, function(err) {
    if (err) {
      throw err;
      return;
    }

    res.json({
      data: "",
      status: 200,
      message: "成功"
    });
  });
});

// 查询职位列表
router.get("/position/list", requireAuthentication(), function(req, res) {
  positions.find({}, function(err, doc) {
    if (err) {
      throw err;
    }

    res.json({
      data: doc,
      status: 200,
      message: "成功"
    });
  });
});

// 添加职位
router.post("/position/add", requireAuthentication(), function(req, res) {
  const position = new positions(Object.assign({}, req.body, {
    publishDate: new Date()
  }));

  position.save(function(err) {
    if (err) {
      throw err;
    }

    res.json({
      data: position,
      status: 200,
      message: "添加成功"
    });
  });
});

// 删除职位
router.post("/position/delete", requireAuthentication(), function(req, res) {
  positions.remove({ _id: req.body.id }, function(err) {
    if (err) {
      throw err;
    }

    res.json({
      data: '',
      status: 200,
      message: "删除成功"
    });
  });
});

// 更新简历信息(传递简历的id与要修改的内容)
router.post("/updateResume", requireAuthentication(), function(req, res) {
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
    const resume = new resumes(req.body);
    resume.save(function(err) {
      if (err) {
        throw err;
      }
      res.json({
        data: '',
        status: 200,
        message: "简历已完善"
      });
    });
  }
});

// 获取某个职位信息
router.get("/position/getOnePosition", requireAuthentication(), function(req, res) {
  positions.find({ _id: req.query.id }, function(err, doc) {
    if (err) {
      throw err;
    }
    if (!doc) {
      return res.json({
        data: "",
        status: 403,
        message: "该职位不存在"
      });
    }
    return res.json({
      data: doc[0],
      status: 200,
      message: "成功"
    });
  })
});

// 更新职位信息
router.post("/position/update", requireAuthentication(), function(req, res) {
  positions.update({ _id: req.body._id }, req.body, function(err) {
    if (err) {
      res.json({
        data: "",
        status: 400,
        message: "更新失败"
      });
    }
    res.json({
      data: "",
      status: 200,
      message: "更新成功"
    });
  });
});

// 查询单个用户简历
router.get("/resume", requireAuthentication(), function(req, res) {
  resumes.findOne({ _id: req.query.id }, function(err, doc) {
    if (err) {
      throw err;
    }
    if (doc) {
      return res.json({
        data: doc,
        status: 200,
        message: "成功"
      });
    }
    return res.json({
      data: "",
      status: 403,
      message: "该用户没有简历"
    });
  });
});

// 查询所有简历
router.get("/resume/list", requireAuthentication(), function(req, res) {
  resumes.find({}, function(err, doc) {
    if (err) {
      throw err;
    }

    res.json({
      data: doc,
      status: 200,
      message: "成功"
    });
  });
});

// 删除简历
router.post("/resume/delete", requireAuthentication(), function(req, res) {
  resumes.remove({ _id: req.body.id }, function(err) {
    if (err) {
      throw err;
    }

    res.json({
      data: '',
      status: 200,
      message: "删除成功"
    });
  });
});

// 修改简历
router.post("/resume/update", requireAuthentication(), function(req, res) {
  resumes.update({ _id: req.body.id }, req.body, function(err) {
    if (err) {
      res.json({
        data: "",
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
});

// 修改简历
router.get("/putResume", requireAuthentication(), function(req, res) {
  positions.findOne({ _id: req.query.id }, function(err, doc) {
    if (err) {
      return res.json({
        data: "发生未知错误",
        status: 400,
        message: "失败"
      });
    }
    if (doc) {
      return res.json({
        data: doc.resume_ids,
        status: 200,
        message: "成功"
      });
    }
    return res.json({
      data: "不存在该职位",
      status: 400,
      message: "失败"
    });  
  });
});

// 获取所有职位分类信息
router.get("/category", requireAuthentication(), function(req, res) {
  positionTypes.find({}, function(err, docs) {
    res.json({
      data: docs,
      status: 200,
      message: "成功"
    });
  });
});

// 添加职位分类信息
router.post("/category/add", requireAuthentication(), function(req, res) {
  const type = new positionTypes(req.body);
  positionTypes.findOne({ name: req.body.name }, function(err, doc) {
    if (err) {
      throw err;
    }
    if (doc) {
      return res.json({
        data: '',
        status: 403,
        message: "该职位分类已存在"
      });
    }
    type.save(function(err) {
      if (err) {
        throw err;
      }
  
      res.json({
        data: type,
        status: 200,
        message: "添加成功"
      });
    });
  })
});

module.exports = router;