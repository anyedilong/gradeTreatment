$(function () {
    window.onload = function(){
        window.frames['iframePho1'].contentWindow.postMessage('rotaryTransferAdd1', '*');
        window.frames['iframePho2'].contentWindow.postMessage('rotaryTransferAdd2,0', '*');
    }
    jQuery('[placeholder]').focus(function() {
        var input = jQuery(this);
        if (input.val() == input.attr('placeholder')) {
            input.val('');
            input.removeClass('placeholder');
        }
        input.css("color","#555");
    }).blur(function() {
        var input = jQuery(this);
        if (input.val() == '' || input.val() == input.attr('placeholder')) {
            input.addClass('placeholder');
            input.val(input.attr('placeholder'));
            input.css("color","#888");
        }
    }).blur().parents('form').submit(function() {
        jQuery(this).find('[placeholder]').each(function() {
            var input = jQuery(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
            }
        })
    });
    function textResize () {
        $('.mould-box').css('width', '100px');
        $('.mould-block textarea').css('width', $('.mould-block').width() - 100 + 'px');
    }
    textResize();
    window.onresize = textResize;
    var fileObj = {
        file1: [],
        file2: []
    };
    layui.use(['form','laydate', 'table', 'laypage'], function(){
        // 文件上传
        if (window.attachEvent){
            window.attachEvent('on' + 'message', function(e) {
                if(e.data == '1000'){
                    layer.msg('文件上传失败');
                } else if (e.data == '1012'){
                    layer.msg('最多上传5个文件');
                } else if (e.data == '1013'){
                    // waitImg = layer.load(1, {
                    //     shade: [0.1,'#fff'] //0.1透明度的白色背景
                    // });
                } else if (e.data == '1014'){
                    // layer.closeAll();
                } else if(e.data == '1001'){
                    layer.msg('请添加需要上传的文件');
                }else if(e.data == '-1'){
                    layer.msg('系统错误');
                }else{
                    var files = e.data.split(',')
                    if (files[2] == 'rotaryTransferAdd1') {
                        fileObj.file1 = [{
                            fileUrl: files[0],
                            fileName: files[1],
                            fileType: 1
                        }];
                        $('.zqtyBox').html(' <a target="_blank" href="' + files[0] + '">' +
                            '<img src="../img/pdf.png" alt="">' +
                            '<span>' + files[1] + '</span></a>' +
                            '<i class="iconfont delFile" type="1">&#xe716;</i>');
                    } else {
                        fileObj.file2.push({
                            fileUrl: files[0],
                            fileName: files[1],
                            fileType: 2
                        });
                        $('#iframePho2').parent('.layui-input-block').append('<div><a target="_blank" href="' + files[0] + '">' +
                            '<img src="../img/pdf.png" alt="">' +
                            '<span>' + files[1] + '</span></a>' +
                            '<i class="iconfont delFile" type="2">&#xe716;</i></div>');
                    }
                }
            }, false);
        } else if (window.addEventListener) {
            window.addEventListener('message', function(e) {
                if(e.data == '1000') {
                    layer.msg('文件上传失败');
                } else if (e.data == '1012'){
                    layer.msg('最多上传5个文件');
                } else if (e.data == '1013'){
                    // waitImg = layer.load(1, {
                    //     shade: [0.1,'#fff'] //0.1透明度的白色背景
                    // });
                } else if (e.data == '1014'){
                    // layer.closeAll();
                } else if (e.data == '1001'){
                    layer.msg('请添加需要上传的文件');
                } else if (e.data == '-1'){
                    layer.msg('系统错误');
                } else if (e.data == '1011'){
                    layer.msg('文件过大');
                } else {
                    var files = e.data.split(',')
                    if (files[2] == 'rotaryTransferAdd1') {
                        fileObj.file1 = [{
                            fileUrl: files[0],
                            fileName: files[1],
                            fileType: 1
                        }];
                        $('.zqtyBox').html(' <a target="_blank" href="' + files[0] + '">' +
                            '<img src="../img/pdf.png" alt="">' +
                            '<span>' + files[1] + '</span></a>' +
                            '<i class="iconfont delFile" type="1">&#xe716;</i>');
                    } else {
                        fileObj.file2.push({
                            fileUrl: files[0],
                            fileName: files[1],
                            fileType: 2
                        });
                        window.frames['iframePho2'].contentWindow.postMessage('rotaryTransferAdd2,' + fileObj.file2.length, '*');
                        $('#iframePho2').parent('.layui-input-block').append('<div><a target="_blank" href="' + files[0] + '">' +
                            '<img src="../img/pdf.png" alt="">' +
                            '<span>' + files[1] + '</span></a>' +
                            '<i class="iconfont delFile" type="2">&#xe716;</i></div>');
                    }
                }
            }, false);
        }
        $('.fileBox').on('click', '.delFile', function (e) {
            var type = $(this).attr('type');
            var url = $(this).prev('a').attr('href');
            if (type == 1) {
                fileObj.file1 = [];
                $(this).parent('.zqtyBox').html('');
            } else {
                $.each(fileObj.file2, function (i, item) {
                    if (item.fileUrl == url) {
                        fileObj.file2.splice(i, 1);
                    }
                });
                $(this).parent('div').remove();
            }
        })
        // 修改or添加
        var ids = GetQueryString('id');
        var types = GetQueryString('type');
        if (ids) {
            var jsonParam = {
                id: ids,
            };
            if (types == 'jszr') {
                $('#pageFun').html('添加');
                getAjax('/turnin/getTurnInDetail',jsonParam,function (resultMsg) {
                    var formobj = resultMsg.data;
                    form.val('formData', formobj);
                    orgId = $('input[name="orgId"]').val();
                    $('input[name=orgName]').val(resultMsg.data.accOrgName);
                    $('input[name=orgId]').val(resultMsg.data.accOrgId);
                    $('input[name=depName]').val(resultMsg.data.accDepName);
                    $('input[name=depId]').val(resultMsg.data.accDepId);
                    $('input[name=docName]').val(resultMsg.data.accDocName);
                    $('input[name=docId]').val(resultMsg.data.accDocId);
                    getAccOrg(resultMsg.data.accOrgId, resultMsg.data.orgId);
                    getKeshi(resultMsg.data.orgId, resultMsg.data.depId);
                    // getYisheng(resultMsg.data.depId, resultMsg.data.docName);
                    getYisheng(resultMsg.data.depId, resultMsg.data.docName + '-' + resultMsg.data.docId);
                    // $('input[name=accDocName]').val();
                    $('#province').empty();
                    $('#city').empty();
                    $('#county').empty();
                    $('#town').empty();
                    getYblx(resultMsg.data.healthType);
                    getArea('province', '', resultMsg.data.province);
                    getArea('city', resultMsg.data.province, resultMsg.data.city);
                    getArea('county', resultMsg.data.city, resultMsg.data.county);
                    getArea('town', resultMsg.data.county, resultMsg.data.town);
                    layui.form.render("select");
                    form.render(); //更新全部
                    var imagelist = resultMsg.data.imageList;
                    $.each(imagelist, function (i, item) {
                        if (item.fileType == '1') {
                            fileObj.file1 = [{
                                fileUrl: item.fileUrl,
                                fileName: item.fileName,
                                fileType: 1
                            }];
                            $('.zqtyBox').html(' <a target="_blank" href="' + item.fileUrl + '">' +
                                '<img src="../img/pdf.png" alt="">' +
                                '<span>' + item.fileName + '</span></a>' +
                                '<i class="iconfont delFile" type="1">&#xe716;</i>');
                        } else {
                            fileObj.file2.push({
                                fileUrl: item.fileUrl,
                                fileName: item.fileName,
                                fileType: 2
                            });
                            $('#iframePho2').parent('.layui-input-block').append('<div><a target="_blank" href="' + item.fileUrl + '">' +
                                '<img src="../img/pdf.png" alt="">' +
                                '<span>' + item.fileName + '</span></a>' +
                                '<i class="iconfont delFile" type="2">&#xe716;</i></div>');
                        }
                    })
                });
            } else {
                $('#pageFun').html('修改');
                getAjax('/rotary/show',jsonParam,function (resultMsg) {
                    form.val('formData', resultMsg.data);
                    orgId = $('input[name="orgId"]').val();
                    getAccOrg(resultMsg.data.orgId, resultMsg.data.accOrgId);
                    getKeshi(resultMsg.data.accOrgId, resultMsg.data.accDepId);
                    getYisheng(resultMsg.data.accDepId, resultMsg.data.accDocName + '-' + resultMsg.data.accDocId);
                    $('#province').empty();
                    $('#city').empty();
                    $('#county').empty();
                    $('#town').empty();
                    getYblx(resultMsg.data.healthType);
                    getArea('province', '', resultMsg.data.province);
                    getArea('city', resultMsg.data.province, resultMsg.data.city);
                    getArea('county', resultMsg.data.city, resultMsg.data.county);
                    getArea('town', resultMsg.data.county, resultMsg.data.town);
                    layui.form.render("select");
                    form.render(); //更新全部
                    var imagelist = resultMsg.data.filelist;
                    $.each(imagelist, function (i, item) {
                        if (item.fileType == '1') {
                            fileObj.file1 = [{
                                fileUrl: item.fileUrl,
                                fileName: item.fileName,
                                fileType: 1
                            }];
                            $('.zqtyBox').html(' <a target="_blank" href="' + item.fileUrl + '">' +
                                '<img src="../img/pdf.png" alt="">' +
                                '<span>' + item.fileName + '</span></a>' +
                                '<i class="iconfont delFile" type="1">&#xe716;</i>');
                        } else {
                            fileObj.file2.push({
                                fileUrl: item.fileUrl,
                                fileName: item.fileName,
                                fileType: 2
                            });
                            $('#iframePho2').parent('.layui-input-block').append('<div><a target="_blank" href="' + item.fileUrl + '">' +
                                '<img src="../img/pdf.png" alt="">' +
                                '<span>' + item.fileName + '</span></a>' +
                                '<i class="iconfont delFile" type="2">&#xe716;</i></div>');
                        }
                    })
                });
            }
        } else {
            var orgId = $('input[name="orgId"]').val();
            getAccOrg(parent.loginUserInfo.orgId, '');
            $('#pageFun').html('添加');
            getYblx('');
        }

        // 获取index页面用户信息
        $('input[name="orgName"]').val(parent.loginUserInfo.orgName);
        $('input[name="orgId"]').val(parent.loginUserInfo.orgId);
        $('input[name="depName"]').val(parent.loginUserInfo.depName);
        $('input[name="depId"]').val(parent.loginUserInfo.depId);
        $('input[name="docName"]').val(parent.loginUserInfo.name);
        $('input[name="docId"]').val(parent.loginUserInfo.id);
        var laydate = layui.laydate;
        var form = layui.form;
        var table = layui.table;
        var laypage = layui.laypage;

        form.verify({
            idcard: function(value, item){ //value：表单的值、item：表单的DOM对象
                if(!new RegExp("^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$").test(value)){
                    return '身份证号格式不正确';
                }
            },
            years: function(value, item){ //value：表单的值、item：表单的DOM对象
                // if(!new RegExp("^[0-9]{1,3}$").test(value)){
                //     return '年龄格式不正确';
                // }
            },
            weightReg: function(value, item){ //value：表单的值、item：表单的DOM对象
                // if(!new RegExp("^(0(\\.\\d{1}){0,1}|[1-8]\\d{1,3}(\\.\\d{1}){0,1}|9\\d{1,2}(\\.\\d{1}){0,1}|999(\\.0){0,1}|.{0})$").test(value)){
                if (!new RegExp("^\\d{1,5}(?:\\.\\d{1,3})?$").test(value)){
                    return '体重格式不正确';
                }
            },
            heightReg: function(value, item){ //value：表单的值、item：表单的DOM对象
                if(!new RegExp("^(0{1}|[1-9]\\d{0,3}|.{0})$").test(value)){
                    return '身高格式不正确';
                }
            },
            lxdh: function(value, item){ //value：表单的值、item：表单的DOM对象
                // 包括手机号和固定电话
                if(!new RegExp("^1[3456789]\\d{9}$").test(value) && !new RegExp("^(\\(\\d{3,4}\\)|\\d{3,4}-|\\s)?\\d{7,14}$").test(value)){
                    if (item.name == 'telephone') {
                        return '联系方式格式不正确';
                    } else {
                        return '家属联系方式格式不正确';
                    }
                }
            },
            mbbtrequired: function(value, item){ //value：表单的值、item：表单的DOM对象
                if(value == ''){
                    return '请填写模板标题';
                }
                if (value.length > 100) {
                    return '模板标题字数不得超过100字';
                }
            },
            mbrequired: function(value, item){ //value：表单的值、item：表单的DOM对象
                if(value == ''){
                    return '请填写模板内容';
                }
                if (value.length > 2000) {
                    return '模板内容字数不得超过2000字';
                }
            },
            valMaxLen: function (value, item) {
                if (item.name == 'firstImpression' && value.length > 500) {
                    return '初步印象字数不得超过500字';
                }
                if (item.name == 'name' && value.length > 36) {
                    return '患者姓名字数不得超过36字';
                }
                if (item.name == 'dno' && value.length > 36) {
                    return '档案编号字数不得超过36字';
                }
                if (item.name == 'healthCard' && value.length > 36) {
                    return '医保卡号字数不得超过36字';
                }
                if (item.name == 'adress' && value.length > 50) {
                    return '详细地址字数不得超过50字';
                }
                if (item.name == 'zs' && value.length > 2000) {
                    return '主诉字数不得超过2000字';
                }
                if (item.name == 'xbs' && value.length > 2000) {
                    return '现病史字数不得超过2000字';
                }
                if (item.name == 'jwz' && value.length > 2000) {
                    return '既往史字数不得超过2000字';
                }
                if (item.name == 'gms' && value.length > 2000) {
                    return '过敏史字数不得超过2000字';
                }
                if (item.name == 'jzs' && value.length > 2000) {
                    return '家族史字数不得超过2000字';
                }
                if (item.name == 'ct' && value.length > 2000) {
                    return '查体字数不得超过2000字';
                }
                if (item.name == 'fzjc' && value.length > 2000) {
                    return '辅助检查字数不得超过2000字';
                }
                if (item.name == 'jcjg' && value.length > 2000) {
                    return '主要检查结果字数不得超过2000字';
                }
                if (item.name == 'kfjy' && value.length > 2000) {
                    return '康复建议字数不得超过2000字';
                }
            }
        });

        $('#leftTab li').click(function () {
            $(this).addClass('active').siblings().removeClass('active');
        });
        laydate.render({
            elem: '#laydate'
        });
        laydate.render({
            elem: '#laydate1'
        });
        // 模板列表
        var layerYY = null;
        var modelJson = {};
        $('.mould-yy').click(function () {
            modelJson = {
                type: $(this).parent().attr('m-type'),
                pageNo: '1',
                pageSize: '10000'
            }
            var textName = $(this).parent().attr('textName');
            layerYY = layer.open({
                type: 1,
                skin: 'my-layui-layer', //加上边框
                title: '模板列表',
                area: ['560px', '530px'], //宽高
                content: $('#mouldpop'),
                btn: ['关闭', '确认'],
                btn1: function () {
                    layer.close(layerYY);
                    return false;
                },
                btn2: function () {
                    var mouldCont = '';
                    for (var i = 0; i < $('#mouldpop .mouldpop-li').length; i++) {
                        var selLi = $('#mouldpop .mouldpop-li').eq(i);
                        if (selLi.hasClass('mouldpop-act')) {
                            mouldCont = selLi.find('.mouldpop-cont').text().replace(/\s*/g,"");
                        }
                    }
                    if (mouldCont != '') {
                        $('textarea[name = ' + textName + ']').val(mouldCont);
                    }
                    layer.close(layerYY);
                    return false;
                },
                success: function () {
                    getModel(modelJson);
                }
            });
        });
        function getModel (jsonParam) {
            $('#mouldpop .mouldpop-ul').html('');
            getAjax('/sys/clin/getClinModelPage', jsonParam,function (resultMsg) {
                var arr = resultMsg.data.list;
                if (arr.length > 0) {
                    $.each(arr, function (i, item) {
                        $('#mouldpop .mouldpop-ul').append('<li class="mouldpop-li">' +
                            '<div class="mouldpop-tit">' + item.title + '</div>' +
                            '<div class="mouldpop-cont">' + item.depict + '</div>' +
                            '<div class="card-btn" mtype="' + item.type + '" ids="' + item.id + '">' +
                            '<img class="delete-btn cursorP" src="../img/btn_delete.png" alt="">' +
                            '</div></li>')
                    });
                } else {
                    $('#mouldpop .mouldpop-ul').html('<div>暂无模板信息，请先提取模板保存</div>');
                }
            });
        }
        // 模板新增
        var layerTQ = null;
        $('.mould-tq').click(function () {
            if ($(this).parent().parent().prev('textarea').val() == '') {
                layer.msg('请填写模板内容',{
                    time:2000,
                    icon:5,
                    anim: 6
                });
            } else {
                $("#addform")[0].reset();
                var formVal = {
                    depict: $(this).parent().parent().prev('textarea').val(),
                    type: $(this).parent().attr('m-type')
                }
                form.val("addform", formVal);
                layerTQ = layer.open({
                    type: 1,
                    skin: 'my-layui-layer', //加上边框
                    title: '提取模板',
                    area: ['420px', '240px'], //宽高
                    content: $('#mouldaddpop'),
                    btn: ['关闭', '确认'],
                    btn1: function () {
                        layer.close(layerTQ);
                        return false;
                    },
                    btn2: function () {
                        $('#addBtn').click();
                        return false;
                    }
                });
            }
        });
        $('#addBtn').click(function () {
            form.on('submit(addBtn)', function(data){
                var jsonParam = {
                    // orgId: '',
                    // depId: '',
                    type: data.field.type,
                    depict: data.field.depict,
                    title: data.field.title
                }
                getAjax('/sys/clin/save', jsonParam,function (resultMsg) {
                    layer.close(layerTQ);
                });
            });
        });
        // 模板选中
        $('#mouldpop').on('click', '.mouldpop-li', function () {
            $('#mouldpop .mouldpop-li').removeClass('mouldpop-act');
            $(this).addClass('mouldpop-act');
        })
        // 删除模板
        var delModel = null;
        $('#mouldpop').on('click', '.delete-btn', function () {
            var ids = $(this).parent().attr('ids');
            delModel = layer.open({
                id: 'login',
                type: 1,
                title: '提示',
                closeBtn: 0,
                skin: 'my-layui-layer', //样式类名
                area: ['360px', '180px'],
                shadeClose: true,
                shade: 0.2,
                content: '<div style="padding: 20px;">确定删除该模板吗？</div>', //iframe的url
                btn: ['关闭', '确认'],
                btn2: function () {
                    getAjax('/sys/clin/delete', {id: ids}, function (resultMsg) {
                        getModel(modelJson);
                        layer.close(delModel);
                    });
                    return false;
                }
            });
        });
        // 诊断编码
        var layerZD = null;
        var codeJson = {
            codeOrName: '',
            pageNo: '1',
            pageSize: '10',
        }
        $('.zdCode').click(function () {
            layerZD = layer.open({
                type: 1,
                skin: 'my-layui-layer', //加上边框
                title: '诊断编码',
                area: ['600px', '680px'], //宽高
                content: $('#zhenduanpop'),
                btn: ['关闭', '确认'],
                btn1: function () {
                    layer.close(layerZD);
                    return false;
                },
                btn2: function () {
                    $('#selectBtn').click();
                    return false;
                },
                success: function () {
                    codeJson.pageNo = '1';
                    pageobj.curr = '1';
                    getCode(codeJson);
                }
            });
        });
        $('#selectBtn').click(function () {
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });
        var active = {
            getCheckData: function(){ //获取选中数据
                var checkStatus = table.checkStatus('table');
                var data = checkStatus.data;
                if (data[0]) {
                    $('#zdCode').val(data[0].diseaseCode);
                    layer.close(layerZD);
                } else {
                    layer.msg('请选择诊断编码', {icon: 5,time:1000,anim: 6});
                }
            }
        };
        // code表格
        var tableobj = {
            elem: '#table',
            cols: [[
                {type: 'radio'},
                {field: 'diseaseName', title: '疾病名称', minWidth: 180, align: 'center', templet: function (obj) {
                        return '<div style="text-align: left">' + obj.diseaseName + '</div>'
                    }},
                {field: 'diseaseCode', title: '编码', minWidth: 80, align: 'center', templet: function (obj) {
                        return '<div style="text-align: left">' + obj.diseaseCode + '</div>'
                    }},
                {field: 'diseaseType', title: '属性', minWidth: 100, align: 'center', templet: function (obj) {
                        return '<div style="text-align: left">' + obj.diseaseType + '</div>'
                    }}
            ]],
            data: []
        };
        var pageobj = {
            elem: 'laypage',
            count: 0, //数据总数
            limit: 10,  //得到每页显示的条数
            curr: 1,  //得到当前页，以便向服务端请求对应页的数据。
            prev: '<em><</em>',
            next: '<em>></em>',
            layout: ['prev', 'page', 'next']
        };
        form.on('submit(searchCode)', function(data){
            if (data.field.codeOrName == '输入疾病名称') {
                data.field.codeOrName = '';
            }
            codeJson.codeOrName = data.field.codeOrName;
            getCode(codeJson);
        });
        pageobj.jump = function (obj) {
            codeJson.pageSize = obj.limit
            codeJson.pageNo = obj.curr
            getAjax('/turnout/getDiseaseList', codeJson, function (resultMsg) {
                $.each(resultMsg.data.list, function (i, item) {
                    if (item.diseaseCode == $('#zdCode').val()) {
                        item.LAY_CHECKED = true;
                    }
                });
                tableobj.data = resultMsg.data.list;
                tableobj.skin = 'line';
                table.render(tableobj);
            });
        };
        function getCode(codeJson) {
            getAjax('/turnout/getDiseaseList', codeJson, function (resultMsg) {
                tableobj.data = resultMsg.data.list;
                pageobj.count = resultMsg.data.count;
                tableobj.skin = 'line';
                table.render(tableobj);
                laypage.render(pageobj);
            });
        }

        // 联动接诊科室
        form.on('select(accOrgId)', function(data){
            getKeshi(data.value, '');
        });
        // 联动医生
        form.on('select(accDepId)', function(data){
            getYisheng(data.value, '');
        });
        function getAccOrg (orgId, vals) {
            $('#accOrgId').empty();
            layui.form.render("select");
            $('#accOrgId').append('<option value=""></option>');
            getAjax('/sys/org/getRelHosOrg', {'id': orgId}, function (resultMsg) {
                if (resultMsg.data.downOrgList == undefined || resultMsg.data.downOrgList.length == 0) {
                    // guanxi.js函数
                    // 增加判断，医生的不跳医院关系，直接返回上一层
                    // jumpGuanxi(orgId);
                    layer.msg('请联系管理员添加医院转诊关系',{
                        time:2000,
                        icon:5,
                        anim: 6
                    });
                } else {
                    $.each(resultMsg.data.downOrgList, function (i, item) {
                        $('#accOrgId').append('<option value="' + item.id + '">' + item.orgName + '</option>');
                    });
                    $('#accOrgId').val(vals);
                    layui.form.render("select");
                }
            });
        }
        function getKeshi (orgId, vals) {
            $("#accDepId").empty();
            layui.form.render("select");
            $('#accDepId').append('<option value=""></option>');
            getAjax('/sys/dep/getOrgDepList', {'orgId': orgId, 'pageSize': 1000}, function (resultMsg) {
                $.each(resultMsg.data.list, function (i, item) {
                    $('#accDepId').append('<option value="' + item.id + '">' + item.depName + '</option>');
                });
                $('#accDepId').val(vals);
                layui.form.render("select");
            });
        }
        function getYisheng (depId, vals) {
            $("#accDocName").empty();
            layui.form.render("select");
            $('#accDocName').append('<option value=""></option>');
            getAjax('/sys/user/getUserList', {'depId': depId}, function (resultMsg) {
                $.each(resultMsg.data, function (i, item) {
                    $('#accDocName').append('<option value="' + item.name + '-' + item.id + '">' + item.name + '</option>');
                });
                $('#accDocName').val(vals);
                layui.form.render("select");
            });
        }
        $('#province').empty();
        layui.form.render("select");
        getArea('province', '', '');
        // 联动下拉省市区街道
        form.on('select(province)', function(data){
            $("#city").empty();
            layui.form.render("select");
            getArea('city', data.value, '');
        });
        // 联动下拉省市区街道
        form.on('select(city)', function(data){
            $("#county").empty();
            layui.form.render("select");
            getArea('county', data.value, '');
        });
        // 联动下拉省市区街道
        form.on('select(county)', function(data){
            $("#town").empty();
            layui.form.render("select");
            getArea('town', data.value, '');
        });
        // 获取省市区街道下拉列表
        function getArea (elems, areaId, val) {
            $('#' + elems).append('<option value=""></option>');
            // 区划id  为空时查询所有省级区划  不为空查询下级区划
            getAjax('/sys/area/areaTree', {'areaId': areaId}, function (resultMsg) {
                var dataList = [];
                if (areaId != '') {
                    dataList = resultMsg.data[0].childList;
                } else {
                    dataList = resultMsg.data;
                }
                $.each(dataList, function (i, item) {
                    $('#' + elems).append('<option value="' + item.id + '">' + item.areaName + '</option>');
                });
                $('#' + elems).val(val);
                layui.form.render("select");
            });
        }
        form.on('submit(formSubmit)',function (data) {
            var filelist = [];
            $.each(fileObj.file1, function (i, item) {
                filelist.push(item);
            });
            $.each(fileObj.file2, function (i, item) {
                filelist.push(item);
            });
            var accDoc = data.field.accDocName;
            if (ids) {
                if (types == 'jszr') {
                    var jszrObj = data.field;
                    jszrObj.inId = ids;
                    jszrObj.filelistStr = JSON.stringify(filelist);
                    jszrObj.accDocName = accDoc.split('-')[0];
                    jszrObj.accDocId = accDoc.split('-')[1];
                    getAjax('/rotary/save', jszrObj,function (resultMsg) {
                        window.location.href = 'rotaryTransfer.html';
                    });
                } else {
                    var edisObj = data.field;
                    edisObj.filelistStr = JSON.stringify(filelist);
                    edisObj.id = ids;
                    edisObj.status = 0;
                    edisObj.accDocName = accDoc.split('-')[0];
                    edisObj.accDocId = accDoc.split('-')[1];
                    console.log(edisObj.accDocId);
                    getAjax('/rotary/save', edisObj,function (resultMsg) {
                        window.location.href = 'rotaryTransfer.html';
                    });
                }
            } else {
                var subObj = data.field;
                // subObj.inId = ''
                subObj.accDocName = accDoc.split('-')[0];
                subObj.accDocId = accDoc.split('-')[1];
                subObj.filelistStr = JSON.stringify(filelist);
                getAjax('/rotary/save', subObj,function (resultMsg) {
                    window.location.href = 'rotaryTransfer.html';
                });
            }
            return false;
        });
        var layerDA = null;
        $('#getDangan').click(function () {
            layerDA = layer.open({
                type: 1,
                skin: 'my-layui-layer', //加上边框
                title: '填写身份证号',
                area: ['420px', '240px'], //宽高
                content: $('#getDanganPop'),
                btn: ['关闭', '确认'],
                btn1: function () {
                    layer.close(layerDA);
                    return false;
                },
                btn2: function () {
                    $('#getDanganBtn').click();
                    return false;
                },
                success: function () {
                    if ($('#sfzh').val() != '') {
                        $('#sfzhpop').val($('#sfzh').val());
                    }
                }
            });
        });
        $('#getDanganBtn').click(function () {
            form.on('submit(getDanganBtn)', function(data){
                getAjax('/customer/getCustomerBySfzh', data.field,function (resultMsg) {
                    if (resultMsg.data == '') {
                        layer.msg('查不到该居民数据',{
                            time:2000,
                            icon:5,
                            anim: 6
                        });
                    } else {
                        $('input[name=name]').val(resultMsg.data.hzmc);
                        $('input[name=sfzh]').val(resultMsg.data.sfzh);
                        $('input[name=birthday]').val(resultMsg.data.csrq);
                        $('#sex').val(resultMsg.data.xb);
                        $('input[name=age]').val(resultMsg.data.nl);
                        $('input[name=birthday]').val(resultMsg.data.csrq);
                        $('input[name=telephone]').val(resultMsg.data.sj);
                        $('input[name=familyPhone]').val(resultMsg.data.lxdh);
                        $('input[name=dno]').val(resultMsg.data.jlh);
                        $('input[name=healthCard]').val(resultMsg.data.jbybkh);
                        $('#province').val(resultMsg.data.sheng);
                        $('#city').val(resultMsg.data.sbh);
                        $('#county').val(resultMsg.data.dqbh);
                        $('#town').val(resultMsg.data.xzbh);
                        $('input[name=adress]').val(resultMsg.data.jtzz);
                        $('textarea[name=jwz]').val(resultMsg.data.jwsDes);
                        $('textarea[name=gms]').val(resultMsg.data.gmsDes);
                        $('textarea[name=jzs]').val(resultMsg.data.jzsDes);
                        form.render('select');
                        layer.close(layerDA);
                    }
                });
                var jsonParam = new Object();
                jsonParam.doctorCode = "75";
                jsonParam.doctorName = "王艳玲";
                $.ajax({
                    type: 'POST',
                    dataType: "json",
                    async: false,
                    contentType: 'application/json',
                    url: 'http://192.168.2.2:8073/api/login/healthBrowser/index',
                    data: JSON.stringify(jsonParam),
                    beforeSend: function (XMLHttpRequest) {
                        XMLHttpRequest.setRequestHeader("orgId", "a9211734e03d47e9a6968ddca24e9c06");
                        XMLHttpRequest.setRequestHeader("authCode", "E1A477ED046549AA9A9D5FFE1EFA13C1");
                    },
                    success: function (resultMsg) {
                        if(resultMsg.retCode == 0){
                            window.open(resultMsg.data + '&sfzh=' + data.field.sfzh);
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log(errorThrown);
                    }
                });
            });
        });
        $('#sfzh').blur(function () {
            var sfzh = $(this).val();
            if (sfzh != '') {
                $('input[name=birthday]').val(IdCard(sfzh,1));
                $('#sex').val(IdCard(sfzh,2));
                layui.form.render("select");
                $('input[name=age]').val(IdCard(sfzh,3));
            }
        });
        function getYblx(vals){
            getAjax('/sys/dict/getYblxDict', {}, function (resultMsg) {
                if(resultMsg.retCode == '0'){
                    var html = '';
                    $.each(resultMsg.data, function (i, item) {
                        html += '<option value="'+item.code+'">'+item.name+'</option>';
                    })
                    $("#yblx").append(html);
                    $("#yblx").val(vals);
                    form.render('select');
                }
            });
        }
    });
})