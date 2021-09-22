$(function () {
    // 初始化文章分类  后面还要用 封装函数
    let layer = layui.layer
    initArtCateList()
    function initArtCateList() {
        axios({
            url: '/my/article/cates',
        }).then(res => {
            if (res.data.status !== 0) {
                return layer.msg(res.data.message)
            }
            // console.log(res.data);
            layui.layer.msg(res.data.message)
            let ary = []
            // 渲染表格表单可以用空数组push存储后通过父级.empty().html()  join('')转换为字符串
            res.data.data.forEach(ele => {
                ary.push(
                    `
                    <tr>
                    <td>${ele.Id}</td>
                    <td>${ele.name}</td>
                    <td>${ele.alias}</td>
                    <td>
                        <button  data-id=${ele.Id} class=" btn-edit layui-btn layui-btn-xs">修改</button>
                        <button data-id=${ele.Id} class="del-edit layui-btn layui-btn-xs layui-btn-danger">删除</button>
                    </td>
                </tr>
                    `

                )
            });
            $('tbody').empty().html(ary.join(' '))
        })

    }

    // 定义变量，接收弹出层返回值 使用的是两个函数，要提升到去全局变量 值为数值类型
    let indexAdd = 0
    // 添加  点击按钮弹出对话框
    $('#addBtn').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章类别',
            content: `
            <form id="addForm" class="layui-form"  >
            <div class="layui-form-item">
                <label class="layui-form-label">分类名称</label>
                <div class="layui-input-block">
                    <input type="text" name="name" required lay-verify="required" placeholder="请输入分类名称" autocomplete="off"
                        class="layui-input">
                </div>
            </div>
    
            <div class="layui-form-item">
                <label class="layui-form-label">分类别名</label>
                <div class="layui-input-block">
                    <input type="text" name="alias" required lay-verify="required" placeholder="请输入分类别名" autocomplete="off"
                        class="layui-input">
                </div>
            </div>
            <!-- 按钮 -->
            <div class="layui-form-item">
                <div class="layui-input-block">
                    <button class="layui-btn" lay-submit lay-filter="formDemo">立即提交</button>
                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                </div>
            </div>
    
        </form>
    
    
            `
        });
    });

    //  提  交 事件委托 body是父元素 ,事件委托的第二个参数是选择器不是元素 点击按钮触发表单提交
    $('body').on('submit', '#addForm', function (e) {
        e.preventDefault();
        // alert(123)
        axios({
            method: "POST",
            url: '/my/article/addcates',
            data: $(this).serialize()
        }).then(res => {
            if (res.data.status !== 0) {
                return layer.msg(res.data.message)
            }
            layer.msg(res.data.message)
            initArtCateList()
            // 关闭弹出层
            layer.close(indexAdd)
        })
    })


    let form = layui.form
    let indexEdit = 0
    // 点击按钮弹出对话框 进行编辑

    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章类别',
            content: `
            <form id="editForm" class="layui-form" lay-filter="editform">
            <input type="hidden" name="Id">
            <div class="layui-form-item">
                <label class="layui-form-label">分类名称</label>
                <div class="layui-input-block">
                    <input type="text" name="name" required lay-verify="required" placeholder="请输入分类名称" autocomplete="off"
                        class="layui-input">
                </div>
            </div>
    
            <div class="layui-form-item">
                <label class="layui-form-label">分类别名</label>
                <div class="layui-input-block">
                    <input type="text" name="alias" required lay-verify="required" placeholder="请输入分类别名" autocomplete="off"
                        class="layui-input">
                </div>
            </div>
            <!-- 按钮 -->
            <div class="layui-form-item">
                <div class="layui-input-block">
                    <button class="layui-btn" lay-submit lay-filter="formDemo">立即提交</button>
                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                </div>
            </div>
    
        </form>
    
    
            `
        });
        //  获取id
        let idi = $(this).attr('data-id')
        //  alert(456)
        // 接口文档中的url参数路由参数动态参数   /my/article/cates/:id 写在url中传值的时候最后/不能省略，冒号:必须删除,但是id为负数的不能正常获取修改
        axios({
            method: 'GET',
            url: '/my/article/cates/' + idi,
        }).then(res => {
            console.log(res);
            if (res.data.status !== 0) {
                return layer.msg(res.data.message)
            }
            // 表单赋值
            form.val('editform', res.data.data)
        })
    })

    $("body").on('submit', "#editForm", function (e) {
        e.preventDefault();
        // 修改分类
        axios({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize()
        }).then(res => {
            // console.log(res);
            if (res.data.status !== 0) {
                return layer.msg(res.data.message);
            }
            // 成功：提示，初始化文章分类
            layer.msg("恭喜您，修改文章类别成功！");
            initArtCateList();
            // 关闭对话框
            layer.close(indexEdit);
        })
    });

    //删除
    $('tbody').on('click', '.del-edit', function () {
        let iddel = $(this).attr('data-id')
        // alert(id)
        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            axios({
                url: '/my/article/deletecate/' + iddel,

            }).then(res => {
                if (res.data.status !== 0) {
                    return layer.msg(res.data.message)
                }
                layer.msg("恭喜您，删除文章类别成功！");
                initArtCateList()
            })
            // 关闭对话框
            layer.close(index);
        });
    })
})