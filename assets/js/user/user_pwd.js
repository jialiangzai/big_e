$(function () {
    // 自定义校验规则
    let form=layui.form
    let layer=layui.layer
    form.verify({
        // 原密码
        pwd:[
            /^[\S]{6,12}$/,
            '密码必须是6到12位且不能出现空格'
        ],
        // 新密码
        newPwd:function (value) {
            let v1=$('[name="oldPwd"]').val()
            // 判断 不符合情况的执行 就是原密码和新密码一致
            if (v1 === value) {
                return '新密码不能和旧密码相同'
            }
        },
        // 确认密码
        rePwd:function (value) {
            let v2=$('[name="newPwd"]').val()
            // 判断条件 新密码和再次密码不一致
            if (value !== v2) {
                return '两次密码输入不一致！'
            }
        },
    })
    // 请求
    $('#formPwd').on('submit',function (e) {
        e.preventDefault();
        axios({
            method:'POST',
            url:'/my/updatepwd',
            data:$(this).serialize(),
        }).then(res=>{
            if (res.data.status !== 0) {
                return  layer.msg(res.data.message)
            }
            layer.msg('恭喜您，修改密码成功！')
            // 重置表单 这里是回调函数，this指向axios
            $('#formPwd')[0].reset()
            // 页面跳转
            setTimeout(()=>{
                window.parent.location.href='/login.html'
            },1800)
        })    
    })
})