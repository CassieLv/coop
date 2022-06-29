const express = require('express')
const router = express.Router()
const sqlQuery = require('../mysqlBook')
const encryption = require('../crypto')

router.get('/',(req,res)=> {
    res.render('register')
})

router.post('/',async(req,res)=> {
    // 获取表单提交的邮箱，密码，用户名
    // console.log(req.body);
    let email = req.body.email;
    let password = encryption(req.body.password);
    let username = req.body.username;
    // 判断邮箱是否已注册，如果已注册，将不在注册
    let strSql = "select * from user where email = ?"
    let result = await sqlQuery(strSql,[email])
    console.log(result);
    if(result.length != 0) {
        // 邮箱已注册
        res.render('text',{
            title:'注册失败',
            content:"此邮箱已注册过，可直接登录",
            href:"/register",
            hrefTxt:"注册页"
        })
    } else{
        // 此邮箱尚未注册，可注册
        strSql = "insert into user (username,email,password) values (?,?,?)"
        await sqlQuery(strSql, [username, email, password])
        res.render('text',{
            title:"注册成功",
            content:"注册成功请登录，即将进入登录页面",
            href:"/login",
            hrefTxt:"登录页"
        })
    }
})

module.exports = router