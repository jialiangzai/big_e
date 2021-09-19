$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    $('#chooseImgBtn').on('click', function () {
        $('#chooseImgInp').click()
    })
    //   选择图片 input 的value值是虚拟url不能使用change事件文件改变 获取列表 同步裁剪区域 
    $('#chooseImgInp').on('change', function () {
        // alert(1)
        // 拿到用户选择的文件
        let file = this.files[0]
        // console.log(file);
        // 非空校验
        if (file === undefined) {
            return layui.layer.msg('上传头像，不能为空！')
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        let url = URL.createObjectURL(file)
        // console.log(url);
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', url)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    });
    // base64使用小头像
    // 上传头像 
    $('#uploadBtn').on('click', function () {
        // 在请求之前获取当前图片的base64格式
        var dataURL = $image.cropper('getCroppedCanvas', { 
            width: 100, height: 100 
        })
        .toDataURL('img/png');;
        // console.log(base64);
        // 发送请求
        axios({
            method: 'POST',
            url: '/my/update/avatar',
            // 上传的是字符串头像必须要编码，加密的时不能加属性和等号后端没有属性等号解码encodeURI()	把字符串编码为 URI。	encodeURIComponent()	把字符串编码为 URI 组件。	1	4	5.5
            data: 'avatar=' + encodeURIComponent(dataURL)
        }).then(res => {
            if (res.data.status !== 0) {
                return layui.layer.msg(res.data.message)
            }
            layui.layer.msg(res.data.message)
            window.parent.getUserInfo()
        })
    })
})