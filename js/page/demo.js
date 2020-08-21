$(function () {
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
    layui.use(['form','laydate', 'table', 'laypage'], function() {
        var laydate = layui.laydate;
        var form = layui.form;
        var table = layui.table;
        var laypage = layui.laypage;
        var jsonParams = {
            codeOrName: '', // 医院编码 或医院名称
            pageNo:1,
            pageSize:10
        };
        var jsonparamr = {
            id: ''
        }
        var upOrg = [] //上级转诊的医院
        var downOrg = [] //下级转诊的医院
        var flare = ''//当前医院
        var pos = ''//定位位置
        var sjList = [] //上级转诊医院id
        var xjList = [] //下级转诊医院id
        var dqId = '' //当前右侧显示详细医院的id
        var hosId = []   //正在添加的上级转诊id
        // 获取url医院值
        function getUrlParam(key) {
            var url = window.location.search;
            var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
            var result = url.substr(1).match(reg);
            return result ? decodeURIComponent(result[2]) : null;
        }
        //左侧医院列表点击
        $(".left_hospital").on("click", "li", function () {
            sjList = []
            $(this).addClass("active").siblings().removeClass("active")
            $(this).attr('ids')
            jsonparamr.id = $(this).attr('ids')
            dqId = $(this).attr('ids')
            getReferList(jsonparamr)
        })
        $("#getReferList").on("mouseover", ".refer_list", function () {
            var det = $(this).find(".det")
            var layuiBadge = $(this).find(".layui-badge")
            layuiBadge.hide()
            det.show()
            $(this).addClass("ishow")
        })
        $("#getReferList").on("mouseout", ".refer_list", function () {
            var det = $(this).find(".det")
            var layuiBadge = $(this).find(".layui-badge")
            det.hide()
            layuiBadge.show()
            $(this).removeClass("ishow")
        })
        // 左侧医院分页
        var hosPage = {
            elem: 'getPage'
            ,count: 0
            ,layout: ['prev', 'next']
            ,limit: 10  //得到每页显示的条数
            ,curr: 1 //得到当前页，以便向服务端请求对应页的数据。
            // ,jump: function(obj){
            //     console.log(obj)
            // }
        };
        // 搜索医院
        form.on('submit(search)', function(data){
            jsonParams.codeOrName = data.field.title
            getHosList(jsonParams)
            return false;
        });
        // 医院列表
        getHosList(jsonParams)
        function getHosList(jsonParams) {
            getAjax('/sys/org/getHosOrgList', jsonParams, function (resultMsg) {
                var html =''
                if(resultMsg.data.list.length == 0 || resultMsg.data.list == undefined){
                    html += '<li>暂无数据</li>'
                }else{
                    var hospitalId = getUrlParam("hospitalId");
                    $.each(resultMsg.data.list, function (i, item) {
                        if (hospitalId) {
                            jsonparamr.id = hospitalId
                            html += '<li ids="'+item.id+'" class="' + ((item.id == hospitalId) ? 'active' : '')  + '">'+item.orgName+'<span class="layui-badge">'+item.orgLevel+'</span></li>';
                        } else {
                            html += '<li ids="'+item.id+'" class=" ' + ((i == 0) ? 'active' : '') + ' ">'+item.orgName+'<span class="layui-badge">'+item.orgLevel+'</span></li>';
                            jsonparamr.id = resultMsg.data.list[0].id
                        }
                    })
                    dqId = resultMsg.data.list[0].id
                    getReferList(jsonparamr)
                }
                $(".left_hospital").html(html);
                hosPage.count = resultMsg.data.count;
                laypage.render(hosPage);
            });
        }
        hosPage.jump = function (obj) {
            jsonParams.pageSize = obj.limit;
            jsonParams.pageNo = obj.curr;
            getAjax('/sys/org/getHosOrgList', jsonParams, function (resultMsg) {
                // hosPage.count = resultMsg.data.count;
                var html =''
                if(resultMsg.data.list.length == 0 || resultMsg.data.list == undefined){
                    html += '<li>暂无数据</li>'
                }else{
                    var hospitalId = getUrlParam("hospitalId");
                    $.each(resultMsg.data.list, function (i, item) {
                        if (hospitalId) {
                            jsonparamr.id = hospitalId
                            html += '<li ids="'+item.id+'" class="' + ((item.id == hospitalId) ? 'active' : '')  + '">'+item.orgName+'<span class="layui-badge">'+item.orgLevel+'</span></li>';
                        } else {
                            html += '<li ids="'+item.id+'" class=" ' + ((i == 0) ? 'active' : '') + ' ">'+item.orgName+'<span class="layui-badge">'+item.orgLevel+'</span></li>';
                            jsonparamr.id = resultMsg.data.list[0].id
                        }
                    })
                    dqId = resultMsg.data.list[0].id
                    getReferList(jsonparamr)
                }
                $(".left_hospital").html(html)
            });
        };
        laypage.render(hosPage);
        // 右侧顶部上级转诊医院列表
        function getReferList(jsonparamr) {
            getAjax('/sys/org/getRelHosOrg', jsonparamr, function (resultMsg) {
                var html = ''
                $("#hospitalName").text(resultMsg.data.orgName)
                flare = resultMsg.data.orgName
                if(resultMsg.data.upOrgList == undefined){
                    html +=''
                    upOrg = []
                }else if(resultMsg.data.upOrgList.length == 0){
                    html +=''
                    upOrg = []
                }else{
                    $.each(resultMsg.data.upOrgList, function (i,item) {
                        item.name = item.orgName
                    })
                    // if(resultMsg.data.downOrgList !== undefined){
                    //     $.each(resultMsg.data.downOrgList, function (i,item) {
                    //         item.name = item.orgName
                    //     })
                    // }else{
                    //     downOrg = []
                    // }
                    upOrg = resultMsg.data.upOrgList
                    // downOrg = resultMsg.data.downOrgList
                    sjList = []
                    $.each(resultMsg.data.upOrgList, function (i,item) {
                        html += '<div class="bd_r refer_list">' +
                            '<div>'+item.name+'</div>' +
                            '<div class="tel"><i class="iconfont m-blue1">&#xe63a;</i>'+item.lnrPhone+'</div>' +
                            '<div class="to_address_box"><i class="iconfont m-blue1">&#xe634;</i><div class="address">'+item.orgAdress+'</div><div class="clear"></div></div>' +
                            '<span class="layui-badge">'+item.orgLevel+'</span>' +
                            '<img src="../img/btn_delete.png" alt="" class="det" ids = "'+item.rflId+'">' +
                            '</div>'
                        sjList.push(item.id)
                    })
                }
                if(resultMsg.data.downOrgList !== undefined){
                    xjList = []
                    $.each(resultMsg.data.downOrgList, function (i,item) {
                        item.name = item.orgName
                        xjList.push(item.id)
                    })
                    downOrg = resultMsg.data.downOrgList
                    pos = 'bottom'
                }else{
                    downOrg = []
                    pos = 'top'
                }
                $('#getReferList').html(html)
                referral(flare,upOrg,downOrg,pos)
            })
        }
        // 添加转诊医院
        //复选框选中监听,将选中的id 设置到缓存数组,或者删除缓存数组
        table.on('checkbox(dataList)', function (obj) {
            var ids= []
            if(obj.checked==true){
                if(obj.type=='one'){
                    ids.push(obj.data.id);
                }else{
                    for(var i=0;i<tableobj.data.length;i++){
                        ids.push(tableobj.data[i].id);
                    }
                }
            }else{
                if(obj.type=='one'){
                    for(var i=0;i<ids.length;i++){
                        if(ids[i]==obj.data.id){
                            ids.remove(i);
                        }
                    }
                }else{
                    for(var i=0;i<ids.length;i++){
                        for(var j=0;j<tableobj.data.length;j++){
                            if(ids[i]==tableobj.data[j].id){
                                ids.remove(i);
                            }
                        }
                    }
                }
            }
            console.log(ids)
        });
        var layerZD = null;
        $(".add_hospital").click(function () {
            sjList.push(dqId)
            // if(sjList.length !== 0){
            //     jsonParam.upOrgID = sjList.join(",");
            // }else{
            //     jsonParam.upOrgID = ''
            // }
            // jsonParam.upOrgID = sjList.join(",");
            getList(jsonParam);
            layerZD = layer.open({
                type: 1,
                skin: 'my-layui-layer', //加上边框
                title: '添加转诊医院',
                area: ['560px', '600px'], //宽高
                content: $('#zhenduanpop'),
                btn: ['取消', '确认'],
                btn1: function () {
                    layer.close(layerZD);
                    return false;
                },
                btn2: function () {
                    console.log(sjList)
                    // layui.table.checkStatus('table').data;
                    // $.each(layui.table.checkStatus('table').data,function (i,item) {
                    //     sjList.push(item.id)
                    // })
                    // console.log(sjList)
                    var jsonParamz = {
                        orgId: dqId,//当前医院ID
                        relOrgId: sjList.join(','),//上级医院ID，可一次选择多个机构，可用逗号隔开
                    }
                    // 添加转诊医院
                    getAjax('/sys/org/addRelHosOrg', jsonParamz, function (resultMsg) {
                        if(resultMsg.retMsg === '保存成功'){
                            layer.close(layerZD);
                            layer.msg('添加转诊医院成功')
                            getReferList(jsonparamr)
                        }else{
                            layer.msg('添加转诊医院失败')
                        }
                    });
                    return false;
                }
            });
        })
        // 添加转诊搜索
        form.on('submit(searchCode)', function(data){
            if (data.field.mouldtit == '输入医院名称/机构编码') {
                data.field.mouldtit = '';
            }
            jsonParam.codeOrName = data.field.mouldtit
            getList(jsonParam)
            return false;
        });
        // code表格
        // table =  $.extend(table, {config: {checkName: 'checked'}});
        var tableobj = {
            elem: '#table',
            cols: [[
                {type: 'checkbox'},
                {field: 'orgName', title: '医院名称', minWidth: 180},
                {field: 'orgCode', title: '机构编码', minWidth: 120},
                {field: 'orgLevel', title: '医院等级', minWidth: 100}
            ]],
            data: []
            ,done: function(res, page, count){
                // //可以自行添加判断的条件是否选中
                // //这句才是真正选中，通过设置关键字LAY_CHECKED为true选中，这里只对第一行选中
                // res.data[0]["LAY_CHECKED"]='true';
                // //下面三句是通过更改css来实现选中的效果
                // var index= res.data[0]['LAY_TABLE_INDEX'];
                // $('tr[data-index=' + index + '] input[type="checkbox"]').prop('checked', true);
                // $('tr[data-index=' + index + '] input[type="checkbox"]').next().addClass('layui-form-checked');
            }
        };
        var pageobj = {
            elem: 'laypage',
            count: 0, //数据总数
            limit: 10,  //得到每页显示的条数
            curr: 1,  //得到当前页，以便向服务端请求对应页的数据。
            prev: '<em><</em>',
            next: '<em>></em>',
            layout: ['count', 'prev', 'page', 'next']
        };
        var jsonParam = {
            pageNo: 1, // 起始页， 默认10
            pageSize: 10, // 页大小， 默认10
            codeOrName: '',
            upOrgID: ''//被选中的上级转诊医院
        };

        function getList(jsonParam) {
            jsonParam.upOrgID = dqId
            getAjax('/sys/org/getHosOrgList', jsonParam, function (resultMsg) {
                var upOrgIds= sjList.join(",");
                $.each(resultMsg.data.list, function (i, item) {
                    if (upOrgIds.indexOf(item.id) > -1) {
                        item.LAY_CHECKED = true;
                    }
                    // else{
                    //     item.LAY_CHECKED = true;
                    // }
                });
                tableobj.data = resultMsg.data.list;
                pageobj.count = resultMsg.data.count;
                table.render(tableobj);
                laypage.render(pageobj);
            });
        }
        // 去重
        function unique(arr){
            for(var i=0; i<arr.length; i++){
                for(var j=i+1; j<arr.length; j++){
                    if(arr[i]==arr[j]){         //第一个等同于第二个，splice方法删除第二个
                        arr.splice(j,1);
                        j--;
                    }
                }
            }
            return arr;
        }
        // 上下级关系图
        function referral(flare,upOrg,downOrg,pos){
            var zIndexS = 10
            var zIndexX = 10
            // var color2 = '#fff'
            // var bgColor2 = '#32B16C'
            var color1 = '#43464D'
            var bgColor1 = '#EBF8F1'
            if(upOrg.length == 0){
                zIndexS = 1
                zIndexX = 10
            }else if(downOrg.length == 0){
                zIndexS = 10
                zIndexX = 1
            }
            if(downOrg.length == 0 && upOrg.length == 0){
                color1 = '#fff'
                bgColor1 = '#32B16C'
            }
            var upCharts = echarts.init(document.getElementById('upCharts'));
            upCharts.showLoading();

            var data = {
                "name": flare,
                "children": downOrg
                //     [  //upOrg
                //     {
                //         "name": "data",
                //     },
                // ]
            };

            var data2 = {
                "name": flare,
                "children":upOrg
                //     [  // downOrg
                //     {
                //         "name": "flex",
                //     },
                // ]
            };
            upCharts.hideLoading();

            upCharts.setOption(option = {
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove'
                },
                // legend: {
                //     top: '2%',
                //     left: '3%',
                //
                //     data: [{
                //         name: '上级',
                //         icon: 'rectangle',
                //     },
                //         {
                //             name: '下级',
                //             icon: 'rectangle',
                //         }],
                //     // borderColor: '#c23531'
                // },
                series:[
                    {
                        type: 'tree',
                        name: '上级',
                        data: [data2],
                        top: '10%',
                        left: '5%',
                        bottom: '50%',
                        right: '5%',
                        orient: 'BT',
                        symbol: 'arrow',
                        z : zIndexS,
                        symbolSize: 7,
                        itemStyle: {
                            normal: {
                                borderWidth: 1,
                                borderColor: '#32B16C'
                            }
                        },
                        lineStyle: {
                            normal: {
                                color: '#32B16C',
                                curveness: 0.5
                            }
                        },
                        label: {
                            position: 'top',
                            verticalAlign: 'middle',
                            distance:20,
                            // align: 'right'
                            fontSize:14,
                            color: '#fff',
                            backgroundColor:'#32B16C',
                            padding: [8, 30],
                            borderRadius:20,
                        },
                        leaves: {
                            label: {
                                position: 'top',
                                verticalAlign: 'middle',
                                distance:20,
                                // align: 'left'
                                fontSize:14,
                                // color:'#43464D',
                                // backgroundColor:'#EBF8F1',
                                color:color1,
                                backgroundColor:bgColor1,
                                padding: [8, 30],
                                borderRadius:20,
                            }
                        },
                        expandAndCollapse: true,
                        animationDuration: 550,
                        animationDurationUpdate: 750
                    },
                    {
                        type: 'tree',
                        name: '下级',
                        data: [data],
                        top: '50%',
                        left: '5%',
                        bottom: '10%',
                        right: '5%',
                        orient: 'vertical',
                        symbol: 'arrow',
                        z : zIndexX,
                        symbolSize: 7,
                        itemStyle: {
                            normal: {
                                borderWidth: 1,
                                borderColor: '#32B16C'
                            }
                        },
                        lineStyle: {
                            normal: {
                                color: '#32B16C',
                                curveness: 0.5
                            }
                        },
                        label: {
                            position: 'top',
                            verticalAlign: 'middle',
                            distance:20,
                            // align: 'right'
                            fontSize:14,
                            color: '#fff',
                            backgroundColor:'#32B16C',
                            padding: [8, 30],
                            borderRadius:20,
                        },
                        leaves: {
                            label: {
                                position: pos,
                                verticalAlign: 'middle',
                                distance:20,
                                // align: 'left'
                                fontSize:14,
                                color: color1,
                                backgroundColor:bgColor1,
                                // color:'#fff',
                                // backgroundColor:'#32B16C',
                                padding: [8, 30],
                                borderRadius:20,
                            }
                        },
                        expandAndCollapse: true,
                        animationDuration: 550,
                        animationDurationUpdate: 750
                    }
                ]
            });
            window.onresize = resize;
            function resize() {
                upCharts.resize();
            }
        }
        pageobj.jump = function (obj) {
            // layui.table.checkStatus('table').data;
            // $.each(layui.table.checkStatus('table').data,function (i,item) {
            //     hosId.push(item.id)
            // })
            // function unique(hosId){
            //     for(var i=0; i<hosId.length; i++){
            //         for(var j=i+1; j<hosId.length; j++){
            //             if(hosId[i]==hosId[j]){         //第一个等同于第二个，splice方法删除第二个
            //                 hosId.splice(j,1);
            //                 j--;
            //             }
            //         }
            //     }
            //     return hosId;
            // }
            // console.log(unique(hosId))
            jsonParam.pageSize = obj.limit;
            jsonParam.pageNo = obj.curr;
            getAjax('/sys/org/getHosOrgList', jsonParam, function (resultMsg) {
                var upOrgIds= sjList.join(",");
                $.each(resultMsg.data.list, function (i, item) {
                    if (upOrgIds.indexOf(item.id) > -1) {
                        item.LAY_CHECKED = true;
                    }
                });
                tableobj.data = resultMsg.data.list;
                table.render(tableobj);
            });
        };
        laypage.render(pageobj);
        // 删除上级转诊医院
        $("#getReferList").on("click",".det",function () {
            var zzId = $(this).attr("ids")
            var jsonParam = {
                upOrgId: sjList.join(","),
                downOrgId: xjList.join(",")
            }
            getAjax('/sys/org/quertRelTurnCount', jsonParam, function (resultMsg) {
                if(resultMsg.data > 0){
                    layer.open({
                        id: 'login',
                        type: 1,
                        title: '提示',
                        closeBtn: 0,
                        skin: 'my-layui-layer', //样式类名
                        area: ['360px', '180px'],
                        shadeClose: true,
                        shade: 0.2,
                        content: '<div style="padding: 20px;">您所删除的上级转诊医院，已有' + resultMsg.data+'条转诊单，是否要继续删除？</div>', //iframe的url
                        btn: ['关闭', '确认'],
                        btn2: function () {
                            var jsonParam = {
                                id: zzId
                            }
                            getAjax('/sys/org/deleteRelHosOrg', jsonParam, function (resultMsg) {
                                if(resultMsg.retMsg == '删除成功！'){
                                    getReferList(jsonparamr)
                                    layer.msg("删除成功！")
                                    function remove(i){
                                        var index = sjList.indexOf(i);
                                        sjList.splice(index, 1)
                                    }
                                    remove($(this).attr("ids"));
                                    console.log(sjList)
                                }else{
                                    layer.msg("删除失败！")
                                }
                            })
                            // return false;
                        }
                    });
                }else{
                    var jsonParam = {
                        id:zzId
                    }
                    getAjax('/sys/org/deleteRelHosOrg', jsonParam, function (resultMsg) {
                        if(resultMsg.retMsg == '删除成功！'){
                            getReferList(jsonparamr)
                            layer.msg("删除成功！")
                            function remove(i){
                                var index = sjList.indexOf(i);
                                sjList.splice(index, 1)
                            }
                            remove($(this).attr("ids"));
                            // unique(sjList)
                            console.log(sjList)
                        }else{
                            layer.msg("删除失败！")
                        }
                    })
                }
            })
            // layerDel = layer.open({
            //     id: 'login',
            //     type: 1,
            //     title: '提示',
            //     closeBtn: 0,
            //     skin: 'my-layui-layer', //样式类名
            //     area: ['360px', '180px'],
            //     shadeClose: true,
            //     shade: 0.2,
            //     content: '<div style="padding: 20px;">确定删除该条数据吗？</div>', //iframe的url
            //     btn: ['关闭', '确认'],
            //     btn2: function () {
            //         var jsonParam = {
            //             id:$(this).attr("ids")
            //         }
            //         getAjax('/sys/org/deleteRelHosOrg', jsonParam, function (resultMsg) {
            //             if(resultMsg.retMsg == '删除成功！'){
            //                 getReferList(jsonparamr)
            //                 layer.msg("删除成功！")
            //                 function remove(i){
            //                     var index = sjList.indexOf(i);
            //                     sjList.splice(index, 1)
            //                 }
            //                 remove($(this).attr("ids"));
            //                 // unique(sjList)
            //                 console.log(sjList)
            //             }else{
            //                 layer.msg("删除失败！")
            //             }
            //         })
            //         return false;
            //     }
            // });
            // var jsonParam = {
            //     id:$(this).attr("ids")
            // }
            // getAjax('/sys/org/deleteRelHosOrg', jsonParam, function (resultMsg) {
            //     if(resultMsg.retMsg == '删除成功！'){
            //         getReferList(jsonparamr)
            //         layer.msg("删除成功！")
            //         function remove(i){
            //             var index = sjList.indexOf(i);
            //             sjList.splice(index, 1)
            //         }
            //         remove($(this).attr("ids"));
            //         // unique(sjList)
            //         console.log(sjList)
            //     }else{
            //         layer.msg("删除失败！")
            //     }
            // })
        })
    })
})