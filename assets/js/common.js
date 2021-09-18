// 设置公共的基础路径 要引入在axios之后
axios.defaults.baseURL = 'http://api-breakingnews-web.itheima.net'
// 设置请求头
// axios.defaults.headers.comon['Authorization'] = localStorage.getItem('token') || ''
// 注册和登录不需要 拦截器
// 请求拦截器
axios.interceptors.request.use(function (config) {
    // 拦截所有的ajax的请求，成功后交给函数处理，config代表请求的相关配置
    // 操作
    console.log(config);
    // 判断路径是否有/my/
    if (config.url.indexOf('/my/') !== -1) {
        config.headers.Authorization = localStorage.getItem('token') || ''
    }
    // 必须要返回
    return config
}, function (error) {
    return Promise.reject(error)
});
// 响应拦截器 登录拦截
axios.interceptors.response.use(function (response) {
    // 响应信息
    console.log(response.data);
    if (response.data.message === '身份认证失败！') {
        localStorage.removeItem('token')
        location.href = '/login.html'
    }
    return response
}, function (error) {
    return Promise.reject(error)
})
