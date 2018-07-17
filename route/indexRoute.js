// 路由中间件
var express = require('express');
let indexRoute = express.Router();
// 引入path模块
let path = require('path');


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

// 写接口
indexRoute.get('/search',(req,res)=>{
    res.send('result');
})

// 暴露出去
module.exports = indexRoute;