const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const passport = require('./passport-config');

const client = require('./routes/index');
const manager = require('./routes/manager');
const managers = require('./models/manager');

const app = express();

app.use(expressSession({
    // 加密用的字符串
    secret: 'this is recruit system',
    resave: false,
    cookie: {
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    saveUninitialized: false,
    store: new MongoStore({
        url: 'mongodb://localhost/recruit',
        autoRemove: 'interval',
        autoRemoveInterval: 60, // Removes expired sessions every hour
        collection: 'sessions',
        stringify: false
    })
}));

// 初始化调用 passport
app.use(passport.initialize());
app.use(passport.session());

app.use(favicon(path.resolve(__dirname, "../public/favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "../public")));
app.use('/api/manager', manager);
app.use('/api', client);

app.set("port", process.env.PORT || 3000);

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

if (!process.env.SERVER_TYPE) {
    process.env.SERVER_TYPE = 'api';
}

// 连接数据库
mongoose.connect("mongodb://localhost/recruit");
mongoose.connection
    .on("error", (err) => {
        console.log(err);
    })
    .once("open", function() {
        console.log("数据库连接成功");
        app.listen(app.get("port"), err => {
            if (err) {
                throw err;
            }
            console.log("server start on port : " + app.get("port"));
        });
    });

// 添加了一个管理员账号，执行一次就添加了，执行一次后删除
// const man = new managers({account: '15591616652', password: '123456'});
// man.save();

module.exports = app;