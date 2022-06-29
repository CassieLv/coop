let mysql = require('mysql')
let axios = require('axios')
let cheerio = require('cheerio');

let options = {
    host:'localhost',
    user:'root',
    password:'123456',
    database:'book'
}
let connection = mysql.createConnection(options);
connection.connect()


let page = 116;
//获取第N个页面所有书籍的链接
async function getPageUrl(num) {
    let httpUrl = "https://sobooks.cc/page/" + num;
    let res = await axios.get(httpUrl)
    //console.log(res.data)
    let $ = cheerio.load(res.data)
    let hrefList = []
    $("#cardslist .card-item .thumb-img>a").each((i, ele) => {
        let href = $(ele).attr("href")
        //console.log(i)
        //console.log(href)
        //根据地址访问书籍详情页面
        hrefList.push(href)
    })
    let arr3 = []
    $('.widget ul li a').each((i, ele) => {
        let titles = $(ele).text()
        let recently = $(ele).attr('href')
        arr3.push(recently)
        arr3.push(titles)
        
    })
    let strSql2 = "insert into info (recently,titles) values (?,?),(?,?),(?,?),(?,?),(?,?),(?,?),(?,?),(?,?),(?,?),(?,?),(?,?),(?,?),(?,?),(?,?),(?,?),(?,?),(?,?),(?,?),(?,?)"
    await sqlQuery(strSql2, arr3)
    return hrefList.reduce((p,href,i)=> {
        return new Promise(async (resolve,reject)=> {
            await p;
            await getBookInfo(href);
            console.log(`--第${page}页，第${i+1}本书--`);
            if (i == 31) {
                page++;
                getPageUrl(page)
            }
            resolve()
        })
    },Promise.resolve())

}

async function getBookInfo(href) {
    let res = await axios.get(href);
    let $ = cheerio.load(res.data);
    //书籍图片
    let bookimg = $('.article-content .bookpic img').attr('src');
    //书籍名称
    let bookname = $(".article-content .bookinfo li:nth-child(1)").text()
    bookname = bookname.substring(3, bookname.length)
    //书籍作者
    let author = $(".article-content .bookinfo li:nth-child(2)").text()
    author = author.substring(3, author.length)
    let viewcount = $(".article-content .bookinfo li:nth-child(3)").text()
    viewcount = viewcount.substring(3, viewcount.length - 1)
    let tag = $(".article-content .bookinfo li:nth-child(4)").text()
    tag = tag.substring(3, tag.length)

    let pubtime = $(".article-content .bookinfo li:nth-child(5)").text()
    pubtime = pubtime.substring(3, pubtime.length)

    let score = $(".article-content .bookinfo li:nth-child(6) b").attr("class")
    score = score[score.length - 1];

    let pubcompany = $(".article-content .bookinfo li:nth-child(7)").text();
    pubcompany = pubcompany.substring(5, pubcompany.length);

    // let recently =  $('.widget ul li a').attr('href')
    // console.log(recently);
       
    // let titles = $('.widget ul li a').text();
    // console.log(titles);

    
    // console.log(arr3);
    // var arr4 = new Array()
    // for(var i=0;i<arr3.length-1;i++) {
    //     arr4.push([arr3[i],arr3[i+1]])
    // }
    // console.log(arr4);

    let cataory = $("#mute-category > a").text().trim()
    // console.log(bookimg, bookname)
    let brief = $(".article-content").html();
    let bookUrl = href;

    let arr = [bookname, author, viewcount, tag, pubtime, score, pubcompany, bookimg, cataory, brief, bookUrl]
    // console.log(arr)
    //插入数据库
    let strSql = "insert into book (bookname, author, viewcount, tag, pubtime, score, pubcompany, bookimg, cataory, brief, bookUrl) values (?,?,?,?,?,?,?,?,?,?,?)"
    
    try {
        await sqlQuery(strSql,arr)
        
        console.log('书籍写入成功：',bookname);
    } catch (error) {
        console.log('书籍写入不成功',error);
    }
}

getPageUrl(page)
//let tempBook = "https://sobooks.cc/books/14692.html";
//getBookInfo(tempBook);

function sqlQuery(strSql,arr) {
    return new Promise((resolve,reject)=> {
        connection.query(strSql,arr,(err,res)=> {
            if (err) {
                reject(err)
            } else {
                resolve(res)
            }
        })
    })
}

