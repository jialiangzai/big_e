$(function () {
    let layer = layui.layer
    let form = layui.form
    initArtCateList()
    function initArtCateList() {
        axios({
            // 获取文章分类的列表

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
            // 所有表单重新渲染 form.render() 单选多选下拉 
            form.render()
        })
    }
    // 初始化富文本编辑器
    initEditor()

    // 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 选择文章状态 点击第一个按钮该值为已发布 点击第二个存草稿 这样不仅能触发自己的点击事件还可以触发表单的提交事件 可以优化默认值Wie已发布
    let state = ''
    $('#btn1').on('click',function () {
        state='已发布'
    })
    $('#btn2').on('click', function () {
        state = '草稿'
    })
    // 封面
    $('#chooseImgBtn').on('click', function () {
        $('#chooseImgInp').click()
    })
    // 文件内容改变 保存图片渲染图片
    $('#chooseImgInp').on('change', function (e) {
        // 1. 拿到用户选择的文件
        var file = e.target.files[0]
        // 非空校验
        if (file === undefined) {
            return layer.msg('文章封面不能为空！')
        }
        // 2. 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        // 3. 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 发布请求并在此之前把文件转换为二进制
    $('#formPub').on('submit', function (e) {
        e.preventDefault();
        // formdata对象 是dom对象
        let fd = new FormData(this)
        // 添加文章状态
        fd.append('state', state)
        // 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       //异步方法 将 Canvas 画布上的内容，转化为文件对象blob二进制
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // 发起请求
                // console.log(...fd);
                // 在此发起请求因为toblob是异步
                axios({
                    method: 'POST',
                    url: '/my/article/add',
                    data: fd
                }).then(res => {
                    // 可以重复发送
                    if (res.data.status !== 0) {
                        return layer.msg(res.data.message)
                    }
                    // 成功之后再判断是发布还是存草稿
                    if (state === '草稿') {
                        layer.msg(`恭喜您，存储草稿成功！`)
                    } else {
                        layer.msg(`恭喜您，发布文章成功！`)
                    }
                    // location.href="/article/art_list.html" 不显示成功 样式也不符合 效果不好
                    // window.parent.document.querySelector('#art_list').click()还是不能显示成功提示，添加定时器
                    setTimeout(() => {
                        // 父页面的a元素
                        window.parent.document.querySelector('#art_list').click()
                    }, 2000);

                })

            });

    })

})