const express = require('express');
const router = express.Router()
const sqlQuery = require('../mysqlBook')
const encryption = require('../crypto')

router.get('/',(req,res,next)=> {
    res.render('login')
})

router.post('/',async(req,res)=> {
    console.log(req.body);
    //根据提交的邮箱和密码判断是否是正确的账号密码
    let strSql = "select * from user where email=? and password = ?"
    let arr = [req.body.email, encryption(req.body.password)]
    let result = await sqlQuery(strSql, arr)
    if (result.length != 0) {
        //登陆成功
        user = result[0];
        console.log(user);
        req.session.username = user.username;
        res.render('text', {
            title: "登陆成功",
            content: "账号密码正确，即将进入首页",
            href: "/",
            hrefTxt: "首页"
        })
    } else {
        res.render('text', {
            title: "登陆失败",
            content: "账号或密码不正确，即将进入登录页",
            href: "/login",
            hrefTxt: "登录页"
        })
    }
})


module.exports = router;