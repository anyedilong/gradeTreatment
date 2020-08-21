$(function () {
    var jsonParam = {
        year:'',
        month:'',
        depId:'', //科室标识
        type: '2'  // //类型 默认为1（1.转出 2.转入）
    }
    layui.use('form', function(){
        var form = layui.form
            ,layer = layui.layer
        var date = new Date;
        var y = date.getFullYear();
        getTime();
        function getTime () {
            var year = '';
            for(var i = y; i > 2000; i--){
                year +=  '<option value="' + i + '">' + i + '年</option>';
            }
            $("#yearList").append(year);
            $("#yearList").val(y);
            jsonParam.year = y;
            getCharts(jsonParam)
            var month = '';
            for(var i = 1; i <= 12; i++){
                if(i < 10){
                    month +=  '<option value="0'+i+'">' + i + '月</option>';
                }else{
                    month +=  '<option value="'+i+'">' + i + '月</option>';
                }
            }
            $("#monthList").append(month);
            form.render();
        }
        // 查询科室列表
        getArea();
        function getArea(){
            var jsonParamk = {
                codeOrName :'',
                pageSize:'1000',
                orgId : parent.loginUserInfo.orgId,
            }
            getAjax('/sys/dep/getOrgDepList', jsonParamk, function (resultMsg) {
                $.each(resultMsg.data.list, function (i, item) {
                    $("#deptList").append('<option value="' + item.depCode + '">' + item.depName + '</option>');
                });
                layui.form.render("select");
            })
        }
        //监听搜索
        form.on('submit(search)', function(data){
            jsonParam.year = data.field.year
            jsonParam.month = data.field.month
            jsonParam.depId = data.field.keshi
            getCharts(jsonParam)
            return false
        });
    });
    function getCharts(jsonParam){
        var color2 = ['#0E97FE', '#F7AA2A'];
        var legData2 = ['转入','回转'];
        var paiban = echarts.init(document.getElementById('barcharts'));
        var zhPie = echarts.init(document.getElementById("zhPie"));
        var ksZrPie = echarts.init(document.getElementById('ksZrPie'));
        var ksHzPie = echarts.init(document.getElementById('ksHzPie'));
        getAjax('/stats/statsTurnAndRotray', jsonParam, function (resultMsg) {
            var xdatabar = resultMsg.data.xList
                var barser = [
                    {
                        name: legData2[0],
                        data: resultMsg.data.y1List, //转出
                        // data: [320, 362, 301, 134, 590],
                        type: 'bar',
                        barWidth: 12
                    },
                    {
                        name: legData2[1],
                        data: resultMsg.data.y2List,  //回转
                        // data: [220, 332, 301, 334, 390],
                        type: 'bar',
                        barWidth: 12
                    },
                ];
                var paibanopt = chartOpt(xdatabar, color2, legData2, barser, 'shadow');
                paiban.setOption(paibanopt);
                // 转出、回转饼状图数据
                var zhPieopt = pieOpt(resultMsg.data.sumList)
                zhPie.setOption(zhPieopt);
                // 科室回转占比
                var ksHzPieopt = pieOpt(resultMsg.data.turnBackList)
                ksHzPie.setOption(ksHzPieopt);
                // 科室转出占比
                var ksZrPieopt = pieOpt(resultMsg.data.turnInList)
                ksZrPie.setOption(ksZrPieopt);
        });

        function chartOpt(xData, colors, legendData, serData , type) {
            var opt = {
                xAxis: {
                    type: 'category',
                    data: xData,
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color: '#F2F6FA',
                            width: '1'//坐标线的宽度
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#A3A8AE'
                        }
                    },
                },
                yAxis:  {
                    minInterval: 1,
                    type : 'value',
                    axisLine: {
                        lineStyle: {
                            type: 'solid',
                            color: 'none',//左边线的颜色
                            width: '1'//坐标线的宽度
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#A3A8AE'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: ['#F2F6FA']
                        }

                    }
                },
                grid: {
                    left: '3%',
                    right: '0%',
                    bottom: '3%',
                    containLabel: true
                },
                color: colors,
                legend: {
                    data: legendData,
                    x: 'right', y: 'top',
                    textStyle: {color: '#C0C3C7',fontSize: 12},
                    itemWidth: 12,
                    itemHeight: 12,
                    icon: 'roundRect',
                },
                series: serData,
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : type        // 默认为直线，可选为：'line' | 'shadow'
                    }
                }
            };
            return opt;
        }
        function pieOpt(data) {
            var opt = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                color: ['#32B16C', '#0091FF', '#F7AA2A', '#FD6161'],
                series: [
                    {
                        name: '转入&回转占比',
                        type: 'pie',
                        radius: '70%',
                        center: ['50%', '50%'],
                        data: data,
                        labelLine: {    //引导线设置
                            normal: {
                                show: true,   //引导线显示
                            }
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(128, 128, 128, 0.5)'
                            }
                        }
                    }
                ]
            }
            return opt;
        }

        window.onresize = resize;
        function resize() {
            paiban.resize();
            zhPie.resize();
            ksZrPie.resize();
            ksHzPie.resize();
        }
    }

})
window.onload=function(){
    function boxResize(){
        console.log(33)
        var b_box = $(".pie_box").width()
        if(b_box < 1500){
            $(".pie_box_t ").css("width","100%").css("margin-right","0")
        }else{
            $(".pie_box_t").css("width","32.6%")
            $(".mg_r").css("margin-right","1%")
        }
    }
    boxResize()
    window.onresize = boxResize;
}