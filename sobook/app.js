var express = require('express');
var path = require('path');
const sqlQuery = require('./mysqlBook');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session')

let bookRouter = require('./routes/bookRouter')
let loginRouter = require('./routes/loginRouter')
let registerRouter = require('./routes/registerRouter');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 设置静态目录
app.use(express.static(path.join(__dirname, 'public')));
// 引入session
app.use(session({
  secret: "xzsagjasoigjasoi",
  resave:true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000
  },
  saveUninitialized:true
}))
// 引入cookie中间件
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser('secret'))

app.get('/', async (req, res) => {
  let page = 1
  let strSql = "select id,bookname,bookimg,author,cataory,bookUrl from book limit ?,20"
  let strSql2 = "select id,recently,titles from info limit 0,19";
  let arr = [(page - 1) * 20]
  let result = await sqlQuery(strSql, arr);
  let result2 = await sqlQuery(strSql2);

  // 总页数
  let strSql3 = "select count(id) as num from book where cataory in (select cataory from cataory where id = ?)"
  let result3 = await sqlQuery(strSql3, arr);
  let pageAll = Math.ceil(result3[0].num / 20)
  let cid = 0

  // 分页
  let startPage = (page - 4) < 1 ? 1 : (page - 4);
  let endPage = (page + 5) > pageAll ? pageAll : (page + 5);

  let options = {
    books: Array.from(result),
    cataorys: await getCataory(),
    infos: Array.from(result2),
    pageAll,
    page,
    cid,
    startPage,
    endPage
  }

  // console.log(result2);
  res.render('home.ejs', options);
})

// 首页每本书的路由
app.use('/books',bookRouter)
app.use('/login',loginRouter)
app.use('/register', registerRouter)

// 分类模块的路由
// app.get('/cataory/:cataoryid', async (req, res) => {
//   let strSql = "SELECT id,bookname,bookimg,author,cataory FROM book WHERE cataory in (SELECT cataory FROM cataory where id = ?) limit 0,20"
//   let arr = [req.params.cataoryid];
//   let result = await sqlQuery(strSql, arr);
//   let strSql2 = "select id,recently,titles from info limit 0,19";
//   let result2 = await sqlQuery(strSql2);
//   let options = {
//     books: Array.from(result),
//     cataorys: await getCataory(),
//     infos: Array.from(result2)
//   }
//   // console.log(cataorys);
//   res.render('home.ejs', options)
// })

// 关键字搜索的路由
app.get('/search/:searchKey', async (req, res) => {
  let strSql = 'SELECT  id,bookname,bookimg,author,cataory from book  where bookname LIKE "%' + req.params.searchKey + '%"or author like "%' + req.params.searchKey + '%" limit 0,20 '
  let result = await sqlQuery(strSql);
  let strSql2 = "select id,recently,titles from info limit 0,19";
  let result2 = await sqlQuery(strSql2);
  let options = {
    books: Array.from(result),
    cataorys: await getCataory(),
    infos: Array.from(result2)
  }
  res.render('home.ejs', options)
})

// 上下页的路由
app.get('/cataory/:cid/page/:pid', async (req, res) => {
  let page = parseInt(req.params.pid)
  let strSql;
  let arr;
  let result;
  let strSql2;
  let result2;

  if (req.params.cid == 0) {
    strSql = "select id,bookname,bookimg,author,cataory from book limit ?,20"
    arr = [(page - 1) * 28];
    result = await sqlQuery(sqlStr, arr)
    strSql = "select count(id) as num  from book"
    strSql2 = "select id,recently,titles from info limit 0,19";
    result2 = await sqlQuery(strSql2);
  } else {
    strSql = "select id,bookname,bookimg,author,cataory from book WHERE cataory in (SELECT cataory from cataory WHERE id = ?) limit ?,20"
    arr = [req.params.cid, (page - 1) * 28];
    result = await sqlQuery(strSql, arr)
    strSql = "select count(id) as num  from book WHERE cataory in (SELECT cataory from cataory WHERE id = ?)"
    strSql2 = "select id,recently,titles from info limit 0,19";
    result2 = await sqlQuery(strSql2);
  }

  // 总页数
  let strSql3 = "select count(id) as num from book where cataory in (select cataory from cataory where id = ?)"
  let result3 = await sqlQuery(strSql3, arr);
  let pageAll = Math.ceil(result3[0].num / 20)
  let cid = req.params.cid

  // 分页
  let startPage = (page - 4) < 1 ? 1 : (page - 4);
  let endPage = (page + 5) > pageAll ? pageAll : (page + 5);

  let options = {
    books: Array.from(result),
    cataorys: await getCataory(),
    infos: Array.from(result2),
    pageAll,
    page,
    cid,
    startPage,
    endPage
  }
  // console.log(cataorys);
  res.render('home.ejs', options)
})

async function getCataory() {
  // 获取所有分类
  let sqlStr = "select * from cataory";
  let result = await sqlQuery(sqlStr);
  return Array.from(result)
}
// console.log( getCataory());

module.exports = app;