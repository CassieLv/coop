const express = require('express');
const router = express.Router();
const sqlQuery = require('../mysqlBook')

router.get('/:bookid',isLoadinMid, async (req, res) => {
    let strSql = "select * from book where id= ? ";
    let bookid = req.params.bookid;
    let result = await sqlQuery(strSql, [bookid]);
    let options = {
        book: result[0]
    }
    res.render('book.ejs', options)
})

// 判断是否登录的中间件
function isLoadinMid(req,res,next) {
    if (req.session.username == undefined) {
        res.render('text',{
            title:"未登录",
            content:"尚未登录，请进入登录页面",
            href:"/login",
            hrefTxt:"登录页"
        })
    } else {
        next()
    }
}

router.get('/out/exitSession', (req, res) => {
    req.session.destroy(() => {
        console.log("销毁session完毕")
    })
    res.send("成功退出！")
})

module.exports = router