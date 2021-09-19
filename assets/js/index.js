// 入口函数
$(function () {
    // 函数调用 渲染头像和用户名昵称
    getUserInfo()
    // 点击退出
    $('#logout').on('click', function () {
        layer.confirm('确认退出吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            localStorage.removeItem('token')
            location.href = '/login.html'
            layer.close(index);
        });
    })
})
// 封装函数渲染欢迎和头像为全局函数后面调用 局部可以调用全局函数
function getUserInfo() {
    axios({
        // axios的属性是严格区分大小写
        method: "GET",
        url: '/my/userinfo',
        // 身份认证 axios设置请求头在文档中  对象 
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // }
    }).then(res => {
        // console.log(res);
        if (res.data.status !== 0) {
            return layui.layer.msg(res.data.message)
        }
        // 成功渲染
        renderAvatar(res.data.data)
    })
};

function renderAvatar(user) {
    // 欢迎
    //获取用户的昵称或者用户名 逻辑运算
    let name = user.nickname || user.username
    $('.welcome').html('欢迎&nbsp;' + name)
    // 头像 如果没有用户头像会返回null
    if (user.user_pic !== null) {
        // 隐藏文字头像，显示用户头像
        $('.avatar-text').hide()
        $('.layui-nav-img').show().attr('src', user.user_pic)
    } else {
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.avatar-text').show().html(first )

    }
}
