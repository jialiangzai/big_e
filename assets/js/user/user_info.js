$(function () {
    // 校验第二个
    let form = layui.form
    let layer = layui.layer
    form.verify({
        nikename: [
            /^[\S]{1,10}$/,
            '昵称是一个1到10位的非空字符'
        ]
    })



    // 初始化用户信息 后面还要用要封装函数
    initUserInfo()
    function initUserInfo() {
        axios({
            method: 'GET',
            url: "/my/userinfo",
        }).then(res => {
            // console.log(res);
            // console.log(res.data);
            // console.log(res.data.data);
            // 判断
            if (res.data.status !== 0) {
                return layer.msg(res.data.message)
            }
            // 渲染
            form.val('formUserInfo', res.data.data)
            //给（class="layui-form"表单 所在元素）添加属性 lay-filter="" 属性值就是获取的对象，用来区分表单，相当于选择器 点击事件是用radio( lay-filter的值区分)，form.val()方法两个参数filter；object；第一个参数指定表单集合的元素，如果 object 参数存在，则为赋值；如果 object 参数不存在，则为取值。
        })
    }
    // ?name=value
    
    


    // 重置表单
    // 给按钮注册点击事件或者给form绑定reset事件
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        // 发起请求重新渲染
        initUserInfo()
    })

    // 提交表单
    $('form').on('submit',function (e) {
        e.preventDefault()
        // 请求
        axios({
            method:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),

        }).then(res=>{
            console.log(res);
            if (res.data.status !== 0 ) {
                return layer.msg(res.data.message)
            }
            //成功
            layer.msg(res.data.message) 
            // 重新渲染用户信息 index.html中的iframe标签有user_info.html页面，父子关系，当改变子页面中的数据，比如头像就在index重新获取渲染，调用 window.parent.getUserInfo()，页面就一般都有一个widow对象，单不会控制子页面的window，所以用window.parent
            window.parent.getUserInfo()
        })
    })
})