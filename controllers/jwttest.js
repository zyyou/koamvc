'use strict';
const router = require('koa-router')();
const jwt = require('jsonwebtoken');
const moment = require('moment');

const controller = require('../lib/controller');
const message = require('../lib/message');

controller.init(router, module);

//模拟登陆
controller.jsonPOST('/login', function (ctx) {

    let data = ctx.request.body;
    if (!data.name || !data.password) {
        return ctx.body = message(true, '用户名或密码错误', {}, 10000);
    }

    let token = jwt.sign({
        name: data.name,
        tm: moment().format('YYYY-MM-DD HH:mm:ss'),
        msg: 'JWT test'
    }, ctx._appConfig.tokenKey, { expiresIn: ctx._appConfig.tokenExpires });


    ctx.res.setHeader('auth_token', token);

    return message(false, 'ok');
});

//测试GET响应JSON
controller.jsonPOST('/getjson', function (ctx) {
    var token = ctx.headers['authorization'];
    return {
        title: 'jwt get json',
        jwtdata: ctx.state.user,
        reqbody: ctx.request.body,
        reqquery: ctx.request.query
    };
});



module.exports = router;