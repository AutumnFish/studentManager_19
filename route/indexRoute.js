// 路由中间件
var express = require('express');
let indexRoute = express.Router();
// 引入path模块
let path = require('path');
// 导入myT
let myT = require(path.join(__dirname,'../tools/myT'));
// 使用mongoDB包装id 
// id 需要使用 mongoDB.ObjectId 这个方法 进行包装 才可以使用
let objectID = require('mongodb').ObjectId;


// 注册路由
// 访问根目录的路由
indexRoute.get('/', (req, res) => {
    // 有session 欢迎
    if (req.session.userInfo) {
        // 获取用户名
        let userName = req.session.userInfo.userName;
        // 登陆了
        // res.sendFile(path.join(__dirname, '../static/views/index.html'));
        // 使用模板引擎 渲染页面 并且返回
        res.render(path.join(__dirname,'../static/views/index.art'), {
            userName
        });
    } else {
        // 没有session 去登录页
        res.setHeader('content-type', 'text/html');
        res.send("<script>alert('请登录');window.location.href='/login'</script>");
    }
})

//----------------------接口----------------------------
// 增
indexRoute.get('/insert',(req,res)=>{
    // 接收数据
    // console.log(req.query);
    // 保存数据
    // 接口 json格式
    // 写一个js对象 json_
    myT.insert('studentList',req.query,(err,result)=>{
        if(!err) res.json({
            mess:'新增成功',
            code:200
        })
    })
    // 提示用户
})

// 删
// key id
indexRoute.get('/delete',(req,res)=>{
    // 接收数据
    let delerteId = req.query.id;
    // 删除数据
    myT.delete('studentList',{_id:objectID(delerteId)},(err,result)=>{
        if(!err)res.json({
            mess:'删除成功',
            code:200
        })
    })
    // 提示用户
    // res.send('delete');
})

// 改
// id,name,age,friend
indexRoute.get('/update',(req,res)=>{
    // 接收数据
let address = req.query.address;
let age = req.query.age;
let introduction = req.query.introduction;
let name = req.query.name;
let phone = req.query.phone;
let sex = req.query.sex;

"5b4da627f899f131b0a8887b"
    // 修改数据
    myT.update('studentList',{_id:objectID(req.query.id)},{address,age,introduction,name,phone,sex},(err,result)=>{
        if(!err)res.json({
            mess:'修改成功',
            code:200
        })
    })
})

// 获取所有数据
indexRoute.get('/list',(req,res)=>{
    // 来就给你所有的东西
    myT.find('studentList',{},(err,docs)=>{
        if(!err) res.json({
            mess:"数据",
            code:200,
            list:docs
        });
    })
})

// 根据名字获取数据
// 需要传递参数 userName过来
// 目前只能根据用户名进行模糊查询
// 增加能够根据id精确查询的功能
indexRoute.get('/search',(req,res)=>{
    // 定义查询的对象
    let query  ={};

    // 用户名过来
    if(req.query.userName){
        query.name = new RegExp(req.query.userName);
    }
    // 有id过来
    if(req.query.id){
        query._id = objectID(req.query.id);
    }
    // console.log(name);
    // 来就给你所有的东西
    // mongoDB模糊查询 使用正则表达式
    myT.find('studentList',query,(err,docs)=>{
        if(!err)  res.json({
            mess:"数据",
            code:200,
            list:docs
        });
    })
})


// 暴露出去
module.exports = indexRoute;