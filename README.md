# Node+Express+MySql实现图书网站

#### 介绍
Node+Express+MySql实现图书网站
![输入图片说明](imagesbanner.png)
![输入图片说明](imagesimage.png)

#### 软件架构
软件架构说明


#### 安装教程

1.  在Navicat软件导入运行sobook.sql文件
2.  进入sobook文件夹打开终端，输入cnpm install，安装依赖包


#### 使用说明

1.   浏览器访问127.0.0.1:8000
2.  访问127.0.0.1:8000/register ， 注册账户以访问图书详情
3.  127.0.0.1:8000/login ，登录账户

#### 简介

1.  编写spider.js文件爬取数据存入数据库，主要运用axios处理http，cheerio库处理获取的数据
2.  封装mysql.js，提高代码的复用性，用于操作数据
3.  ejs渲染模板渲染数据并编写样式
4.  封装crypto.js，对注册写入数据库的密码进行加密，提高安全性
5.  使用路由中间件对每个页面的跳转
6.  session、cookie设置会话存留时间，保证安全性

#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)
