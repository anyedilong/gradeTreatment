$(function () {
    layui.use(['form','laydate'], function(){
        var form = layui.form;
        var date = new Date;
        var y = date.getFullYear();
        getTime();
        getOrg();
        function getTime () {
            var year = '';
            for(var i = y; i > 2000; i--){
                year +=  '<option value="' + i + '">' + i + '年</option>';
            }
            $("#yearSel").append(year);
            $("#yearSel").val(y);
            var month = '';
            for(var i = 1; i <= 12; i++){
                if(i < 10){
                    month +=  '<option value="0'+i+'">' + i + '月</option>';
                }else{
                    month +=  '<option value="'+i+'">' + i + '月</option>';
                }
            }
            $("#monthSel").append(month);
            form.render();
        }
        function getOrg () {
            getAjax('/sys/org/queryOrgList', {}, function (resultMsg) {
                $.each(resultMsg.data, function (i, item) {
                    $("#orgSel").append('<option value="' + item.id + '">' + item.orgName + '</option>');
                });
                form.render();
            });
        }
        var jsonParam = {
            year: y,
            month: '',
            orgID: '',
        };
        form.on('submit(search)', function(data){
            getCharts(data.field);
            return false;
        });
        var lineC = echarts.init(document.getElementById('linecharts'));
        var pieC = echarts.init(document.getElementById('piecharts'));
        var barC = echarts.init(document.getElementById('barcharts'));
        var colors = ['#2BC807', '#F7AA2A'];
        var legData = ['转出','回转'];

        getCharts(jsonParam);
        function getCharts (jsonParam) {
            getAjax('/stat/statTurnOutAndRotrayTime', jsonParam, function (resultMsg) {
                console.log(resultMsg.data.accForList);
                // 曲线图
                var lineData = resultMsg.data.timeXList;
                var xdataline = [];
                $.each(lineData, function (i, item) {
                    if (jsonParam.month == '') {
                        xdataline.push(parseInt(item) + '月');
                    } else {
                        xdataline.push(item);
                    }
                });
                var lineoutData = resultMsg.data.timeY1List;
                var linerotData = resultMsg.data.timeY2List;
                var lineser = [
                    {
                        name: legData[0],
                        data: lineoutData,
                        type: 'line',
                        barWidth: 12,
                        smooth: true,
                        symbolSize: 0,
                        lineStyle: {
                            width: 3
                        }
                    },
                    {
                        name: legData[1],
                        data: linerotData,
                        type: 'line',
                        barWidth: 12,
                        smooth: true,
                        symbolSize: 0,
                        lineStyle: {
                            width: 3
                        }
                    },
                ];
                var lineCopt = chartOpt('转出统计',xdataline, colors, legData, lineser, 'line');
                lineC.setOption(lineCopt);
                // 饼图
                var pieser = resultMsg.data.accForList;
                var pieCopt = pieOpt('转出&回转占比', colors, legData, pieser);
                pieC.setOption(pieCopt);
                // 柱状图
                var xdatabar = resultMsg.data.orgXList;
                var baroutData = resultMsg.data.orgY1List;
                var barrotData = resultMsg.data.orgY2List;
                var barser = [
                    {
                        name: legData[0],
                        data: baroutData,
                        type: 'bar',
                        barWidth: 12
                    },
                    {
                        name: legData[1],
                        data: barrotData,
                        type: 'bar',
                        barWidth: 12
                    },
                ];
                var barCopt = chartOpt('医院转出统计',xdatabar, colors, legData, barser, 'shadow', 30);
                barC.setOption(barCopt);
            });
        }

        // 折线、柱状图函数
        function chartOpt(text, xData, colors, legendData, serData, type, rotate) {
            var opt = {
                title: {
                    text: text,
                    x: 'left',
                    textStyle: {
                        fontSize: 16,
                        color:'#43464D'
                    }
                },
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
                        },
                        interval: 0,
                        rotate: rotate
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
                            color: ['#E8EAED']
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
                    x: 'center', y: 'top',
                    textStyle: {color: '#C0C3C7',fontSize: 12},
                    itemWidth: 12,
                    itemHeight: 12,
                    icon: 'roundRect',
                    itemGap: 50,
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
        // 饼图
        function pieOpt(text, colors, legendData, serData) {
            var opt = {
                title: {
                    text: text,
                    x: 'left',
                    textStyle: {
                        fontSize: 16,
                        color:'#43464D'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                color: colors,
                stillShowZeroSum: false,
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    right: 0,
                    top: 0,
                    bottom: 20,
                    icon: 'square',
                    data: legendData,
                    selected: false
                },
                series: [
                    {
                        type: 'pie',
                        radius: '70%',
                        center: ['43%', '50%'],
                        data: serData,
                        label: {
                            normal: {
                                position: 'inner',//隐藏引导线
                                show : false//隐藏标识文字
                            }
                        },
                        itemStyle: {
                            emphasis: {
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
        function divResize () {
            lineC.resize();
            pieC.resize();
            barC.resize();
        }
        divResize();
        window.onresize = divResize;
    });
});