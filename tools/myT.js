// 封装数据库的操纵逻辑
const MongoClient = require('mongodb').MongoClient;

// 数据库地址
// localhost 虽然也是本机 最终还是要对应一个ip地址
// const url = 'mongodb://localhost:27017';
const url = 'mongodb://127.0.0.1:27017';

// 
const dbName = 'SZHM19';




// 暴露出去
// es6的快速赋值
module.exports = {
    // 发送信息 并且跳转的功能
    mess(response, mess, url) {
        response.setHeader('content-type', 'text/html');
        response.send(`<script>alert("${mess}");window.location="${url}"</script>`);
    },
    // 提供对应的方法
    // 查询
    find(collectionName, query, callback) {
        MongoClient.connect(url, {
            useNewUrlParser: true
        }, function (err, client) {
            // 使用某个库
            const db = client.db(dbName);
            // 查询逻辑
            db.collection(collectionName).find(query).toArray((err, docs) => {
                // 增 删 改 查
                client.close();
                callback(err, docs);
            })
        });
    },
    // 新增
    insert(collectionName, doc, callback) {
        MongoClient.connect(url, {
            useNewUrlParser: true
        }, function (err, client) {
            // 使用某个库
            const db = client.db(dbName);
            // 新增逻辑
            db.collection(collectionName).insertOne(doc, (err, result) => {
                client.close();
                // 传递出去
                callback(err, result);
            })
        });
    },
    // 删除
    delete(collectionName, query, callback) {
        MongoClient.connect(url, {
            useNewUrlParser: true
        }, function (err, client) {
            // 使用某个库
            const db = client.db(dbName);
            // 新增逻辑
            db.collection(collectionName).deleteOne(query, (err, result) => {
                client.close();
                callback(err, result);
            })
        });
    },
    // 修改
    // 集合名 查询条件 修改的内容 修改成功之后回调
    update(collectionName, query, doc, callback) {
        MongoClient.connect(url, {
            useNewUrlParser: true
        }, function (err, client) {
            // 使用某个库
            const db = client.db(dbName);
            // 新增逻辑
            db.collection(collectionName).updateOne(query, {
                $set: doc
            }, (err, result) => {
                client.close();
                callback(err, result);
            })
        });
    }
}