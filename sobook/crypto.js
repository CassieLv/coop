const crypto = require('crypto');

function encryption(str) {
    // 加盐，盐值就是随机数，用于在计算密码的哈希值时加强数据的安全性
    let salt = "qscftyjmkopfh";
    // MD5加密方式
    let md5 = crypto.createHash('md5');
    str = salt + str
    // 数据以流的方式写入
    md5.update(str);
    // 计算数据的哈希值
    return md5.digest('hex')
}

module.exports = encryption;