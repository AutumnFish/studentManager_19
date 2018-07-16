// 导入模块-----------------------------
// express
let express = require('express');
// svg-captcha 验证码
let svgCaptcha = require('svg-captcha');
// path模块 内置模块
let path = require('path');
// 导入 session模块
let session = require('express-session');
// 导入body-parser 格式化表单的数据
let bodyParser = require('body-parser');
// 导入mongoDB 
const MongoClient = require('mongodb').MongoClient;
// mongoDB 需要使用到的 配置
// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'SZHM19';




// 创建app-------------------------
let app = express();

// 设置托管静态资源
app.use(express.static('static'));
// 使用 session中间件
// 每个路由的 req对象中 增加 session这个属性
// 每个路由中 多了一个 可以访问到的 session 属性 可以再他身上 保存 需要共享的属性
// 
app.use(session({
    secret: 'keyboard cat love west blue flower hahahaha'
}))

// 使用 bodyParser 中间件
app.use(bodyParser.urlencoded({
    extended: false
}))


// 路由--------------------------
// 路由1
// 使用get方法 访问登陆页面时 直接读取登录页面 并返回
app.get('/login', (req, res) => {
    // 打印session
    // console.log(req.session);
    // req.session.info = '你来登录页啦';
    // 直接读取文件并返回
    res.sendFile(path.join(__dirname, 'static/views/login.html'));
})

// 路由2
// 使用post 提交数据过来 验证用户登陆
app.post('/login', (req, res) => {
    // 获取form表单提交的数据
    // 接收数据
    // 比较数据
    let userName = req.body.userName;
    let userPass = req.body.userPass;
    // 验证码
    let code = req.body.code;
    // 跟 session中的验证码进行比较
    if (code == req.session.captcha) {
        // console.log('验证码正确');
        // 设置session
        req.session.userInfo = {
            userName,
            userPass
        }
        // 去首页
        res.redirect('/index');
    } else {
        // console.log('失败');
        // 打回去
        // res.redirect('/login');
        res.setHeader('content-type', 'text/html');
        res.send('<script>alert("验证码失败");window.location.href="/login"</script>');
    }


    // res.send('login');
})

// 路由3
// 生成图片的功能
// 把这个地址 设置给 登录页的 图片的 src属性
app.get('/login/captchaImg.png', (req, res) => {
    // 生成了一张图片 并返回
    var captcha = svgCaptcha.create();
    // 打印验证码
    console.log(captcha.text);
    // 获取session中的值
    // console.log(req.session.info);
    // 保存 验证码的值 到 session 方便后续的使用
    // 为了比较时简单 直接转为小写
    req.session.captcha = captcha.text.toLocaleLowerCase();
    res.type('svg');
    res.status(200).send(captcha.data);
})

// 路由4
// 访问首页 index
app.get('/index', (req, res) => {
    // 有session 欢迎
    if (req.session.userInfo) {
        // 登陆了
        res.sendFile(path.join(__dirname, 'static/views/index.html'));
    } else {
        // 没有session 去登录页
        res.setHeader('content-type', 'text/html');
        res.send("<script>alert('请登录');window.location.href='/login'</script>");
    }
})

// 路由5
// 登出操作
// 删除 session的值即可
app.get('/logout', (req, res) => {
    // 删除session中的 userInfo
    delete req.session.userInfo;

    // 去登录页即可
    res.redirect('/login');
})

// 路由6
// 展示注册页面
app.get('/register', (req, res) => {
    // 直接读取并返回注册页
    res.sendFile(path.join(__dirname, 'static/views/register.html'));
})

// 路由7
app.post('/register', (req, res) => {

    // 获取用户数据
    let userName = req.body.userName;
    let userPass = req.body.userPass;
    console.log(userName);
    console.log(userPass);

    MongoClient.connect(url,  (err, client)=>{
        // 连上mongo之后 选择使用的库
        const db = client.db(dbName);
        // 选择使用的集合
        let collection = db.collection('userList');

        // 查询数据
        collection.find({
            userName
        }).toArray((err,doc)=>{
            console.log(doc);
            if(doc.length==0){
                // 没有人
                // 新增数据
                collection.insertOne({
                    userName,
                    userPass
                },(err,result)=>{
                    console.log(err);
                    // 注册成功了
                    res.setHeader('content-type','text/html');
                    res.send("<script>alert('欢迎入坑');window.location='/login'</script>")
                    // 关闭数据库连接即可
                    client.close();
                })
            }
        })
        
    });
})


// 开始监听
app.listen(8848, '127.0.0.1', () => {
    console.log('success');
})