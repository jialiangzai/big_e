$(function () {
    let layer = layui.layer
    // 发起请求筛选列表和分页都是要传递参数 设置一个对象
    let q = {
        pagenum: 1,//页码值，默认第几页
        pagesize: 4,//每页要显示的多少条数据 限制的
        cate_id: '',//文章分类的 Id
        state: '',//文章的状态，可选值有：已发布、草稿
    }

    // 初始化文章列表
    initArticleList()
    function initArticleList() {
        axios({
            // get请求 用params传递参数
            method: 'GET',
            url: '/my/article/list',
            params: q
        }).then(res => {
            // console.log(res);
            if (res.data.status !== 0) {
                return layer.msg(res.data.messsage)
            }
            let arr = []
            res.data.data.forEach(ele => {
                arr.push(`
                <tr>
                <td>${ele.title}</td>
                <td>${ele.cate_name}</td>
                <td>${formData(ele.pub_date)}</td>
                <td>${ele.state}</td>
                <td>
                  <a href="/article/art_edit.html?id=${ele.Id} "  class="btn-edit layui-btn layui-btn-xs">修改</a>
                  <button  data-id=${ele.Id} class="btn-del layui-btn layui-btn-xs layui-btn-danger">删除</button>
                </td>
                </tr>
                `)
            });
            $('tbody').empty().html(arr.join(''))
            // 文章列表渲染完后执行分页处理
            renderPage(res.data.total)
        })
    }


    // 渲染筛选的文章类别列表
    let form = layui.form //不可重复let
    initArtCateList()
    function initArtCateList() {
        axios({
            // 获取文章分类的列表
            method: 'GET',
            url: '/my/article/cates'
        }).then(res => {
            // console.log(res.data.data);
            if (res.data.status !== 0) {
                return layer.msg(res.data.message)
            }
            // layer.msg(res.data.message)
            // 非空校验 第一个是空 
            let arr = [`<option value="">请选择文章类别</option>`]
            // 遍历
            res.data.data.forEach(ele => {
                arr.push(`
                <option value="${ele.Id}">${ele.name}</option>
                `)
            })
            // $('select').empty().html(arr.join('')) 用属性选择器
            $('[name=cate_id]').empty().html(arr.join(''))
            // 单选多选下拉 富文本编辑器 兼容性和样式不太好有些时候，你的有些表单元素可能是动态插入的。这时 form 模块 的自动化渲染是会对其失效的。虽然我们没有双向绑定机制（因为我们叫经典模块化框架，偷笑.gif） 但没有关系，你只需要执行 form.render(type, filter); 方法即可。
            // 所有表单重新渲染 form.render() 单选多选下拉 富文本编辑器
            form.render()
        })
    }

    // 筛选
    $('#searchForm').on('submit', function (e) {
        e.preventDefault();
        // 赋值q对象
        q.cate_id = $('[name=cate_id]').val()
        q.state = $('[name=state]').val()
        // 重新渲染文章列表
        initArticleList()
    })


    // 分页封装函数 谁用谁调用
    function renderPage(total) {
        // 分页
        var laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号 这里是固定写死的值
            // 动态
            count: total, //数据总数，从服务端得到，传过来的数据条数
            limit: q.pagesize, //每页显示的条数。laypage将会借助 count 和 limit 计算出分页数。
            limits: [2, 5, 10, 20, 30],//每页条数的选择项。如果 layout 参数开启了 limit，则会出现每页条数的select选择框
            curr: q.pagenum,//起始页。一般用于刷新类型的跳页以及HASH跳页。
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip', 'refresh'],
            groups: 4,
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数 是当前，比如：
                // console.log(obj);
                // console.log(first); //初始化进入初始化形成递归，于是first 表示首次默认true ，需求是不是第一次才可以执行当前页的改变然后初始化
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数

                //首次不执行 防止死递归
                if (!first) {
                    //do something
                    //   把当前页的改变，重新渲染文章列表
                    q.pagenum = obj.curr
                    q.pagesize = obj.limit
                    initArticleList()

                }
            }
        });

    }

    // 删除
    $('tbody').on('click', '.btn-del', function () {
        let id = $(this).attr('data-id')
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            axios({
                method: 'GET',
                // url:'/my/article/delete/:id',
                url: '/my/article/delete/' + id,
            }).then(res => {
                // console.log(res.data.data);
                if (res.data.status !== 0) {
                    return layer.msg(res.data.message)
                }
                layer.msg('恭喜您，删除文章成功！')
                // 判断删除的是否是本业页面的最后一条数据。请求ajax或者axios删除的是服务器的数据  双于运算
                // 判断页面请求前有一个删除按钮/一条数据  并且当前的页码值>=1,因为没有0页，当为1页时不能删除，不写此情况的删除1页的数据会报错
                if ($('.btn-del').length === 1 && q.pagenum>=2 ) q.pagenum--
                // 重新渲染文章列表
                initArticleList()
            })
            layer.close(index);
        });
    })
})