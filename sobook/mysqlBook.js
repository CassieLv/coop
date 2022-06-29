const mysql = require('mysql');

let options = {
    host:"localhost",
    user:"root",
    password:"123456",
    database:"book"
}
let connection = mysql.createConnection(options);

// 建立连接
connection.connect((err)=> {
    if (err) {
        console.log(err);
    } else {
        console.log("数据库连接成功");
    }
})

function sqlQuery(strSql,arr) {
    return new Promise((resolve,reject)=> {
        connection.query(strSql,arr,(err,results)=> {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
}

module.exports = sqlQuery;