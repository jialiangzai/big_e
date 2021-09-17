// 入口函数
$(function () {
    // 点击a显示和隐藏
    $('#loginBox a').on('click', function () {
        $('#regBox').show()
        $('#loginBox').hide()
    })


    $('#regBox a').on('click', function () {
        $('#loginBox').show()
        $('#regBox').hide()
    })
    // 定义校验规则 当导入layui的js.all文件的时候就会有layui这个对象，添加自定义校验规则就是layui.form表单的一个一个方法verify，参数是一个对象，对象的属性是校验的名称，值是校验规则，值是校验规则又分为对象和数组形式,对象形式的参数有两个 function(value, item){} //value：表单的值、item：表单的DOM对象，通过正则的test(value)验证 ；//数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]lay-verify="required|email|usename" 属性值是字符串不能有空格

    let form = layui.form
    form.verify({
        usename: [/^[A-z0-9]{1,10}$/,
            '用户名必须1到10位，且不能出现空格'
        ],
        pwd: [
            /^[A-z0-9]{6,10}$/,
            '密码必须1到10位数字或者字母，且不能出现空格'
        ],
        repwd: function (value) {
            //判断值是否相同 属性选择器
            let pwd = $('#regBox input[name=password]').val()
            // 出错的情况
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    });
    // 实现功能
    let layer = layui.layer
    $('#formReg').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault();
        // 发送请求
        axios({
            method: 'POST',
            url: '/api/reguser',
            // axios中的ajax参数根据类型不同头信息也不同 
            // jquery的ajax参数都是固定的
            data: $(this).serialize(),//这里的this指向事件源$('#formReg')
        }).then(function (res) {
            // console.log(res.data);
            if (res.data.status !== 0) {
                return layer.msg(res.data.message)
            }
            // 成功的提示
            layer.msg("恭喜您，注册用户成功", { icon: 6 });
            // 切换登录模块
            $('#regBox a').click()
            // 清空表单 
            $('#formReg')[0].reset()
        })
    })
    //登录功能
    $('#formLogin').on('submit', function (e) {
        e.preventDefault()
        // axios发送ajax
        axios({
            method: 'POST',
            url: '/api/login',
            // axios的data参数类型会控制content-type属性的值
            data: $(this).serialize()
        }).then(res => {
            if (res.data.status !== 0) {
                return layer.msg(res.data.message, { icon: 5 })
            }
            layer.msg(res.data.message, { icon: 6 })
            // 保存token  /my 开头的请求路径，需要在请求头中携带 Authorization 身份认证字段，才能正常访问成功
            localStorage.setItem('token', res.data.token)
            // 跳转
            location.href = '/index.html'
        })
    })
})