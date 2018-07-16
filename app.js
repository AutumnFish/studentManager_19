// 导入模块-----------------------------
// express
let express = require('express');
// svg-captcha 验证码
let svgCaptcha = require('svg-captcha');
// path模块 内置模块
let path = require('path');
// 导入 session模块
let session = require('express-session');




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
    req.session.captcha = captcha.text;
    res.type('svg');
    res.status(200).send(captcha.data);
})


// 开始监听
app.listen(8848, '127.0.0.1', () => {
    console.log('success');
})