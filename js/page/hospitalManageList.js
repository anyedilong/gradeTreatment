$(function () {
    layui.use(['form','table','laypage'], function(){
        var form = layui.form;
        var table = layui.table;
        var laypage = layui.laypage;
        var tableobj = {
            elem: '#table',
            cellMinWidth: 80,
            even: true,
            cols: [[
                {field: 'orgCode', title: '机构编码'},
                {field: 'orgName', title: '医院名称', minWidth: 200},
                {field: 'orgLevel', title: '医院等级'},
                {field: 'lnrName', title: '联系人姓名'},
                {field: 'lnrPhone', title: '联系电话'},
                {field: 'orgAdress', title: '医院地址'},
                {fixed: 'right', field:'#switchBtn', title: '状态', toolbar: '#switchBtn',minWidth: 100},
                {fixed: 'right', title: '管理', toolbar: '#barDemo',minWidth: 180}
            ]],
            data: []
        };

        form.verify({
            lxdh: function(value, item){ //value：表单的值、item：表单的DOM对象
                // 包括手机号和固定电话
                if(!new RegExp("^1[3456789]\\d{9}$").test(value) && !new RegExp("^(\\(\\d{3,4}\\)|\\d{3,4}-|\\s)?\\d{7,14}$").test(value)){
                    return '联系电话格式不正确';
                }
            },
            yymcLen: function (value, item) {
                if (value.length > 20 && item.name == 'orgCode') {
                    return '机构编码不能超过20个字符！'
                }
                if (value.length > 50 && item.name == 'orgName') {
                    return '医院名称不能超过50个字符';
                }
                if (value.length > 20 && item.name == 'lnrName') {
                    return '联系人姓名不能超过20个字符';
                }
                if (value.length > 20 && item.name == 'username') {
                    return '用户名不能超过20个字符';
                }
                if (value.length > 30 && item.name == 'orgAdress') {
                    return '详细地址不能超过30个字符';
                }
            },
            pass: function (value, item) {
                // if(!new RegExp("^[0-9a-zA-Z]+$").test(value)){
                //     return '登录密码请输入英文、数字或者他们的组合';
                // }
                // if (value.length > 12 || value.length < 6) {
                //     return '登录密码长度请在6到12位之间';
                // }
                if (!new RegExp("^[0-9A-Za-z]{6,12}$").test(value)) {
                    return '密码为6~12位的英文、数字或者他们的组合';
                }
            }
        });

        var btnArr = [];
        $.each(parent.menuYYGL, function (i, item) {
            btnArr.push(item.name);
        });
        if (btnArr.join(',').indexOf('新建') > -1) {
            $('.tableAddBtn').html('<i class="iconfont fl">&#xe61e;</i>' +
                '<span class="fl">添加医院</span>');
        } else {
            $('.tableAddBtn').html('');
        }
        console.log(btnArr);
        var tableI = null
        $.each(tableobj.cols[0], function (i, item) {
            if (item.toolbar == '#switchBtn') {
                tableI = i
            }
        });
        if (btnArr.join(',').indexOf('禁用(启用)') < 0) {
            tableobj.cols[0].splice(tableI, 1);
        }
        var pageobj = {
            elem: 'laypage',
            count: 0, //数据总数
            limit: 10,  //得到每页显示的条数
            curr: 1,  //得到当前页，以便向服务端请求对应页的数据。
            layout: ['count', 'prev', 'page', 'next']
        };
        var jsonParam = {
            pageNo: '1', // 起始页， 默认10
            pageSize: '10', // 页大小， 默认10
            codeOrName: ''
        };
        function getList (jsonParam) {
            getAjax('/sys/org/getHosOrgList', jsonParam, function (resultMsg) {
                tableobj.data = resultMsg.data.list;
                pageobj.count = resultMsg.data.count;
                table.render(tableobj);
                laypage.render(pageobj);
            });
        }
        getList(jsonParam);
        pageobj.jump = function (obj) {
            jsonParam.pageSize = obj.limit
            jsonParam.pageNo = obj.curr
            getAjax('/sys/org/getHosOrgList', jsonParam, function (resultMsg) {
                tableobj.data = resultMsg.data.list;
                table.render(tableobj);
            });
        };
        laypage.render(pageobj);
        form.on('submit(search)', function (data) {
            jsonParam.codeOrName = data.field.codeOrName;
            getList(jsonParam);
            return false; //很重要的一句话，不能删
        })
        //监听工具条
        var layerEdit = null;
        var layerDel = null;
        table.on('tool(dataList)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
            var formdata = obj.data; //获得当前行数据
            var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
            var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）
            if(layEvent === '修改'){ //修改
                $('input[name=id]').val('');
                $("#addform")[0].reset();
                layerEdit = layer.open({
                    type: 1,
                    skin: 'my-layui-layer', //加上边框
                    title: '修改医院',
                    area: ['680px', '600px'], //宽高
                    content: $('#popup-box'),
                    btn: ['关闭', '确认'],
                    btn1: function (index) {
                        layer.close(layerEdit);
                    },
                    btn2: function () {
                        $('#editBtn').click();
                        return false;
                    },
                    success: function(layero, index){
                        getAjax('/sys/org/getHosOrgDetail', {'id': formdata.id}, function (resultMsg) {
                            $('#username').attr('readonly', 'readonly');
                            $("#province").empty();
                            $("#city").empty();
                            $("#county").empty();
                            $("#town").empty();
                            getArea('province', '', resultMsg.data.province);
                            getArea('city', resultMsg.data.province, resultMsg.data.city);
                            getArea('county', resultMsg.data.city, resultMsg.data.county);
                            getArea('town', resultMsg.data.county, resultMsg.data.town);
                            form.val("addform", resultMsg.data);
                            form.render();
                        });
                    }
                });
            } else if(layEvent === '删除'){
                layerDel = layer.open({
                    id: 'login',
                    type: 1,
                    title: '提示',
                    closeBtn: 0,
                    skin: 'my-layui-layer', //样式类名
                    area: ['360px', '180px'],
                    shadeClose: true,
                    shade: 0.2,
                    content: '<div style="padding: 20px;">确定删除该条数据吗</div>', //iframe的url
                    btn: ['关闭', '确认'],
                    btn2: function () {
                        getAjax('/sys/org/deleteHosOrg', {id: formdata.id}, function (resultMsg) {
                            getList(jsonParam);
                            layer.close(layerDel);
                        }, function (resultMsg) {
                            // alert(123)
                            layer.close(layerDel);
                            tipFun(resultMsg);
                        });
                        return false;
                    }
                });
            } else if(layEvent === 'jumpPage'){
                // guanxi.js函数
                jumpGuanxi(formdata.id, jsonParam.pageNo);
            }
        });
        function tipFun (resultMsg) {
            var tip = layer.open({
                type: 1,
                title: '提示',
                skin: 'my-layui-layer', //样式类名
                area: ['360px', '180px'],
                shadeClose: true,
                shade: 0.2,
                content: '<div style="padding: 20px;">' + resultMsg.retMsg + '</div>', //iframe的url
                btn: ['关闭']
            });
        }
        //监听性别操作
        form.on('switch(statusByn)', function(obj){
            var oldstatus = $(this).attr('status');
            var checkdata = {
                id: this.value,
                status: (oldstatus == '0') ? '1' : '0',
            };
            getAjax('/sys/org/updateStatus', checkdata, function (resultMsg) {
                getList(jsonParam);
            });
        });
        var layerAdd = null;
        $('#doctorAdd').click(function () {
            $('input[name=id]').val('');
            $("#addform")[0].reset();
            layerAdd = layer.open({
                type: 1,
                skin: 'my-layui-layer', //加上边框
                title: '添加医院',
                area: ['680px', '600px'], //宽高
                content: $('#popup-box'),
                btn: ['关闭', '确认'],
                btn1: function (index) {
                    layer.close(layerAdd);
                },
                btn2: function () {
                    $('#addBtn').click();
                    return false;
                },
                success: function () {
                    $('#username').attr('readonly', false);
                    $("#province").empty();
                    $("#city").empty();
                    $("#county").empty();
                    $("#town").empty();
                    $("#city").append('<option value=""></option>');
                    $("#county").append('<option value=""></option>');
                    $("#town").append('<option value=""></option>');
                    getArea('province', '', '');
                }
            });
        });
        // 联动下拉省市区街道
        form.on('select(province)', function(data){
            $("#city").empty();
            // $("#county").empty();
            // $("#town").empty();
            getArea('city', data.value, '');
        });
        // 联动下拉省市区街道
        form.on('select(city)', function(data){
            $("#county").empty();
            // $("#town").empty();
            getArea('county', data.value, '');
        });
        // 联动下拉省市区街道
        form.on('select(county)', function(data){
            $("#town").empty();
            getArea('town', data.value, '');
        });
        $('#editBtn').click(function () {
            form.on('submit(editBtn)', function(data){
                var editData = data.field;
                getAjax('/sys/org/updateHosOrg', editData, function (resultMsg) {
                    layer.close(layerEdit);
                    getList(jsonParam);
                });
            });
        });
        $('#addBtn').click(function () {
            form.on('submit(addBtn)', function(data){
                var addData = data.field;
                addData.id = ''
                getAjax('/sys/org/addHospitalOrg', addData, function (resultMsg) {
                    layer.close(layerAdd);
                    getList(jsonParam);
                });
            });
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
    });
})