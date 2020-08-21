var roadPath = 'http://192.168.2.2:8073/treatment/treat';
// var roadPath = 'http:/192.168.10.254:8014/treatment/treat';
// var roadPath = 'http://demo.sdboletong.com:8098/treatment/treat';
// var roadPath = 'http://10.2.0.36:8183/treatment/treat';

var noLoghin = 'http://192.168.2.2:8073/treatment'
// var noLoghin = 'http://192.168.10.254:8014/treatment'
// var noLoghin = 'http://demo.sdboletong.com:8098/treatment'
// var noLoghin = 'http://10.2.0.36:8183/treatment'


//设置cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";path=/;" + expires;
}

//获取cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}
//清除cookie  
function clearCookie(name) {
    setCookie(name, "", -1);
}

//操作cookie
function optionCookie(authorToke){
	if(authorToke != null && authorToke != '' && authorToke != undefined){
		clearCookie("author");
	    setCookie("author", authorToke, '1');
	}
}
// 公共ajax
function getAjax (url, jsonParam, success, fail) {
    jsonParam.authToken = localStorage.getItem('authTokenTreat');
    if (jsonParam.authToken) {
        var ajaxload;
        $.ajax({
            url: roadPath + url,
            type: 'get',
            dataType: 'jsonp',
            jsonp: "callback",//服务端用于接收
            contentType: 'application/json',
            async: false,
            data: jsonParam,
            beforeSend: function () {
                layui.use('layer', function () {
                    ajaxload = layer.load(1, {
                        shade: [0.1,'#fff'] //0.1透明度的白色背景
                    });
                });
            },
            success: function (resultMsg) {
                layer.closeAll('loading');
                layer.close(ajaxload);
                $("div.layui-layer-shade").css('display', 'none');
                if (resultMsg.retCode == 1003) {
                    // 登录状态失效, 重新授权
                    // 跳转登录页
                    parent.location.href = '../login.html';
                    return false;
                } else if (resultMsg.retCode == 0) {
                    success && success(resultMsg);
                    return false;
                }
                // else if (resultMsg.retCode == 10002) {
                //     fail && fail(resultMsg);
                // return false;
                // }
                else {
                    fail && fail(resultMsg);
                    layer.open({
                        id: 'login',
                        type: 1,
                        title: '提示',
                        skin: 'my-layui-layer', //样式类名
                        area: ['360px', '180px'],
                        shadeClose: true,
                        shade: 0.2,
                        content: '<div style="padding: 20px;">' + resultMsg.retMsg + '</div>', //iframe的url
                        btn: ['关闭']
                    });
                    return false;
                }
            },
            error: function (error) { // 请求失败处理
                console.log(error);
                // fail && fail(resultMsg.msg);
                // alert('后台走丢了');
            }
        });
    } else {
        parent.location.href = '../login.html';
    }
}
// 地址栏取值
function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
// input[type='file']监听函数
function PreviewImage(imgFile, bgdiv, leixing){
    //传递的参数：input当前对象
    //图片容器
    //图片宽度
    //图片高度（宽高不传：默认200x200）
    var base64 = new Base64(imgFile, $('.img-list'), 200, 200);
    // 定义方法
    var pattern = /(\.*.jpg$)|(\.*.png$)|(\.*.jpeg$)|(\.*.gif$)|(\.*.bmp$)/;
    if(!pattern.test(base64.imgFile.value)) {
        alert("请上传jpg/jpeg/png/gif/bmp格式的照片！");
        this.imgFile.focus();
    }
    if(document.all){
        //兼容IE
        ieBase64(base64.imgFile.value, $('.img-list'), 200, 200, bgdiv, leixing);
    }else{
        //兼容主流浏览器
        console.log(base64.imgFile.files[0]);
        mainBase64(base64.imgFile.files[0], $('.img-list'), 200, 200, bgdiv, leixing);
    }
}

function ieBase64(file, ele, width, height, bgdiv, leixing){
    var realPath, xmlHttp, xml_dom, tmpNode, imgBase64Data;
    realPath = file;//获取文件的真实本地路径.
    xmlHttp = new ActiveXObject("MSXML2.XMLHTTP");
    // debugger;
    xmlHttp.open("POST",realPath, false);
    xmlHttp.send("");
    xml_dom = new ActiveXObject("MSXML2.DOMDocument");
    tmpNode = xml_dom.createElement("tmpNode");
    tmpNode.dataType = "bin.base64";
    tmpNode.nodeTypedValue = xmlHttp.responseBody;
    imgBase64Data = "data:image/bmp;base64," + tmpNode.text.replace(/\n/g,"");
    getAjaxImg(imgBase64Data, bgdiv, leixing)
}
function mainBase64(file, ele, width, height, bgdiv, leixing){
    var fileReader;
    var urls;
    fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = function () {
        urls = this.result;
        getAjaxImg(urls, bgdiv, leixing)
    }
}
var index;
function getAjaxImg(imgBase64Data, bgdiv, leixing) {
    $.ajax({
        type : "get",
        async: false,
        // url : "http://192.168.1.81:8082//commontools/saveImage",
        url : "http://192.168.2.2:8073/treatment//commontools/saveImage",
        //url : "http://192.168.1.81:8082/login/oauth",
        data:{"fileData":imgBase64Data},
        dataType : "jsonp",//数据类型为jsonp
        jsonp: "callback",//服务端用于接收callback调用的function名的参数
        beforeSend:function(){
            layui.use('layer', function () {
                index = layer.load(1, {
                    shade: [0.1,'#000'] //0.1透明度的白色背景
                });
            });
        },
        success : function(data){
            // var str = data.data;
            // var newStr = str.slice(0,5)+'//'+str.slice(5,str.length)
            // console.log(newStr)
            if (leixing == 'bg') {
                setTimeout(function () {
                    $(bgdiv).css('background-image', 'url("' + data.data + '")');
                    $(bgdiv).next('input').next('input').val(data.data);
                    layer.close(index);
                },1000);
            }else if(leixing == 'img'){
                setTimeout(function () {
                    // $(bgdiv).attr("src", data.data) ;
                    $(bgdiv).html('<img src="'+data.data+'" >');
                    layer.close(index);
                },1000);
            }
        },
        error:function(data){
            alert('fail');
        }
    });
}
// 删除数组元素
function delArr (arr, item) {
    $.each(arr, function (i, arrItem) {
        if (item == arrItem) {
            arr.splice(i, 1);
        }
    });
}

// 身份证号取年龄、生日、性别

function IdCard (UUserCard,num){
    if (num == 1) {
        //获取出生日期
        var birth = UUserCard.substring(6, 10) + '-' + UUserCard.substring(10, 12) + '-' + UUserCard.substring(12, 14);
        return birth;
    }
    if (num == 2) {
        //获取性别
        if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
            return "男";
        } else {
            return "女";
        }
    }
    if (num == 3) {
        //获取年龄
        var myDate = new Date();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
        if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
            age++;
        }
        return age;
    }
}